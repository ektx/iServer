
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const jade = require('pug');

const ifs = require('./ifiles');
const mkdir = require('./mkdirs');
const beautify_html = require('js-beautify').html;

/*
	socketEvent 
	-----------------------------------
	归属: tool
	说明: 用于存放 socket 事件
*/

function socket (io) {

	let LOCK_GENERATE = false;

	io.on('connection', (socket) => {
		socket.emit('hello iserver', { msg: 'welcome use iServer!'});

		/*
			data = {
				path: '..', // 原目录
				out: '..',  // 输出目录
				mustOut: [boolean] // 是否严格使用给定目录
			}
		*/
		socket.on('start make project', (data) => {
			console.log( data )

			if(LOCK_GENERATE) {
				socket.emit('generate info', { msg: '目前已经有项目在生成,你稍候再试!'});

				LOCK_GENERATE = false;
			} else {
				LOCK_GENERATE = true;
				let filePath = path.join(process.cwd(), data.path);
				let outPath = '';
				let proFiles = ifs.findDirFiles(filePath, true);
				
				let module_dir = {};
				// 所有的模板文件
				let generate_dir = [];
				// 所有的生成页面
				let generate_file = [];

				// 使用给定的确定目录
				if (data.mustOut) {
					outPath = data.out;
				} else {
					outPath = path.join(process.cwd(), data.out)
				}

				for (let i = 0, l = proFiles.length; i < l; i++) {
					let _file = proFiles[i];
					let _pathDir = path.dirname(_file.path);

					_file.status = 'ready';
					_file.outPath = _file.path.replace(filePath, outPath);

					if (_file.type == 'dir') {
						if (path.basename(_file.path) === 'parts') {
							if (!(_file.path in module_dir))
								module_dir[_file.path] = []


						}

						generate_dir.push( _file.outPath )
					} else {
						if (/\/parts\//.test(_file.path)) {
							// 如果已经有存放区
							if (_pathDir in module_dir) {
								module_dir[_pathDir].push( _file )
							} 
							// 生成存放区
							else {
								module_dir[_pathDir] = [];
							}
						} else {
							generate_file.push( _file )
						}
					}

				}

				socket.emit('generate info', { msg: generate_file});
				// console.log(outPath)
				// console.log(proFiles)

				// 得到变化过的模块文件
				let changeMod =	getChangeMode( module_dir );

				mkdir(generate_dir);

				socket.emit('generate_dir_event', { 
					msg: '文件夹生成完成',
					success: true
				});

				// console.log('start make project:'+JSON.stringify(data));
				for (let i = 0, l = generate_file.length; i < l; i++) {
					let __file = generate_file[i];

					if (['.ejs', '.jade', '.pug', '.css'].includes( path.extname( generate_file[i].path ) )) {
						outPutFile(__file, (__file)=>{
							socket.emit('GENERATE_MAKE_FILE', {
								file: __file
							})
						})
					} else {
						fs.stat(generate_file[i].outPath, (err, stats) => {
							// 如果没有生成
							if (err) {
								outPutFile(generate_file[i], (__file)=> {
									socket.emit('GENERATE_MAKE_FILE', {
										file: __file
									})
								})
								return;
							}

							// 已经有的比较文件新旧
							if(stats.mtime < generate_file[i]._stats.mtime) {
								outPutFile(generate_file[i], (__file)=> {

									socket.emit('GENERATE_MAKE_FILE', {
										file: __file
									})
								})

							}

						})
					}
				}


			}
		});
	})

}

module.exports = socket;



function getChangeMode(moduleFiles) {
	let changeMod = [];

	for (let val in moduleFiles) {

		let versionPath = path.join(val, 'version.json');
		let version = require(versionPath);
		let verChange = false;
		let moduleArr = moduleFiles[val];

		for (let i = 0, l = moduleArr.length; i < l; i++) {

			let _file = moduleArr[i];

			let _fileInfo = fs.statSync( _file.path );

			let _fileMTime = new Date(_fileInfo.mtime).getTime();

			if (!(['.DS_Store', 'version.json'].includes(_file.name))) {

				// 文件存在
				if ( _file.name in version ) {
					if (_fileMTime > version[_file.name]) {
						console.log(_file.name+'文件模板更改了!');
						
						version[_file.name] = _fileMTime;
						changeMod.push(_file);
						verChange = true;

					}
				} 
				// 新加的模板我们加上
				else {
					console.log('添加了:', _file.name);
					version[_file.name] = _fileMTime;
					verChange = true;
					changeMod.push(_file);
				}
			}

		}

		// 更新或生成版本控制文件
		if (verChange) {
			console.log('更新或生成版本控制文件');

			fs.writeFile(versionPath, JSON.stringify(version), {encodeing: 'utf8'}, (err, data)=>{
				if (err) {
					console.log(err);
					return;
				}
			})
		}
	}

	return changeMod;
}


function outPutFile(file, callback) {
	let _extname = path.extname(file.path);

	switch (_extname) {

		// 如果文件是以 ejs 或是 jade 的类型
		case '.ejs':
		case '.jade':
			// 生成 HTML
			outputMod( file, callback );
			break;

		default:
			let readS = fs.createReadStream(file.path);
			let writeS = fs.createWriteStream(file.outPath);

			readS.pipe( writeS );

			if (callback) callback(file)

	}
}


// 输出文件
// @fileName 文件名
// @_url 原始路径
// @_curl 复制目标路径
function outputMod(file, callback) {
	let html = '';

	let generateHTML = (file, html, callback)=> {
		html = beautify_html( html, {
			"indent_size":"1",
			"indent_char":"\t",
			"max_preserve_newlines":"-1",
			"preserve_newlines":false,
			"keep_array_indentation":false,
			"break_chained_methods":false,
			"indent_scripts":"keep",
			"brace_style":"expand",
			"space_before_conditional":false,
			"unescape_strings":false,
			"jslint_happy":false,
			"end_with_newline": false,
			"wrap_line_length":"0",
			"indent_inner_html": true,
			"comma_first":false,
			"e4x":false
		} )

		fs.writeFile(file.outPath, html, {encodeing:'utf8'}, (err, written, string) => {
			if (callback) callback(file)
		})		
	}

	if (path.extname(file.path) == '.ejs') {
		let _basename = path.basename(file.outPath, '.ejs');
		let _dirname = path.dirname(file.outPath);

		file.outPath = file.outPath.replace('.ejs', '.html')

		fs.stat( path.join(_dirname, _basename+'.html'), (err, stats) => {
			// 没有数据时,渲染生成
			if (err) {

				let read = fs.readFileSync(file.path, 'utf8');

				html = ejs.render(read, {filename: file.path});

				generateHTML(file, html, callback);
				return;
			}

			// 已经有的情况

		})


	} else {
		html = jade.renderFile( _url );

		generateHTML(file, html, callback)
	}



}