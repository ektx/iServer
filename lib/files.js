var fs = require('fs');
var path = require('path');
var mime = require('../node_modules/mime');

var fileLocation = '';

exports.serverStatic = function(req, res, pathname, root) {
	// 如果地址是 lib 中的文件,则不用添加 public
	if (pathname.lastIndexOf('/lib/') == 0) {
		fileLocation = path.join(root, pathname)
	}
	// 列出 public 下的文件
	else {
		fileLocation = path.join(root, pathname)
	}
	// console.log('here: ' +fileLocation + fs.existsSync(fileLocation))

	// 判断文件是否存在
	if (fs.existsSync(fileLocation)) {
		// 判断是否为文件夹
		var isDir = fs.statSync(fileLocation).isDirectory(pathname)

		if (isDir) {
			showDirecotry(req, res, fileLocation)
		} else {
			
			var stream = fs.createReadStream(fileLocation)

			stream.setEncoding('utf8')

			stream.on('error', function() {
				send505(res)
			})

			sendFile(res, fileLocation)

		} 
	} else {
		send404(res)
	}
}

function showDirecotry(req, res, filePath) {
	var html = '';

	fs.readdir(filePath, function(err, files) {
		var html = getHTML(files, filePath)
		res.writeHead(200, {'Content-Type': 'text/html;charset="utf8"'})
		res.write(html)
		res.write('<h5><a href="/:make" >生成静态页面</a> </h5>')
		res.write('<h5>共有 '+ files.length + ' 个文件!</h5>')
		res.write('<p class="i-footer">Powered by <a href="https://github.com/ektx/iServer/">iServer</a></p>')
		res.write('</html>')
		res.end()
	})
}


function getHTML(files, filePath) {
	var title = '', body = [], aURL

	if (path.basename(filePath) == 'public' && __dirname.length == filePath.length-1) {
		title = '/'
	} else {
		title = path.basename(filePath)
	}

	if (filePath.lastIndexOf('/') < 0) filePath += '\\'

	body.push('<!doctype html>')
	body.push('<html><head><meta charset="utf-8">')
	body.push('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">')
	body.push('<link rel="stylesheet" type="text/css" href="/lib/css/layout.css">')
	body.push('<title>'+title+'</title>')
	body.push('</head><body>')
	body.push('<h3>'+title+'</h3>')
	body.push('<ul>')

	if (root.length != filePath.length-1) {
		// body.push("<li><a href='..'>上一级</a></li>");

		// 创建目录面包屑
		var filelink = filePath.replace(__dirname,'').split('\\');
		var aFileLink = '';

		filelink.pop();
		filelink.pop();
		filelink.shift();

		body.push('<li><a class="nav-tags" href="/">.</a>');

		filelink.forEach(function(val, i) {
			if (i == 0) return;
			
			aFileLink += '<a class="nav-tags" href="';
			for (var j = 0; j < filelink.length - i - 1; j++) {
				aFileLink += '../';
			}
			aFileLink += "\">"+ val+"</a>";
		})
		// console.log('aFileLink:'+aFileLink);

		body.push(aFileLink);
		body.push("</li>")
	}

	if (files.length > 0) {
		files.forEach(function(val, index) {
			// console.log(filePath + val)
			if ((val == 'css' || val == 'img') && filePath == __dirname + ' \\public') {
				console.log(val + ' not show windows')
			} else {
				var stat = fs.statSync(filePath + val)

				if (stat.isDirectory(val)) {
					aURL = val + '/'
					aImg = 'folder'
				} else {
					aURL = val
					aImg = 'file'
				}

				body.push('<li><img class="osFileIco" src="/lib/img/'+ aImg +'.png"/><a href="'+aURL+'">'+val+'</a></li>')
			}
		})
	} else {
		body.push('<li><h2>No files in here!!</li>')
	}

	body.push('</ul></body>')

	return body.join('')
}

/*
	404 错误
	--------------------------------------------
*/
function send404(res) {
	console.log(fileLocation + ' 404!');
	res.writeHead(404, {'Content-Type': 'text/html; charset="utf8"'});
	res.write('<h3>404 Error!</h3>');
	res.write('<a href="/">返回首页</a>');
	res.end();	
}

function send505(res) {
	console.log(fileLocation + ' 505 Server Error!');
	res.writeHead(505, {'Content-Type': 'text/html; charset="utf8"'});
	res.write('<h3>505 Server Error!</h2>')	
}


function sendFile(res, filePath) {

	fs.readFile(filePath, function(err, file) {
		if (err) {
			send404(res);
		} else {
			res.writeHead(
				200, 
				{'Content-Type': mime.lookup(path.basename(filePath))}
			);
			res.end(file);
		}
	})
}
