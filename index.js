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
  .option('-w, --watch [value]', '0 关闭监听, 1 浏览器访问目录, 2 所有文件')

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

// 默认监听用户浏览器访问目录
// 0 不使用文件监听功能，文件的变化，系统不提示
// 1 只监听访问过的文件目录，当访问过的文件发生变化会通告客户端
// 2 启动服务时同时开启监听所有根目录中的文件，文件变化后通知客户端，与1相比，好处是一次监听所有内容变化;不利在于启动时占CPU需求一些时间
program.watch = typeof program.watch === 'string' ? parseInt(program.watch) : 1

// 启动
main({...program, version})
