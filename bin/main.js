
const fs      = require('fs');
const http    = require('http');
const https	  = require('https');
const path    = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const colors  = require('colors');

const IP  = require('./getIPs');
const open    = require('./open');
const rotues  = require('./rotues');
const parseURL  = require('./parseURL');

const app = express();

// 设置示图页面
app.set('views', path.resolve(__dirname, '../server') )

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

// parse application/json 
app.use(bodyParser.json())

// GBK URL中文乱码问题
app.use(parseURL)


module.exports = function (options) {
	
	serverInfo(options)

	let	serverPort = options.port;
	let server;
	
	// 使用路由
	rotues(app);

	if (options.https) {
		console.log('🌈  Start HTTPS Server ...'.green)

		// http2 使用的证书，你可以自己重新生成
		// 这里只是示例
		const sslOptions = {
			key: fs.readFileSync(path.join(__dirname, '../ssl/iserver.pem')),
			cert: fs.readFileSync(path.join(__dirname, '../ssl/iserver-cert.pem'))
		}

		server = https.createServer(sslOptions, app);

	} else {
		console.log('🌈  Start HTTP Server ...'.yellow)

		server = http.createServer(app)
	}

	server.listen(serverPort, function() {
		console.log('🎉  Start completed!'.green)
		console.log('================================='.rainbow)
		if (options.browser) {
			open(
				(options.https ? 'https':'http') +`://${IP.getIPs().IPv4.public}:${serverPort}`,
				options.browser
			)
		}
	})

	server.on('error', (e) => {
		if (e.code === 'EADDRINUSE') {
			console.log('💔  当前端口被占用，请重试\r\nAddress in use, retrying...'.red)
		}
	})

}


function serverInfo (options) {
	console.log('================================='.rainbow)
	console.log('📦  iTools ')
	console.log('📃  ' + `v ${options.version}`)
	console.log('😍  '+ 'Welcome To Use !')
	console.log('---------------------------------'.rainbow)
}