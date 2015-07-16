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
		fileLocation = path.join(root, '/public', pathname)
	}
	console.log('here: ' +fileLocation + fs.existsSync(fileLocation))

	// 判断文件是否存在
	if (fs.existsSync(fileLocation)) {
		// 判断是否为文件夹
		var isDir = fs.statSync(fileLocation).isDirectory(pathname)

		console.log('isDir:'+isDir)
		if (isDir) {
			showDirecotry(req, res, fileLocation)
		}

	}
}

function showDirecotry(req, res, filePath) {
	var html = '';

	fs.readdir(filePath, function(err, files) {
		var html = getHTML(files, filePath)

		res.writeHead(200, {'Content-Type': 'text/html;charset="utf8"'})
		res.write(html)
		res.write('<h5><a href="/:make" >生成静态页面</a></h5>')
		res.write('<h5>共有 '+ files.length + ' 个文件!</h5>')
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
	console.log(filePath)

	body.push('<!doctype html>')
	body.push('<html><head><meta charset="utf-8">')
	body.push('<link rel="stylesheet" type="type/css" href="/lib/css/layout.css">')
	body.push('<title>'+title+'</title>')
	body.push('</head><body>')
	body.push('<h3>'+title+'</h3>')
	body.push('<ul>')

	if (__dirname.length != filePath.length - 1) {
		var filelink = filePath.replace(__dirname, '').split('\\')
		var aFileLink = ''

		filelink.pop()
		filelink.splice(0, 2)

		body.push('<li><a href="/">.</a>')
		filelink.forEach(function(val, i) {
			if (i == 0) return

			aFileLink += '<a class="nav-tags" href="'
			for (var j = 0; j < filelink.length - i - 1; j++) {
				aFileLink += '../'
			}
			aFileLink += '">'+ val + '</a>'
		})

		body.push(aFileLink)
		body.push('</li>')

	}

	if (files.length > 0) {
		files.forEach(function(val, index) {
			console.log(filePath + val)
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

				body.push('<li><img class="osFileIco" src="../lib/img/'+ aImg +'.png"/><a href="/public/'+aURL+'">'+val+'</a></li>')
			}
		})
	} else {
		body.push('<li><h2>No files in here!!</li>')
	}

	body.push('</ul></body>')

	return body.join('')
}