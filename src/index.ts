import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import program from 'commander'
import { version } from '../package.json'

program
	.version(version)
	.option('-b, --browser [name]', 'turn on the server and open the specified browser, name as [chrome|firefox|ie|opera]')
	.option('-p, --port [port]', 'set server port, default 8080')
  .option('-s, --https', 'use HTTPS ,default HTTP')
  .option('-w, --watch [value]', '0 关闭监听, 1 浏览器访问目录, 2 所有文件')
  .option('-d, --directory [path]', '设置服务根目录，默认为当前目录')

program.on('--help', () => {
	console.log(`
  Quick Strat: iserver

  Use Option:
    
    eg: Start the server and open the default browser: 
    iserver -p 9000 -b
`)
})

program.parse(process.argv)

let { directory, port, watch } = program

// 默认端口为 8080
program.port = typeof port === 'string' ? parseInt(port) : 8000

// 默认监听用户浏览器访问目录
// 0 不使用文件监听功能，文件的变化，系统不提示
// 1 只监听访问过的文件目录，当访问过的文件发生变化会通告客户端
// 2 启动服务时同时开启监听所有根目录中的文件，文件变化后通知客户端，与1相比，好处是一次监听所有内容变化;不利在于启动时占CPU需求一些时间
program.watch = typeof watch === 'string' ? parseInt(watch) : 1

program.directory = typeof directory === 'string' ? directory : '/'
// 设置项目的目录地址
program.__directory = path.join(process.cwd(), program.directory)

// 判断目录是否存在，不存在时关闭
if (fs.existsSync(program.__directory)) {
  // 启动
  // main({...program, version})
} else {
  console.log(chalk.red(`⚠️ ${program.__directory} 不存在`))
}
