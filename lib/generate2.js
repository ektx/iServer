/*
	静态页面生成器
	v 0.1.0
	----------------------------------------------------
	支持 ejs 或 jade模板文件共存,同时支持生成文件  
	修改了代码的处理方式
*/


var http = require('http');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');

var i = 0;


exports.generate = function(root, copyPath, app, ifileServer) {
	// 指定生成目录判断,创建
	fs.exists(copyPath, function(exists) {
		// console.log(exists + ' '+ root)
		if (!exists) {
			fs.mkdir(copyPath)
		}
	})

	readFile(root, copyPath, app, ifileServer)
}

function readFile(path, cPath, app, ifileServer) {
	fs.readdir(path, function(err, files) {
		if (err) throw err;
		
		var fileLen = files.length;

		// console.log(files)

		// 读取文件夹下的内容
		for (var i = 0; i < fileLen; i++) {
			var _src = path + '/' + files[i]
			// console.log(_src)
			var _crc = cPath + '/' + files[i]
			checkFile(files[i], _src, _crc, app, ifileServer)
		}
	})
}


function checkFile(fileName, _url, _curl, app, ifileServer) {
	fs.stat(_url, function(err, st) {
		if (err) throw err;

		// 是文件
		if (st.isFile()) {

			// 如果文件是以 ejs 或是 jade 的类型
			if (path.extname(fileName) === '.ejs' || path.extname(fileName) === '.jade') {

				// 生成HTML
				outputs(fileName, _url, _curl);
			
			} else {
				// 判断要复制到的文件夹中是否已经有此文件了
				fs.exists(_curl, function(exists) {
					// console.log('exists: '+ exists)

					// 如果存在且是html格式文件的话,不在复制过去
					if (exists && path.extname(fileName) === '.html') {
						console.log('x - ' + fileName)
					} 
					// 除html以外直接复制
					else {
						var readS = fs.createReadStream(_url)
						var writeS = fs.createWriteStream(_curl)
						readS.pipe(writeS)
					}
				})
			}
		} 
		// 是文件夹
		else if (st.isDirectory()) {
			// 复制非组件的文件夹
			if (fileName !== 'parts') createFolders(_url, _curl)
		}

		count(fileName)
	})
}


function outputs(fileName, _url, _curl) {

	if (path.extname(fileName) == '.ejs') {

		console.log('fileName:'+fileName)
		console.log('_url:'+_url)
		console.log('_curl:'+_curl)

		var read = fs.readFileSync;

		// var html = ejs.compile(read(_url, 'utf8'), {filename: _url})(json);
		var html = ejs.compile(read(_url, 'utf8'), {filename: _url});

		console.log('\n'+html)
	}



	// var filePath = ifileServer ? 'public/'+fileName : fileName;

	// app.render(filePath, function(err, html) {
	// 	if (err) console.log(err);
	// 	if (path.extname(fileName) == '.jade') 
	// 		fileName = path.basename(fileName, '.jade')

	// 	fs.writeFile('html/'+ fileName + '.html', html, {encodeing:'utf8'})
	// })
}


function createFolders(src, curl) {
	fs.mkdir(curl, function() {
		readFile(src, curl)
	})
}

function count(fileName) {
	i++
	console.log(i+ ' - '+ fileName)
}