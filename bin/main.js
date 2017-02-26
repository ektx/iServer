function server(options) {

	'use strict';

	const fs      = require('fs');
	const http    = require('http');
	const http2   = require('spdy');
	const path    = require('path');
	const net     = require('net');
	const express = require('express');
	const session = require('express-session');
	const bodyParser = require('body-parser');
	const colors  = require('colors');
	const mongoose = require('mongoose');
	const iconv   = require('iconv-lite');

	const ifiles  = require('./ifiles');
	const getIPs  = require('./getIPs');
	const open    = require('./open');
	const rotues  = require('./rotues');
	const parseURL  = require('./parseURL');
	const app = express();
	const io  = require('socket.io')(http);

	// https & http port
	let	mainPort = options.port;
	let	httpPort = options.http || options.port + 1;
	let	httpsPort = options.https || options.port + 2;

	const sslOptions = {
		key: fs.readFileSync(path.join(__dirname, '../ssl/iserver.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../ssl/iserver-cert.pem'))
	}

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

		mongoose.connect(options.db);
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
	net.createServer(netSocket=> {
		netSocket.once('data', buf => {
			let address = buf[0] === 22 ? httpsPort : httpPort;
			let proxy = net.createConnection(address, ()=> {
				proxy.write(buf);
				netSocket.pipe(proxy).pipe(netSocket);
			});

			proxy.on('err', err => {
				console.log(err)
			})
		});

		netSocket.on('error', err => {
			console.log('Sevrer error:')
			console.log(err)
		})
	}).listen(mainPort, ()=> {
		if (options.type === 'tool' && options.browser) {
		
			let openURL = 'http://'+getIPs().IPv4.public + ':' + mainPort;

			open(openURL, options.browser)
		}

		let zIP = getIPs().IPv4;
		let showInfo = ('=================================\n'+
			'  Welcome to '+ options.version +
			'\n=================================\n').rainbow;

		for (let i in zIP) {
			showInfo += '地址请求: '+zIP[i] + ':' + mainPort + '\n';
		}

		console.log(showInfo);

		http.createServer(app).listen(httpPort, ()=> {
			console.log(`HTTP  辅助端口为: ${httpPort}`)
		})
		.on('error', err => {
			serverErr(err, ` ${httpPort} http 辅助接口被占用!`)
		})
		
		http2.createServer(sslOptions, app).listen(httpsPort, ()=> {
			console.log(`HTTPS 辅助端口为: ${httpsPort}`)
		})
		.on('error', err => {
			serverErr(err, ` ${httpsPort} https 辅助接口被占用!`)
		})

	}).on('error', err => {
		serverErr(err, ` ${mainPort} 端口已经被占位!请更换其它端口! `)
	});

}

function serverErr(err, msg) {
	if (err && err.code === 'EADDRINUSE') {
		console.log(msg.yellow.bgRed)
		return;
	}
}


module.exports = server;