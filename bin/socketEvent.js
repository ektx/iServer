
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const jade = require('pug');
const imCss = require('im-css');

const ifs = require('./ifiles');
const mkdir = require('./mkdirs');
const getModules = require('./getModule');
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

				// 归类文件
				for (let i = 0, l = proFiles.length; i < l; i++) {
					let _file = proFiles[i];
					let _pathDir = path.dirname(_file.path);

					_file.status = 'ready';
					_file.outPath = _file.path.replace(filePath, outPath);

					// 对输出的文件处理 将模板文件处理成 html
					if (/\.(ejs|pug)$/i.test(_file.outPath)) {
						_file.outPath = _file.outPath.replace(/\.(ejs|pug)$/i, '.html')
					}

					if (_file.type == 'dir') {
						if (path.basename(_file.path) === 'parts') {
							if (!(_file.path in module_dir))
								module_dir[_file.path] = []
						}

						if ( !/\/parts/.test(_file.path) ) {
							generate_dir.push( _file.outPath )
						}

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

							if (! ['.DS_Store'].includes(path.basename(_file.path)))
								generate_file.push( _file )
						}
					}

				}

				// 所有模板之间的的关联
				let allChildModule = getModuleChild( module_dir );

				// 得到变化过的模块文件
				let changeMod =	getChangeMode( module_dir );
				console.log('已经修改过的模板文件有:\n', changeMod)

				mkdir(generate_dir);

				console.log('文件夹生成完成\n', generate_dir)
				socket.emit('generate_dir_event', { 
					msg: '文件夹生成完成',
					success: true
				});

				/*
					输出静态资源
					@__file 文件信息
				*/
				let toOutFn = (__file) => {
					
					socket.emit('WILL_GENERATE_FILE', {
						file: __file
					})

					outPutFile(
						__file,
						(__file)=>{
							socket.emit('GENERATE_MAKE_FILE', {
							file: __file
						})
					})
				}

				/* 处理模板文件
					@__file 文件信息
				*/
				let doWithModFile = (__file) => {

					socket.emit('WILL_GENERATE_FILE', {
						file: __file
					})
					
					outputMod( 
						__file, 
						changeMod, 
						(__file)=>{
							socket.emit('GENERATE_MAKE_FILE', {
								file: __file
							})
						} 
					);
				}

				/*
					判断输出目录文件与源文件的关系
					@file 文件信息
					@errCallback 错误时处理方法
					@callback 正常情况下处理方法
				*/
				let fsStatStatus = (file, errCallback, callback) => {

					fs.stat(file.outPath, (err, stats) => {

						if (err) {
							errCallback(file);
							return
						}

						// 如果生成区的文件没有模板新时,我们就更新文件
						if (stats.mtime < file._stats.mtime) callback(file)
					})
				}

				for (let i = 0, l = generate_file.length; i < l; i++) {
					let __file = generate_file[i];
					let __fileExtName = path.extname( __file.path ); 

					// 模板文件处理
					if (['.ejs', '.jade', '.pug', '.css'].includes(__fileExtName) ) {
						fsStatStatus(generate_file[i], doWithModFile, doWithModFile)
					} 
					// 静态文件处理
					else {

						fsStatStatus(generate_file[i], toOutFn, toOutFn)
						
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
		let version = {};
		let verChange = false;
		let moduleArr = moduleFiles[val];

		try {
			version = require(versionPath)
		} catch (err) {
			version = {};
			console.log('没有 version !')
		}

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
					console.log('添加了:', version, _file.name);
					version[_file.name] = _fileMTime;
					verChange = true;
					changeMod.push(_file);
				}
			}

		}

		// 更新或生成版本控制文件
		if (verChange) {
			console.log('更新或生成版本控制文件', version);

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

	let readS = fs.createReadStream(file.path);
	let writeS = fs.createWriteStream(file.outPath);

	readS.pipe( writeS );

	if (callback) callback(file)

}


// 输出文件
// @fileName 文件名
// @_url 原始路径
// @_curl 复制目标路径
function outputMod(file, changeMod, callback) {
	let html = '';
	let fileExtName = path.extname(file.path);

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


	let ejsGenHTMLOption = (file, callback) => {

		let read = fs.readFileSync(file.path, 'utf8');

		html = ejs.render(read, {filename: file.path});

		generateHTML(file, html, callback);
	}

	if (fileExtName == '.ejs') {
		let _basename = path.basename(file.outPath, '.ejs');
		let _dirname = path.dirname(file.outPath);

		file.outPath = file.outPath.replace('.ejs', '.html')

		fs.stat( path.join(_dirname, _basename+'.html'), (err, stats) => {
			// 没有数据时,渲染生成
			if (err) {

				ejsGenHTMLOption(file, callback);
				return;
			}

			// 已经有的情况
			// 1. 如果自己的修改时间比生成的文件时间要新,更新
			if (stats.mtime < file._stats.mtime) {
				console.log(file.name ,'文件最近已经修改,准备生成...');

				ejsGenHTMLOption(file, callback);

			}
			// 2. 如果自己没有修改过,我们查看它所有调用过的模块有没有更新过
			else {
				let mods = getModules( file.path, true );
				let hasMod = false;

				console.log('当前文件调用过以下模块:\n', mods);

				for (let val of changeMod) {
					if (mods.includes( val )) {
						hasMod = true;
						break;
					}
				}

				if (hasMod) {
					ejsGenHTMLOption(file, callback);
				}
			}

		})


	} 
	else if (fileExtName === '.pug') {
		// html = jade.renderFile( _url );

		generateHTML(file, html, callback)
	}
	// 对 css 处理
	else if (fileExtName === '.css') {

		imCss({
			file: file.path,
			out: file.outPath
		}, (result) => {

			if (result.save) callback( file )
		})
	}



}

/*
	输出所有模块之间的关联
	-----------------------------------
*/
function getModuleChild( files ) {

	let result = {};

	for ( let dirName in files) {

		let dirFiles = files[dirName]

		for (let i = 0, l = dirFiles.length; i < l; i++) {

			if (dirFiles[i].name.endsWith('.ejs')) {
				let mods = getModules( dirFiles[i].path, true );

				if ( mods.length > 0)
					result[dirFiles[i].path] = mods

			}
		}
	}

	console.log('所有模块的内容:', result );

	return result;
}