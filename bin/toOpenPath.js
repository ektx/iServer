const fs = require('fs-extra')
const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const IP  = require('./getIPs')

/*
	打开文件目录功能
	-----------------------------------
	为作为本地服务器时,可以通过
	Mac 上 command + 点击
	Win 上 Ctrl + 点击
	打开对应的文件夹

	前端传参
	{
		path: 'abc/def',
		name: 'def'
	}
*/
module.exports = async function (ctx, file) {
	let platform = os.platform()
	let stat = await fs.stat(file)

	// 如果没有文件	
	if (stat.code === 'ENOENT') {
		return ctx.body = {
			success: false, 
			mes: 'Not Find Anything!' 
		}
	}

	// 正常情况
	if ( stat.isDirectory() ) {
		console.log('is Dir')
	}
	console.log(file)

	// 处理空格
	file = file.replace(/\s/g, '\\ ');

	if ((await IP.getClientIP(ctx)).isServer ) {
		switch (platform) {
			case 'darwin':
				exec(`open ${file}`)
				break;
			case 'linux2':
				exec(`nautilus ${file}`)
				break;
			case 'win32':
				file = file.replace(/\//g, '\\');
				exec(`explorer ${file}`)
				break;
		}
	}

	ctx.body = { success: true }
}