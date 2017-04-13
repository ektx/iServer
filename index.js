#! /usr/bin/env node

'use strict';

const program = require('commander');

const setServer = require('./bin/serverSet');
const osInfo  = require('./package');
const version = osInfo.version;

const n_browser = '-b, --browser [默认浏览器]';
const i_browser = '开启服务器同时打开浏览器[chrome|firefox|ie|opera]';
const n_port = '-p, --port [port]';
const i_port = '自定义端口号';

program
	.version(version)

program
	.command('tool')
	.description('启动本地服务器')
	.option(n_browser, i_browser)
	.option(n_port, i_port)
	.action((options)=> {

		setServer({
			type: 'tool',
			browser: !options.browser ? false : options.browser,
			port: isNaN(options.port) ? 8000 : parseInt(options.port),
			version: version
		})

	});

program
	.command('os')
	.description('启动系统服务器')
	.action((options)=> {

		setServer({
			type: 'os',
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