
function server(options) {

	'use strict';

	const http    = require('http');
	const fs      = require('fs');
	const url     = require('url');
	const path    = require('path');
	const express = require('express');
	const session = require('express-session');
	const bodyParser = require('body-parser');
	const colors  = require('colors');
	// 压缩功能
	const pack    = require('tar-pack').pack;
	// 解压功能
	const unpack  = require('tar-pack').unpack;
	const mongoose = require('mongoose');
	const iconv   = require('iconv-lite');

	const ifiles  = require('./ifiles');
	const getIPs  = require('./getIPs');
	const open    = require('./open');
	const rotues  = require('./rotues');
	const parseURL  = require('./parseURL');
	const app = express();
	const io  = require('socket.io')(http);

	app.set('views', path.resolve(__dirname, '../server') )
	app.set('view engine', 'ejs')

	if (options.type === 'os') {

		console.log('服务器根目录:', process.cwd() );
		console.log('服务启动目录:', __dirname);

		app.use(session({
			secret: 'helloWorld!',
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 60* 1000 * 30
			}
		}));

		app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

		mongoose.connect(options.dbURL + options.db);
		mongoose.set('debug', true);
		
		let db = mongoose.connection;
		db.on('error', ()=> {
			console.log('Mongodb not connection!')
		});
		db.once('open', () => {
			console.log('Mongodb OK!');
		})
		
	}

	// GBK URL中文乱码问题
	app.use(parseURL)

	// 使用路由
	rotues(app, options.type);


	// 主服务
	app.listen(options.port, function() {

		if (options.browser) {
	    	
	    	let openURL = 'http://'+getIPs().IPv4.public + ':' + options.port;

			open(openURL, options.browser)
		}

		let zIP = getIPs().IPv4;
		let showInfo = ('=================================\n'+
			'  Welcome to '+ options.version +
			'\n=================================\n').rainbow;

		for (let i in zIP) {
			showInfo += '地址请求: '+zIP[i] + ':' + options.port + '\n';
		}

		console.log(showInfo);

	}).on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			console.log(options.port+ '端口已经被占位!请更换其它端口!')
		}
	});
}


module.exports = server;