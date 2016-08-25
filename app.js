#! /usr/bin/env node

/*
	iServers
	-----------------------------------------------

*/

'use strict';

const http    = require('http')
const fs      = require('fs')
const url     = require('url')
const path    = require('path')
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const colors  = require('colors')
// 压缩功能
const pack  = require('tar-pack').pack;
// 解压功能
const unpack = require('tar-pack').unpack;
const mongoose = require('mongoose');

const ifiles  = require('./bin/ifiles')
const getIPs  = require('./bin/getIPs')
const comStr  = require('./bin/commandStr')
const _command = comStr.commandStr();
const open    = require('./bin/open');
const rotues  = require('./bin/rotues');
const parseURL  = require('./bin/parseURL');

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
const io  = require('socket.io')(http);

app.set('views', __dirname + '/server')
app.set('view engine', 'ejs')


if (iservers.type === 'SERVER') {

	console.log('服务器根目录:', process.cwd() );
	console.log('服务启动目录:', __dirname);

	app.use(session({
		secret: 'hello world!',
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 60* 1000 * 30
		}
	}));

	app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));


	mongoose.connect('mongodb://localhost/iserver');
	mongoose.set('debug', true);
	
	let db = mongoose.connection;
	db.on('error', ()=> {
		console.log('Mongodb not connection!')
	});
	db.once('open', () => {
		console.log('Mongodb OK!');
	})
	
}

app.use(parseURL)

// 使用路由
rotues(app, iservers.type);


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
}).on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.log(iservers.port+ '端口已经被占位!请更换其它端口!')
	}
});



