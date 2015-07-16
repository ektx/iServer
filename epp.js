/*
	iServer v.0.1.2
	-----------------------------------------------
	支持页面生成
	使用方法: localhost:8000/:make
*/

var http = require('http')
var express = require('express')
var url = require('url')
var path = require('path')
var os = require('os')

var generate = require('./lib/generate.js')
var ifiles = require('./lib/files.js')

// 服务器网络信息
var ifaces = os.networkInterfaces()
var addresses = []

// 默认设置
// 是否需要文件服务器 true 是; false 否
var ifileServer = true;
// 默认端口设置
var port = 8000;

for (var i in ifaces) {
	for (var ii in ifaces[i]) {
		var address = ifaces[i][ii];
		if (address.family === 'IPv4') {
			addresses.push(address.address);
		}
	}

};

var app = express()
var root = !ifileServer ? __dirname + '/public' : __dirname;

app.set('views', root)
app.set('view engine', 'ejs')
app.use(express.static(root))


app.get('/favicon.ico', function(res, req, next) {
	return
})

app.get('*', function(req, res, next) {
	var _path = req.path

	console.log('ip:' + req.ip)
	console.log(req.method + ' ' + req.path)

	// console.log(req.headers.accept)

	var _filePath;
	if (_path.split('.')[1] == 'html') {
		_filePath = _path.split('.')[0].replace('/', '')
	} else {
		_filePath = _path
	}

	console.log(req.method + '-' + _filePath)

	// 默认请求 demo
	if (_filePath === '/') {

		if (!ifileServer) {
			res.render('demo');
		} else {
			var pathname = decodeURI(url.parse(req.url).pathname)
			
			ifiles.serverStatic(req, res, pathname, __dirname);
		}


		return
	}

	if (_filePath === '/:make') {
		var copyPath = __dirname + '/html'
		var root = __dirname + '/Public'

		generate.generate(root, copyPath, app, ifileServer);
		res.send('<h2>生成页面完成,请查看html文件夹</h2>')
		return;
	}

	// 错误处理
	res.render(_filePath, function(err, html) {
		// 如果不存在此页面
		if (err) {
			console.log(err)
			res.status(404).send('<h2>404</h2>')
		} else {
			res.end(html)
		}

	})

	next()
});


app.listen(port, function() {
	console.log('Server runing at localhost:'+ port)
	console.log('===============================')
	console.log('iServer')
	console.log('===============================')
	console.log('本地请访问: http://localhost:'+ port +' \n         或 http://'+ addresses[1]+':'+ port)
	console.log('内网请访问: http://'+ addresses[0]+':'+port)
})