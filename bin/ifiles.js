
const fs = require('fs');
const path = require('path');

const ejs  = require('ejs');
const mime = require('mime');
const getIPs = require('./getIPs');
const rootServerPoot = require('../config')._port;

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


/*
	生成HTML
	@files 文件夹下的文件列表
	@filePath 文件夹路径
*/
function getHTML(files, filePath) {
	// console.log('>>>', req, res)
	let title = '', body = [], aURL;
	let zIP = getIPs().IPv4.public;
	let httpUrl = 'http://' + zIP +':'+rootServerPoot;

	title = path.basename(filePath);

	if (filePath.lastIndexOf('/') < 0) filePath += '\\';

	body.push('<!doctype html>')
	body.push('<html><head><meta charset="utf-8">')
	body.push('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">')
	body.push('<link rel="stylesheet" type="text/css" href="/server/css/layout.css">')
	body.push('<link rel="icon" type="image/x-icon" href="/server/favicon.png">')
	body.push('<title>'+title+'</title>')
	body.push('</head><body class="server-body">')
	body.push('<h3>'+title+'</h3>')
	body.push('<ul>')

	body.push(breadCrumbs(filePath));

	body.push("</li>")

	if (files.length > 0) {
		files.forEach(function(val, index) {
			// console.log(filePath + val)
			if ((val == 'css' || val == 'img') && filePath == __dirname + ' \\public') {
				console.log(val + ' not show windows')
			} else {
				let stat = fs.statSync(filePath + val);
				let filesIco = '';

				if (stat.isDirectory(val)) {
					aURL = val + '/'
					filesIco = '<svg aria-hidden="true"  height="16" version="1.1" viewBox="0 0 14 16" width="14"><path d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>';
				} else {
					aURL = val
					filesIco = '<svg aria-hidden="true"  height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>'
				}

				body.push('<li>'+filesIco+'<a href="'+aURL+'">'+val+'</a></li>')
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
	@req: 请求
	@res: 响应
	@serverRootPath: 根目录
	@reqPath: 请求路径
*/
exports.showDirecotry = (req, res, serverRootPath, reqPath) => {
	var html = '';
	let _filePath = path.join(serverRootPath, reqPath)

	fs.readdir(_filePath, function(err, files) {
		var html = getHTML(files, _filePath)
		res.writeHead(200, resHeaders());

		html += '<h5>共有 '+ files.length + ' 个文件!</h5>';
		html += '<p class="i-footer">Powered by <a href="https://github.com/ektx/iServer/">iServer 3</a></p></html>';
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
			resHeaders( mime.lookup(path.basename(filePath)) )
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
	res.writeHead(codeNo, resHeaders() );
	res.write('<h3>'+codeNo+'!</h2>');
	res.end()	
}

/*
	创建目录面包屑
	--------------------------------------------
*/
function breadCrumbs(filePath) {
	let _this_dir = path.normalize(filePath).replace(process.cwd(), '');

	let filelink = _this_dir.split(path.sep);
	let html = '';

	filelink.pop();

	html +='<li><a class="nav-tags" href="/">.</a>';

	filelink.forEach(function(val, i) {
		if (i == 0) return;
		
		html += '<a class="nav-tags" href="';
		for (let j = 0; j < filelink.length - i - 1; j++) {
			html += '../';
		}
		html += "\">"+ val+"</a>";
	});

	return html;

}


/*
	响应头
	---------------------------------------
*/
function resHeaders(type) {
	type = type || 'text/html';

	return {
		'Content-Type': type+';charset="utf8"',
		'x-xss-protection': '1; mode=block',
		'Server': 'iServer 3.0 beta'
	}
}