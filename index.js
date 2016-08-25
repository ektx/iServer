#! /usr/bin/env node

'use strict';

const program = require('commander');

const setServer = require('./bin/serverSet');
const version = '4.0.1';

program
	.version(version)

program
	.command('tool')
	.description('启动本地服务器')
	.option('-b, --browser [browser]', '开启服务器同时打开浏览器[chrome]')
	.option('-p, --port [port]', '自定义端口号')
	.option('-s, --set [set]', '开启自定义功能')
	.action((options)=> {

		setServer({
			type: 'tool',
			browser: !options.browser ? false : true,
			set: !options.set ? false : true,
			port: isNaN(options.port) ? 8000 : options.port,
			version: version
		})

	});

program
	.command('os')
	.description('启动系统服务器')
	.option('-b, --browser [browser]', '开启服务器同时打开浏览器[chrome]')
	.option('-p, --port [port]', '自定义端口号')
	.option('-s, --set [set]', '开启自定义功能')
	.action((options)=> {

		setServer({
			type: 'os',
			browser: !options.browser ? false : true,
			set: !options.set ? false : true,
			port: isNaN(options.port) ? 8000 : options.port,
			version: version
		})

	});


program.on('--help', ()=>{
	console.log('  例如:\n\t');
	console.log('    iserver tool')
	console.log('    iserver server')
	console.log('    iserver server -h')
});


program.parse(process.argv);