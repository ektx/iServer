#! /usr/bin/env node

'use strict';

const program = require('commander');

const setServer = require('./bin/serverSet');

program
	.version('0.0.1')
	.option('t, tool', '启动工具服务器')
	.option('os', '启动系统服务');

program.on('--help', ()=>{
	console.log('  例如:\n\t');
	console.log('    go tool')
	console.log('    go server')
	console.log('    go config')
});
program.parse(process.argv);


if (program.tool || program.t) {
	setServer('tool')
}
if (program.os) {
	setServer('os')
}
