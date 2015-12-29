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

var colors = require('colors')

var server = require('./bin/server')
var ifiles = require('./bin/ifiles')
var getIPs = require('./bin/getIPs')

// 默认设置
// 默认端口设置
var port = 8001;
var app = express()
var root = __dirname;

app.set('views', root)
app.set('view engine', 'ejs')

app.get('/favicon.ico', function(req, res) {
	res.end();
	return
})


app.get('*', function(req, res) {
	var _css = '/bin/css/layout.css';
	var _fIco = '/bin/img/file.png';
	var _dIco = '/bin/img/folder.png';
	var _favicon = '/bin/favicon.png';
	var _path = req.path;

	// 过滤以上文件请求提示
	if (!(_path == _css || _path == _fIco || _path == _dIco || _path == _favicon)) {
		console.log(req.method.bgGreen.white +' - ' +decodeURI(_path))
	}

	server.serverStatic(req, res, root, _path);
})


app.listen(port, function() {
	console.log('-------------------------\nWelcome to iServer 1.0\n-------------------------'.rainbow)

	var zip = getIPs().IPv4;
	for (var i in zip) {
		console.log(zip[i] + ':' + port)
	}
})
