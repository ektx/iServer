/*
	IOJS EJS 表态页面生成器	                           v 0.0.1
	----------------------------------------------------------
	用于生成由ejs组成模板页面生成静态页面工具

	----------------------------------------------------------
	Kings  <myos.me>
*/

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');


var app = express();
var root = __dirname + '/public';
var i = 0;
var lost = [];

app.set('views', root);
// 设置默认文件为 ejs 
app.set('view engine', 'ejs');

app.use(express.static(root));


function readFile(path, cPath) {
	fs.readdir(path, function(err, files) {
		if (err) throw err;

		// console.log(files);
		// console.log(files.length);

		for (var i = 0; i < files.length; i++) {
			var _src = path + '/' + files[i];
			var _crc = cPath + '/' + files[i];
			checkFile(files[i], _src, _crc);
		}
	});
};


var copyPath = __dirname + '/html';
readFile(root, copyPath)


// 处理文件类型
function checkFile(fileName, _url, _curl) {

	fs.stat(_url, function(err, st) {
		if (err) throw err;

		// console.log(st);

		// 判断是否是文件
		if (st.isFile()) {
			// 如果是ejs模板文件 
			// 生成表态页面输出
			if (fileName.indexOf('.') > -1 && fileName.split('.')[1] === 'ejs') {
				fileName = fileName.split('.')[0];
				outputs(fileName);
			}
			// 其它类型文件一致原样输出
			else {
				// 在输出时否有同样名的文件
				// 主要为了解决 ejs 在生成之后产生新的html文件
				// 此时有移动文件与生成文件重名导致生成的文件混乱
				fs.exists(_curl, function(exists) {
					if (exists && fileName.indexOf('html') > -1) {
						console.log('x - ' + fileName);

					} else {
						var readS = fs.createReadStream(_url);
						var writeS = fs.createWriteStream(_curl);

						readS.pipe(writeS);
					}
				});
				 
			}
		}
		// 是文件夹
		else if (st.isDirectory()) {
			// 只要不是组件文件夹，文件夹可以复制
			if(fileName !== 'parts') {
				createFolders(_url, _curl);
			}
		}
		count(fileName);
	})
};


// 生成静态文件  -  存放在public下的文件 
function outputs(fileName) {
	app.render(fileName, function(err, html) {
		// console.log(html);
		fs.writeFile('html/'+ fileName +'.html', html, {encodeing:'utf8'});
	});
};


// 创建文件夹
function createFolders(src, curl) {
	fs.mkdir(curl, function() {
		readFile(src, curl)
	})
};


// 统计生成文件个数
function count(fileName) {
	i++;
	console.log(i + ' - ' +fileName);
}

