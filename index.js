#! /usr/bin/env node

const program = require('commander')
const main = require('./bin/main')
const osInfo  = require('./package')
const version = osInfo.version

program
	.version(version)
	.option('-b, --browser [name]', '开启服务器同时打开指定浏览器[chrome|firefox|ie|opera]')
	.option('-p, --port [port]', '自定义端口号')
	.option('-s, --http', '启动 HTTP 协议,默认启用 HTTPS')

program.on('--help', () => {
	console.log('  例如:  启动服务器并打开默认浏览器: iserver -p 9000 -b\n')
})

program.parse(process.argv)

// 默认端口为 8000
program.port = typeof program.port === 'string' ? parseInt(program.port) : 8000

// 启动
main({
	browser: Boolean(program.browser),
	port: program.port,
	version,
	https: !program.http
})
