#! /usr/bin/env node

/*
	iServers
	-----------------------------------------------

*/

'use strict';

const express = require('express')
const http    = require('http')
const fs      = require('fs')
const url     = require('url')
const path    = require('path')

const colors  = require('colors')

const server  = require('./bin/server')
const ifiles  = require('./bin/ifiles')
const getIPs  = require('./bin/getIPs')
const comStr  = require('./bin/commandStr')
const _command = comStr.commandStr();
const open    = require('./bin/open');

// 系统配置
const iservers = require('./config');


if (_command.v || _command.help) {
	if (_command.v) {
		console.log(iservers.version);
	} else {
		console.log(comStr.printHelp())
	}
	return
}

// 默认端口设置
const app = express();
const appServer = express();
const iserverRootPath = __dirname;

app.set('views', __dirname)
app.set('view engine', 'ejs')

app.get('/favicon.ico', function(req, res) {
	res.end();
	return
});


app.get('*', function(req, res) {

	let filterReqArr = [
		'/bin/css/layout.css',
		'/bin/favicon.png'
	]

	let _path = req.path;

	// 过滤以上文件请求提示
	if ( filterReqArr.indexOf(_path) < 0 ) {
		console.log(req.method.bgGreen.white +' - ' +decodeURI(_path))
	}

	let usrRootPath = process.cwd();

	server(req, res, {serverRootPath: usrRootPath});

})

appServer.get('*', function(req, res) {
	var _path = req.path;
	let appServerRootPath = path.join(__dirname, '/public/');
	server(req, res, {serverRootPath: __dirname});
});


// app.post('*', function(req, res) {
// 	var _path = req.path;

// 	console.log(req.method.bgBlue.white +' - ' +decodeURI(_path))

// 	// 项目请求目录
// 	var _PRO_PATH = _path.match(/\/.*(?=\/)/)[0].substr(1);
// 	// 获取主配置文件
// 	var _PRO_CON  = getJSONNote(__dirname + projectConfig);


// 	configInfo = getJSONNote(__dirname + '/public/'+_PRO_CON[_PRO_PATH]+'/Dev/Data/config.json');

// 	var sendMes = {
// 		"form": "iServer",
// 		"status": true
// 	}

// 	res.json(sendMes)

// });


// 主服务
app.listen(iservers.port, function() {

	if (_command.browser) {
    	
    	let openURL = 'http://'+getIPs().IPv4.public + ':' + iservers.port;

		open(openURL, _command.browser)
	}

	let zIP = getIPs().IPv4;
	let showInfo = 
`=================================
    Welcome to ${iservers.version}
=================================\n`.rainbow;

	for (let i in zIP) {
		showInfo += zIP[i] + ':' + iservers.port + '\n';
	}

	console.log(showInfo);
});

// 服务帮助
// appServer.listen(_port, function() {
// 	// console.log('hahaha..我是服务文件')
// });



