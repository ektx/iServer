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
var projectConfig = '/bin/config.json';
// 配置数据
var configInfo = false;

app.post('*', function(req, res) {
	var _path = req.path;

	console.log(req.method.bgBlue.white +' - ' +decodeURI(_path))

	// 项目请求目录
	var _PRO_PATH = _path.match(/\/.*(?=\/)/)[0].substr(1);
	// 获取主配置文件
	var _PRO_CON  = getJSONNote(__dirname + projectConfig);


	configInfo = getJSONNote(__dirname + '/public/'+_PRO_CON[_PRO_PATH]+'/Dev/Data/config.json');

	var sendMes = {
		"form": "iServer",
		"status": true
	}

	// 请求模拟路径
	var dataPath = __dirname + '/public/'+_PRO_CON[_PRO_PATH]+'/Dev/Data/' + configInfo[decodeURI(_path)];
	sendMes.mes = getJSONNote(dataPath);

	res.json(sendMes)

})


app.listen(port, function() {
	console.log(('=================================\nWelcome to '+version+'\n=================================').rainbow)

	var zip = getIPs().IPv4;
	for (var i in zip) {
		console.log(zip[i] + ':' + port)
	}
})

/* 
	获取JSON
	-------------------------------------
	去除JSON中的注释 
*/
function getJSONNote (dataPath) {
	var JSONInner = {};

	try {

		JSONInner = fs.readFileSync(dataPath, 'utf8')
		// 去注释和压缩空格
		JSONInner = JSONInner.replace(/(\/{2}.+)|\s/g, '')

	} catch (err) {
		console.log('无法找到配置文件 '.bgRed.white+dataPath.bgYellow.white)
	}

	JSONInner = JSON.parse(JSONInner);

	return JSONInner
}