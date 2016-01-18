
var fs = require('fs');
var path = require('path');
var mime = require('../node_modules/mime');

// 智能生成文件夹
// 如果指定的文件夹的父级也不存在的话,则同时生成
exports.mkdirs = function (res, _path) {
	var delayPath = [];

	var toMk = function(_path) {
		fs.mkdir(_path, function(err) {
			if (err) {
				delayPath.push(_path);
				var _p = _path.replace(/\\\w+\\*$/, '');
				toMk(_p)
			} else {
				if (delayPath.length != 0) {
					toMk(delayPath.reverse()[0]);
					delayPath.pop();
				}
			}
		})

		res.redirect('/')
	}

	toMk(_path);
}



function getHTML(files, filePath) {
	var title = '', body = [], aURL

	title = path.basename(filePath)

	if (filePath.lastIndexOf('/') < 0) filePath += '\\';

	body.push('<!doctype html>')
	body.push('<html><head><meta charset="utf-8">')
	body.push('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">')
	body.push('<link rel="stylesheet" type="text/css" href="/bin/css/layout.css">')
	body.push('<link rel="icon" type="image/x-icon" href="/bin/favicon.png">')
	body.push('<title>'+title+'</title>')
	body.push('</head><body class="server-body">')
	body.push('<h3>'+title+'</h3>')
	body.push('<ul>')

	if (root.length != filePath.length-1) {
		// body.push("<li><a href='..'>上一级</a></li>");

		// 创建目录面包屑
		var _this_dir = __dirname.replace(/bin/, 'public');

		var filelink = path.normalize(filePath).replace(_this_dir,'').split('\\');
		var aFileLink = '';

		filelink.pop();

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

				body.push('<li><img class="osFileIco" src="/bin/img/'+ aImg +'.png"/><a href="'+aURL+'">'+val+'</a></li>')
			}
		})

	} else {
		body.push('<li><h2>没有发现任何文件!!</li>')
	}

	body.push('</ul></body>')

	return body.join('')
}

/*
	showDirecotry
	---------------------------------------------------
	@res: 响应
	@root: 根目录
	@reqPath: 请求路径
*/
exports.showDirecotry = function (res, root, reqPath) {
	var html = '';
	var _filePath = path.join(root, reqPath)

	fs.readdir(_filePath, function(err, files) {
		var html = getHTML(files, _filePath)
		res.writeHead(200, {'Content-Type': 'text/html;charset="utf8"'})

		html += '<h5>共有 '+ files.length + ' 个文件!</h5>';
		html += '<p class="i-footer">Powered by <a href="https://github.com/ektx/iServer/">iServer 2</a></p></html>';
		res.write(html)
		res.end()
	})
}


/*
	sendFile
	----------------------------------------------
	@res: 响应
	@filePath: 文件路径
*/
exports.sendFile = function(req, res, filePath) {

	var stat = fs.statSync(filePath);
	var total = stat.size;

	if (req.headers['range']) {
		var range = req.headers.range;
		var parts = range.replace(/bytes=/, '').split('-');
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total -1;
 
        var chunksize = (end - start) + 1;

        console.log('RANGE: ' + start+' - '+ end+ ' = '+ chunksize);
        console.log('----------------------------------------');

        res.setHeader("Content-Type",mime.lookup(path.basename(filePath)));

        if (parts) {
            res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
            res.setHeader("Content-Length", chunksize);
            res.writeHead('206', "Partial Content");
            
            var stream = fs.createReadStream(filePath, {start: start, end: end});
            stream.pipe(res)
            
        } else {
            res.removeHeader("Content-Length");
            res.writeHead(416, "Request Range Not Satisfiable");
            res.end();
        }
	} else {

		var stream = fs.createReadStream(filePath);

		stream.on('error', function() {
			sendError(res, 505)
		})

		// stream.on('data', function(chunk) {
		// 	console.log(chunk)
		// })

		mime.define({
			'text/css': ['scss']
		})

		res.writeHead(
			200,
			{'Content-Type': mime.lookup(path.basename(filePath))}
		)
		stream.pipe(res);
	}

}


/*
	响应码
	--------------------------------------------
*/
exports.sendError = function sendError(res, codeNo) {
	// console.log(codeNo + ' Server Error!');
	res.writeHead(codeNo, {'Content-Type': 'text/html; charset=UTF-8'});
	res.write('<h3>'+codeNo+'!</h2>');
	res.end()	
}
