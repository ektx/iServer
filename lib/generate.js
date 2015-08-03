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

		for (var i = 0; i < fileLen; i++) {
			var _src = path + '/' + files[i]
			var _crc = cPath + '/' + files[i]
			checkFile(files[i], _src, _crc, app, ifileServer)
		}
	})
}


function checkFile(fileName, _url, _curl, app, ifileServer) {
	fs.stat(_url, function(err, st) {
		if (err) throw err;

		if (st.isFile()) {
			if (path.extname(fileName) === '.ejs' || path.extname(fileName) === '.jade') {
				outputs(fileName, app, ifileServer);
			} else {
				fs.exists(_curl, function(exists) {
					// console.log('exists: '+ exists)
					if (exists && path.extname(fileName) === '.html') {
						console.log('x - ' + fileName)
					} else {
						var readS = fs.createReadStream(_url)
						var writeS = fs.createWriteStream(_curl)
						readS.pipe(writeS)
					}
				})
			}
		} else if (st.isDirectory()) {
			// 复制非组件的文件夹
			if (fileName !== 'parts') createFolders(_url, _curl)
		}

		count(fileName)
	})
}


function outputs(fileName, app, ifileServer) {

	if (path.extname(fileName) == '.ejs') fileName = path.basename(fileName, '.ejs')

	var filePath = ifileServer ? 'public/'+fileName : fileName;

	app.render(filePath, function(err, html) {
		if (err) console.log(err);
		if (path.extname(fileName) == '.jade') 
			fileName = path.basename(fileName, '.jade')

		fs.writeFile('html/'+ fileName + '.html', html, {encodeing:'utf8'})
	})
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