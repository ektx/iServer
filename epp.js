/*
	iServer v.0.1
	-----------------------------------------------

*/

var http = require('http')
var express = require('express')
var url = require('url')
var path = require('path')
var os = require('os')

// 服务器网络信息
var ifaces = os.networkInterfaces()
var addresses = []
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

app.set('views', __dirname + '/public')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))


// router
// app.get('/', function(req, res, next) {
// 	res.render('demo');
// 	next()
// });

app.get('*', function(req, res, next) {
	var _path = req.path

	console.log('ip:' + req.ip)
	console.log(req.method + ' ' + req.path)

	// console.log(req.is('application/octet-stream'))

	var _filePath;
	if (_path.split('.')[1] == 'html') {
		_filePath = _path.split('.')[0].replace('/', '')
	} else {
		_filePath = _path
	}
	console.log(req.method + '-' + _filePath)

	// 默认请求 demo
	if (_filePath === '/') _filePath = 'demo'

	res.render(_filePath)

	next()
});


app.listen(8000, function() {
	console.log('Server runing at localhost:'+ port)
	console.log('===============================')
	console.log('iServer')
	console.log('===============================')
	console.log('本地请访问: http://localhost:'+ port +' \n         或 http://'+ addresses[1]+':'+ port)
	console.log('内网请访问: http://'+ addresses[0]+':'+port)
})