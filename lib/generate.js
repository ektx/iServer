/*
	静态页面生成器
	v 0.1.5
	----------------------------------------------------
	支持 ejs 或 jade模板文件共存,同时支持生成文件  
	修改文件生成方式,对没有发生变化的内容不再一起生成
*/


var http = require('http');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var jade = require('jade');


exports.generate = function(root, copyPath) {
	console.log('--------- GENERATE ---------')
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
	fs.stat(copyPath, function(err, stats) {

		if (err) { 
			// console.log(err);
			mkdirs(copyPath)
		} else {
			i= 0;

			readFile(root, copyPath)
		};

		console.log('Root Path: '+ root)
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
			var _fpath = '';

			if (path.extname(fileName) == '.ejs' || path.extname(fileName) == '.jade') {

				console.log(_curl)

				_fpath = getHTMLPath(fileName, _url, _curl);
				
			}

			// 判断要复制到的文件夹中是否已经有此文件了
			fs.stat(_fpath?_fpath: _curl, function(err, sts) {
				// 如果不存在,则生成
				if (err) {

					console.log(err)
					makeFiles(fileName, _url, _curl)
					return;
				}

				// 如果文件已经存在,则判断是否要更新
				if (sts.mtime < st.mtime) {
					makeFiles(fileName, _url, _curl)
				} else {
					console.log(' x - ' + fileName)
				}
			})

		} 
		// 是文件夹
		else if (st.isDirectory()) {
			// 复制非组件的文件夹
			if (fileName !== 'parts') createFolders(_url, _curl)
		}

	})
}


function outputs(fileName, _url, _curl) {
	var html = '';

	if (path.extname(fileName) == '.ejs') {

		var read = fs.readFileSync;

		html = ejs.render(read(_url, 'utf8'), {filename: _url});
	} else {
		html = jade.renderFile(_url)
	}

	fs.writeFile(getHTMLPath(fileName, _url, _curl), html, {encodeing:'utf8'})

}

// 获取html的路径
function getHTMLPath(fileName, _url, _curl) {
	var filesname = '', filespath = '';

	if (path.extname(fileName) == '.ejs') {

		filesname = path.basename(_curl, '.ejs')
		filespath = path.dirname(_curl, '.ejs')

	} else {

		filesname = path.basename(_curl, '.jade')
		filespath = path.dirname(_curl, '.jade')

	}

	return path.join(filespath, filesname+'.html');
}

// 处理文件
function makeFiles(fileName, _url, _curl) {
	console.log(' U - ' + _curl)

	// 如果文件是以 ejs 或是 jade 的类型
	if (path.extname(fileName) === '.ejs' || path.extname(fileName) === '.jade') {

		// 生成HTML
		outputs(fileName, _url, _curl);
	
	}
	// 除html以外直接复制
	else {

		var readS = fs.createReadStream(_url)
		var writeS = fs.createWriteStream(_curl)
		readS.pipe(writeS)
	}
}

function createFolders(src, curl) {
	fs.mkdir(curl, function() {
		// 读取要复制文件夹下内容
		readFile(src, curl)
	})
}
