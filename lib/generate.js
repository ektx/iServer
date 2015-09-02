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
var jade = require('jade');

var i = 0;


exports.generate = function(root, copyPath) {
	console.log('---------GENERATE---------')

	copyPath = path.normalize(copyPath);
	var delayPath = [];

	var mkdirs = function(toURL) {

		fs.mkdir(toURL, function(err) {
			// 生成文件夹错误,
			// 则去找上级生成,并把当前的缓存起来
			if (err) {
				
				delayPath.push(toURL);

				var _path = toURL.replace(/\\\w+$/, '')

				mkdirs(_path)

			} else {

				if (delayPath.length == 0) {
			
					i= 0;

					readFile(root, copyPath)
			
					return;
				}
				// 反向调用地址列表
				mkdirs(delayPath.reverse()[0])
				// 然后删除最初的那个
				delayPath.pop()
			}
		})

	}

	// 指定生成目录判断,创建
	fs.stat(copyPath, function(err, exists) {

		if (err) { 
			// console.log(err);
			mkdirs(copyPath)
		} else {
			i= 0;

			readFile(root, copyPath)
		};

		console.log(exists + ' '+ root)
	})

}

function readFile(path, cPath) {
	fs.readdir(path, function(err, files) {
		if (err) throw err;
		
		var fileLen = files.length;

		// 读取文件夹下的内容
		for (var i = 0; i < fileLen; i++) {
			var _src = path + '/' + files[i]
			var _crc = cPath + '/' + files[i]
			checkFile(files[i], _src, _crc)
		}
	})
}


function checkFile(fileName, _url, _curl) {
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

	var filesname = '', filespath = '';

	if (path.extname(fileName) == '.ejs') {

		var read = fs.readFileSync;

		var html = ejs.render(read(_url, 'utf8'), {filename: _url});

		filesname = path.basename(_curl, '.ejs')
		filespath = path.dirname(_curl, '.ejs')

	} else {
		var html = jade.renderFile(_url)

		filesname = path.basename(_curl, '.jade')
		filespath = path.dirname(_curl, '.jade')

	}
	
	fs.writeFile(path.join(filespath, filesname+'.html'), html, {encodeing:'utf8'})

}


function createFolders(src, curl) {
	fs.mkdir(curl, function() {
		// 读取要复制文件夹下内容
		readFile(src, curl)
	})
}

function count(fileName) {
	i++
	console.log(i+ ' - '+ fileName)
}