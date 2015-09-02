/*
	iServer
	-----------------------------------------------

*/

'use strict';

var express = require('express')
var http = require('http')
var fs = require('fs')
var url = require('url')
var path = require('path')
var os = require('os')

var generate = require('./lib/generate.js')
var ifiles = require('./lib/files.js')
var comStr = require('./lib/commandStr')
var open = require('./lib/open')


// 服务器网络信息
var ifaces = os.networkInterfaces()
var addresses = []

// 默认设置
// 是否需要文件服务器 true 是; false 否
var ifileServer = comStr.commandStr(['fileServer','f'], false);
// 默认端口设置
var port = comStr.commandStr(['port','p'], 8000);
var browserName = 'Off';


for (var i in ifaces) {
	for (var ii in ifaces[i]) {
		var address = ifaces[i][ii];
		if (address.family === 'IPv4') {
			addresses.push(address.address);
		}
	}

};

function openBrowser() {
	var openAppName = comStr.commandStr(['open','o'], '');
	if (openAppName) {
		var url = 'http://'+addresses[0]+':'+port;

		openAppName = openAppName == 'true' ? '' : openAppName;
		
		open(url, openAppName)

		browserName = openAppName == '' ? 'default': openAppName;
	}

	return browserName;
}


var app = express()
var root = !ifileServer ? __dirname + '/public' : __dirname;

app.set('views', root)
// app.set('view engine', 'jade')
app.set('view engine', 'ejs')
// app.engine('.jade', require('jade').__express)
app.use(express.static(root))

app.get('/favicon.ico', function(req, res) {
	res.end();
	return
})


app.get('*', function(req, res) {
	var _path = decodeURI(req.path)

	console.log('用户IP:' + req.ip)
	console.log(req.method + ' ' + _path)

	var _filePath;
	if (_path.split('.')[1] == 'html') {
		_filePath = _path.split('.')[0].replace('/', '')
	} else {
		_filePath = _path
	}

	// 生成静态页面
	if (_filePath === '/:make') {
		var copyPath = __dirname + '/html'
		var root = __dirname + '/Public'

		generate.generate(root, copyPath);
		res.send('<h2>生成页面完成,请查看html文件夹</h2>')
		return;
	}

	console.log(req.method + '-' + _filePath)

	if (isDir(_path)) {
		if (_filePath === '/') {

			if (ifileServer) {
				res.redirect('/public/')
			} else {
				res.render('demo')
			}

		} else {

			if (ifileServer) {

				var pathname = decodeURI(url.parse(req.url).pathname)
				ifiles.serverStatic(req, res, pathname, __dirname)

			} else {
				res.redirect('/')
			}

		}
		return
	} else {

		var lastWord = _filePath.lastIndexOf('_jade')

		if (lastWord > 0 && lastWord + 5 == _filePath.length) {
			
			_filePath = _filePath.replace(/(_jade)$/g, '.jade').substr(1)
			
			res.render(_filePath)

		} else {
			
			renderFile(res, _filePath)
		}

	}

});

/*
	判断路径是否为目录
*/
function isDir(_path) {
	var __path = path.join(__dirname, _path)

	if (fs.existsSync(__path)) {

		var isDir = fs.statSync(__path).isDirectory(_path)
		
		return isDir;
	} else {
		return false
	}
}


/*
	解析文件
*/
function renderFile(res, _path) {


	// 错误处理
	res.render(_path, function(err, html) {
		// 如果不存在此页面
		if (err) {
			console.log(err)
			res.status(404).send('<h2>404</h2>')
		} else {
			res.send(html)
		}

	})
}


// 创建指定文件夹
function createPublic(file) {
	var publicF = path.join(__dirname, file);
	fs.exists(publicF, function(exists) {
		if (!exists) {
			fs.mkdir(publicF)
		}
	})
}

function serverStart(version) {
	var html = '==================================\n';

	html += 'iServer                   v '+ version;
	html += '\n----------------------------------';
	html += '\nFile Server               '+ifileServer;
	html += '\nPort                      '+port;
	html += '\nBrowser                   '+browserName;
	html += '\n----------------------------------\n本地请访问: http://localhost:'+ port +' \n        或: http://'+ addresses[1]+':'+ port;
	html += '\n内网请访问: http://'+ addresses[0]+':'+port;
	html += '\n=================================='

	console.log(html)
}

app.listen(port, function() {
	createPublic('public')

	openBrowser()

	serverStart('0.8.0')

})

process.stdin.resume();
process.on('SIGINT', function() {
	console.log('Bye!')
	process.exit(0)
})