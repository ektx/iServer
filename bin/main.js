
const fs = require('fs-extra')
const http = require('http')
const spdy = require('spdy')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const open = require('./open')
const colors = require('colors')

const IP = require('./getIPs')
const rotues = require('./rotues')
const parseURL = require('./parseURL')
const socketEvt = require('./socketEvent')
const { signale, interactive } = require('./signale')

const app = express()

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

// parse application/json 
app.use(bodyParser.json())

// GBK URL中文乱码问题
app.use(parseURL)

module.exports = function (options) {
	signale.cli('iServer')
	signale.version(options.version)

	let	serverPort = options.port
	let server = null
	
	// 使用路由
	rotues(app)

	if (options.https) {
		interactive.await('[%d/2] 启动 HTTP 服务中...', 1)

		// http2 使用的证书，你可以自己重新生成
		// 这里只是示例
		const sslOptions = {
			key: fs.readFileSync(path.join(__dirname, '../ssl/its.pem')),
			cert: fs.readFileSync(path.join(__dirname, '../ssl/its-cert.pem'))
		}

		server = spdy.createServer(sslOptions, app)

	} else {
		interactive.await('[%d/2] 启动 HTTPS 服务中...', 1)

		server = http.createServer(app)
	}

	// socket io
	socketEvt(require('socket.io')(server))

	server.listen(serverPort, function() {
		interactive.success('[%d/2] 服务启动完成', 2)

		if (options.browser) {
			open(
				(options.https ? 'https':'http') +`://${IP.getIPs().IPv4.public}:${serverPort}`,
				options.browser
			)
		}
	})

	server.on('error', e => {
		if (e.code === 'EADDRINUSE') {
			interactive.error('[%d/2] 当前端口被占用，请重试', 2)
		}
	})
}
