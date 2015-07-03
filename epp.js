/*
	iServer v.0.1
	-----------------------------------------------

*/

var http = require('http');
var express = require('express');
var url = require('url');
var path = require('path');
var os = require('os');

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

var app = express();

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


// router
app.get('/', function(req, res) {
	res.render('demo.ejs');
});

app.get('*', function(req, res, next) {
	var _path = req.path;

	console.log('ip:' + req.ip);
	console.log(req + ' ' + req.path);

	console.log(req.is('application/octet-stream'));

	var _filePath;
	if (_path.split('.')[1] === 'html') {
		_filePath = _path.split('.')[0].replace('/', '');
	} else {
		_filePath = _path;
	}
	console.log(req.method + '-' + req.path);

	res.render(_filePath, function(err) {
		console.log(err)
	});

	next();
});


app.listen(8000, function() {
	console.log('Welcome to Dev');
	console.log('Server runing at localhost:8000');
	console.log('===============================');
	console.log('iServer')
	console.log('===============================');
	console.log('本地请访问: localhost:8000 \n         或 '+ addresses[1]+':8000');
	console.log('内网请访问: '+ addresses[0]+':8000');


});