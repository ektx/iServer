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

app.set('views', __dirname)
app.set('view engine', 'ejs')

app.use(session({
	secret: 'hello world!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 60000
	}
}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));


app.get('/favicon.ico', function(req, res) {
	res.end();
	return
});


// 使用路由
rotues(app);


if (iservers.type === 'TOOL') {
	
	const appServer = express();

	appServer.get('*', function(req, res) {
		var _path = req.path;
		let appServerRootPath = path.join(__dirname, '/public/');
		server(req, res, {serverRootPath: __dirname});
	});

	// 服务帮助
	appServer.listen(iservers._port, function() {
		console.log('辅助服务器')
	});
	
} 
else if (iservers.type === 'SERVER') {

	console.log('++++', process.cwd() , __dirname);

	let write = fs.createWriteStream;
	let read  = fs.createReadStream;
	let packPath = process.cwd() + '/package.tar.gz';

	// 把根目录文件中的 bin 打包,并添加到当前作为服务器目录中
	pack(__dirname+'/server')
	.pipe(write( packPath ))
	.on('error', function(err) {
		console.log(err.stack)
	})
	.on('close', function() {
		console.log('DONE');

		// 解压打包过来的文件
		read( packPath ).pipe( unpack(process.cwd() + '/server/', (err) => {
			if (err) console.log(err.stack)
			else {
				console.log('Unpack Done!');

				// 删除压缩包
				fs.unlink( packPath )
			}
		}) )
	});

	mongoose.connect('mongodb://localhost/iservsers');
	let db = mongoose.connection;
	db.on('error', ()=> {
		console.log('Mongodb not connection!')
	});
	db.once('open', () => {
		console.log('Mongodb OK!')
	})
}



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



