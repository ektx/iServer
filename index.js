#! /usr/bin/env node

const program = require('commander')
const main = require('./bin/main')
const osInfo  = require('./package')

const version = osInfo.version

program
	.version(version)
	.option('-b, --browser [name]', 'turn on the server and open the specified browser, name as [chrome|firefox|ie|opera]')
	.option('-p, --port [port]', 'set server port, default 8080')
    .option('-s, --https', 'use HTTPS ,default HTTP')

program.on('--help', () => {
	console.log(`
  Quick Strat: iserver

  Use Option:
    
    eg: Start the server and open the default browser: 
    iserver -p 9000 -b
`)
})

program.parse(process.argv)

// 默认端口为 8080
program.port = typeof program.port === 'string' ? parseInt(program.port) : 8080

// 启动
main({...program, version})
