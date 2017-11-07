#! /usr/bin/env node

'use strict';

const program = require('commander')

const main = require('./bin/main')
const osInfo  = require('./package')
const version = osInfo.version

program
	.version(version)
	.option('-b, --browser [name]', '开启服务器同时打开浏览器[chrome|firefox|ie|opera]')
	.option('-p, --port [port]', '自定义端口号')

program.on('--help', () => {
	console.log('\t\n例如:\n启动服务器并打开默认浏览器: its -p 9000 -b');
});

program.parse(process.argv);

// 如果没有输入端口或是只输入了端口名并没有添加端口号时,默认为 8000
if ((typeof program.port === 'boolean' && program.port) || !program.port) {
	program.port = 8000
} else {
	program.port = parseInt(program.port)
}

// 启动
main({
	type: 'tool',
	browser: !program.browser ? false : program.browser,
	port: program.port,
	version: version
})
