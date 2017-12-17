
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const jade = require('pug');
const imCss = require('im-css')
const UglifyJS = require('uglify-es')
const cssnano = require('cssnano')

const ifs = require('./ifiles');
const mkdir = require('./mkdirs');
const getModules = require('./getModule');
const beautify_html = require('js-beautify').html;

const statAsync = require('./statAsync')
const writeFileAsync = require('./writeFileAsync')

/*
	socketEvent 
	-----------------------------------
	归属: tool
	说明: 用于存放 socket 事件
*/

function socket (io) {

	let LOCK_GENERATE = false;

	io.on('connection', (socket) => {
		socket.emit('HELLO_WORLD', { msg: 'Welcome Use iTools!'});

		/*
			data = {
				path: '..', // 原目录
				out: '..',  // 输出目录
				// 规则，指明下面 3种文件是否要压缩
				// 默认只会压缩这3种文件
				rules: {
					html: true,
					css: true,
					js: true
				}
			}
		*/
		socket.on('START_MAKE_PROJECT', async function(data) {
			console.log('\n\n===================================')
			console.log( new Date().toLocaleString() )
			console.log( data )
			console.log('===================================')

			let fromPath = path.join(process.cwd(), decodeURI(data.path))
			fromPath = fromPath.endsWith('/') ? fromPath.slice(0, -1) : fromPath;

			let address = {
				origin: data.path,
				from: fromPath,
				to: fromPath + '_HTML'
			}

			let fileInfo = await statAsync(fromPath)

			// 用户输入文件夹不存在
			if (fileInfo.code === 'ENOENT') {
				sendIOErrorMsg(socket, {
					msg: '此文件夹不存在!',
					err: fileInfo
				})
				return
			}

			// 目前只对目录进行优化操作
			if (fileInfo.isDir) {
				IODoWithDirPro(address, true, socket)
			}
		})
	})

}

module.exports = socket;

/*
	处理文件夹项目
	-----------------------------------------
	@address 地址，项目的地址信息，包含 from 和 to
	@deep 是否要处理文件夹内的子文件夹，默认 true
	@socket 接口
*/
async function IODoWithDirPro (address, deep = true, socket) {

	// 遍历文件夹
	function loop (filePath) {
		return new Promise ((resolve, reject) => {
			let dirArr = []
			let filesArr = []
			
			fs.readdir(filePath, async function(err, files) {
				if (err) {
					console.log(err) 
					resject({
						msg: 'readir err',
						err
					})
				}
				else {
					
					for (let val of files) {
						// 过滤 Mac 上的以 . 命名的隐藏文件
						if (val.startsWith('.') || ['parts'].includes(val)) {
							continue
						} else {

							let fileInfo = await statAsync(filePath, val)
							let extname = path.extname(val)
							
							fileInfo.to = fileInfo.path.replace(address.from, address.to)
							fileInfo.from = fileInfo.path
							delete fileInfo.path

							if (fileInfo.isDir) {
								socket.emit('WILL_GENERATE_FILE', fileInfo)

								dirArr.push(fileInfo)
								
								if (deep) {
									let backData = await loop(fileInfo.from, deep, socket)
									dirArr = backData.dirArr.concat(dirArr)
									filesArr = backData.filesArr.concat(filesArr)
								}
							} else {

								filesArr.push(fileInfo)
								// 目前只对 css html js 进行优化处理
								socket.emit('WILL_GENERATE_FILE', fileInfo)
							}
						}
					}

					resolve({
						dirArr,
						filesArr
					})
				}
			})
		})
	}

	// 处理文件夹
	let backData = await loop(address.from)
	// console.log('backData', backData)
	let mkdirArr = []
	// 地址父级目录
	let toParentPath = path.dirname(address.to)

	// 所有目录创建好后回调
	// let mkDoneCallback = function() {
	// 	socket.emit('HELLO_WORLD', { msg: 'hhhh!'});
	// }

	// 单个文件夹创建好后回调
	let mkdirDoneCallback = function(data) {
		socket.emit('GENERATE_MAKE_FILE', path.join(toParentPath, data))
	}

	for (let i = 0, l = backData.dirArr.length; i < l; i++) {

		mkdirArr.push( backData.dirArr[i].to.replace(toParentPath, '') )
	}

	await mkdir(mkdirArr, toParentPath, null, mkdirDoneCallback)

	console.log('Ready dowith files ;)')

	let t = +new Date()
	for (let i = 0, l = backData.filesArr.length; i < l; i++) {
		await IODoWithFileToGOOD( backData.filesArr[i], socket)
	}
	// let dealWithFile = backData.filesArr.map(file => IODoWithFileToGOOD(file, socket))
	// await Promise.all(dealWithFile)
	let usetime = +new Date - t
	console.log('Use time:', usetime)

	socket.emit('PROJECT_DONE_SUCCESS', {
		success: true,
		msg: 'Complete this project!项目完成!',
		data: {
			runtime: usetime
		}
	})
}

function IODoWithFileToGOOD(fileInfo, socket) {
	return new Promise((resolve, reject) => {
		console.log('S', fileInfo.from)
		let type = path.extname(fileInfo.from)
		
		let doneEvt = function () {
			sendGenerateMakeFile(fileInfo.to, socket)
			console.log('E', fileInfo.from)
			resolve()
		}

		switch (type) {
			case '.css':
					CSSEvent(fileInfo.from, fileInfo.to, socket, doneEvt)
				break;

			case '.html':
					streamFile(fileInfo.from, fileInfo.to, doneEvt)
				break;

			case '.js':
					streamFile(fileInfo.from, fileInfo.to, doneEvt)
					// streamFile(fileInfo.from, fileInfo.to)
					// JSEvent(fileInfo.from, fileInfo.to, doneEvt)
					JSEvent(fileInfo.from, fileInfo.to)
				break;

			default:
					streamFile(fileInfo.from, fileInfo.to, doneEvt)
				break;
		}

	}).catch(err => {
		console.log('Error',err)
		reject(err)
	})
}

/*
	socket 广播文件生成成功信息
*/
function sendGenerateMakeFile(to, socket) {
	console.log('send', +new Date(), to)
	socket.emit('GENERATE_MAKE_FILE', to)
}

/*
	错误处理通知

	@socket 广播接口
	@msg [string|object] 信息
*/
function sendIOErrorMsg(socket, msg) {
	socket.emit('IO_ERROR_INFO', msg)
}

/*
	nodejs 流传输文件
*/
function streamFile(from, to, callback) {
	let RS = fs.createReadStream(from)
	let WS = fs.createWriteStream(to)

	RS.pipe(WS)	

	RS.on('end', () => {
		if (callback) callback()
	})
}

/*
	Css 优化处理工作
*/
function CSSEvent (from, to, socket, callback) {
	imCss({
		entryFile: from,
		outFile: to,
		min: true,
		callback: {
			out: (r)=> {
				callback()
			},

			min: r => {
				console.log('css min', r)
			}
		}
	})
}

/*
	Js 优化处理工作
*/
async function JSEvent (from, to, callback) {
	let data = fs.readFileSync(from, 'utf8')
	let result = UglifyJS.minify(data, {
		sourceMap: {
			url: path.basename(to) + '.map'
		}
	})

	if ( result.error) {
		console.log('Min js error ', error)
		return
	}

	await writeFileAsync(to.replace(/js$/, 'min.js'), result.code)
	await writeFileAsync(to +'.map', result.map)

	if (callback) callback()
}

// =============== OLD Eevnt =======================
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


/* 
	输出文件
	@file 文件名信息
	@changeMod 有修改有子模板集合
	@readCallback 准备生成提醒回调
	@callback 生成完成回调
*/
function outputMod(file, changeMod, readCallback, callback) {
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


	let getFileStat = (file, callback) => {

		console.log(`3. 处理模板文件中...`)

		fs.stat( file.outPath, (err, stats) => {
			// 没有数据时,渲染生成
			if (err) {

				console.log(`3.1 没有发现输出文件,生成文件 - ${file.path}`)
				readCallback(file);

				callback()
				return;
			}

			// 已经有的情况
			// 1. 如果自己的修改时间比生成的文件时间要新,更新
			if (stats.mtime < file._stats.mtime) {
				console.log(`3.1 文件较新,需要生成`)
				console.log(file.name ,'文件最近已经修改,准备生成...');
				
				readCallback(file);

				callback()

			}
			// 2. 如果自己没有修改过,我们查看它所有调用过的模块有没有更新过
			else {
				console.log(`3.1 判断模板是否有更新中...`)
				let mods = getModules( file.path, true );
				let hasMod = false;

				console.log(`${file.path}\n当前文件调用过以下模块:\n`, mods);

				for (let val of changeMod) {
					if (mods.includes( val.path )) {
						hasMod = true;
						break;
					}
				}

				if (hasMod) {
					readCallback(file);
					callback()
				} 
				// 没有修改
				else {

				}
			}

		})
	}

	console.log(`1. ${file.path} 文件已经准备`)

	if (fileExtName == '.ejs') {
		console.log(`2. 为 Ejs 模板文件`)

		getFileStat(file, () => {
			ejsGenHTMLOption(file, callback);
		})

	} 
	else if (fileExtName === '.pug') {
		// html = jade.renderFile( _url );

		generateHTML(file, html, callback)
	}
	// 对 css 处理
	else if (fileExtName === '.css') {

		imCss({
			entryFile: file.path,
			outFile: file.outPath,
			min: true,
			callback: {
				ready: r => {
					console.log('READY', r)
					readCallback(file)
				},

				out: (r)=> {
					console.log('SAVE', r)
					if (r.status) callback( file )
				},

				min: r => {
					console.log(r)
				}
			}
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


/*
	判断输出目录文件与源文件的关系
	@file 文件信息
	@errCallback 错误时处理方法
	@callback 正常情况下处理方法
*/
function fsStatStatus (file, errCallback, callback){

	fs.stat(file.outPath, (err, stats) => {

		if (err) {
			errCallback(file);
			return
		}

		// 如果生成区的文件没有模板新时,我们就更新文件
		if (stats.mtime < file._stats.mtime) callback(file)
	})
}