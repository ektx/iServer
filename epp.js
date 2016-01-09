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
var comStr = require('./bin/commandStr').commandStr()
var open   = require('./bin/open')


// 默认设置
var packageInfo = JSON.parse(fs.readFileSync(__dirname+'/package.json', 'utf8'));
var version = packageInfo.name +' '+ packageInfo.version;

if (comStr === 'getVersion') {
	console.log(version);
	return
}

// 默认端口设置
var port = comStr.port || packageInfo.config.port;

var app = express()
var root = __dirname;

app.set('views', root)
app.set('view engine', 'ejs')

app.get('/favicon.ico', function(req, res) {
	res.end();
	return
});




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

// 项目工作配置目录
var projectConfig = '/public/Mis/Dev/Data/config.json';
// 配置数据
var configInfo = false;

app.post('*', function(req, res) {
	var _path = req.path;

	// 如果没有缓存数据
	if (!configInfo) {
		configInfo = JSON.parse(fs.readFileSync(__dirname + projectConfig, 'utf8'))
	}

	var sendMes = {
		"form": "iServer",
		"status": true
	}

	// 请求路径
	var dataPath = __dirname + path.dirname(projectConfig) + '/' + configInfo[decodeURI(_path)];

	// sendMes.mes = fs.readFileSync(dataPath, 'utf8').replace(/\t|\r|\n/g, '');
	sendMes.mes = JSON.stringify(fs.readFileSync(dataPath, 'utf8'))
	console.log(sendMes.mes)

	// sendMes.mes = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

	res.json(sendMes)

})


app.listen(port, function() {
	console.log(('=================================\nWelcome to '+version+'\n=================================').rainbow)

	var zip = getIPs().IPv4;
	for (var i in zip) {
		console.log(zip[i] + ':' + port)
	}
})

