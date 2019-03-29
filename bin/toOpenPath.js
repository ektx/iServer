
const os = require('os')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const IP  = require('./getIPs')
const statAsync = require('./statAsync')

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
module.exports = async function (req, res) {

	let platform = os.platform()
	let openPath = path.dirname(req.body.path)
	let stat = await statAsync(openPath, req.body.name)

	// 如果没有文件	
	if (stat.code === 'ENOENT') {
		return res.send({
			success: false,
			mes: stat
		})
	}

	// 正常情况
	if ( stat.isDir ) {
		openPath = req.body.path
	}

	// 处理空格
	openPath = openPath.replace(/\s/g, '\\ ');

	if ((await IP.getClientIP(req)).isServer ) {
		switch (platform) {
			case 'darwin':
				exec(`open ${openPath}`)
				break;
			case 'linux2':
				exec(`nautilus ${openPath}`)
				break;
			case 'win32':
				openPath = openPath.replace(/\//g, '\\');
				exec(`explorer ${openPath}`)
				break;
		}
	}

	res.send({
		success: true
	})
}