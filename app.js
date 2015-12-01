/*
	app Dev所用的Node服务器
	v 0.3.0
	---------------------------------------------------
	1.支持显示服务IP，方便使用
	zwl	 <myos.me>  2015-4-29
*/

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var os = require('os');

var ifiles = require('./bin/ifiles')

// 服务器网络信息
var ifaces = os.networkInterfaces();
var addresses = [];

for (var i in ifaces) {
	for (var ii in ifaces[i]) {
		var address = ifaces[i][ii];
		if (address.family === 'IPv4') {
			addresses.push(address.address);
		}
	}

};


var root = __dirname;
var fileLocation;

http.createServer(function(req, res) {
	var pathname = decodeURI(url.parse(req.url).pathname);
	// 对url转译

	console.log(req.method + ' ' + pathname)

	if (path.extname(pathname) == '.ejs') {
		res.end()
		return;
	}

	ifiles.serverStatic(req, res, pathname, __dirname)

}).listen(8888, function() {
	console.log('====================================');
	console.log('Welcome to Dev');
	console.log('====================================');
	console.log('本地请访问: localhost:8888 \n         或 '+ addresses[1]+':8888');
	console.log('内网请访问: '+ addresses[0]+':8888');

});

process.stdin.resume();
process.on('SIGINT', function() {
	console.log('Bye!')
	process.exit(0)
})