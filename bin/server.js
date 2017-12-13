
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const sendFile = require('./sendFile')
const statAsync = require('./statAsync')
const getIP = require('./getIPs')
/*
	文件服务主功能
	---------------------------------------------
*/
module.exports = async function (req, res) {
	// 请求 API
	let isAPI = false
	let isWorkbench = req.url.startsWith('/@workbench')

	// 请求以 '/api/' 开头的，我们默认为请求 api
	if (req.url.startsWith('/api')) {
		isAPI = true
		req.url = req.url.replace(/^\/api/i, '')
	}

	let filePath = isWorkbench ? req.url : path.join( process.cwd(), req.url)
console.log(filePath, 111, isWorkbench)

	if (isWorkbench) {
		sendFile(req, res, __dirname, 'INDEX')
		return
	}

	try {

		// 判断是文件还是文件夹
		let rootFileStat = await statAsync(process.cwd(), req.url)
		if (rootFileStat.stats.isFile()) {
			sendFile(req, res, process.cwd(), req.url)
		} 
		else if (rootFileStat.stats.isDirectory()) {

			if (isAPI) {
				let files = await readdirAsync(filePath)
			
				let childrenPathPromises = files.map(file => 
					statAsync(filePath, file)
				)

				childrenInfo = await Promise.all(childrenPathPromises) 

				res.send({
					server: getIP.getClientIP(req).isServer,
					data: childrenInfo
				})
			}
			else {
				sendFile(req, res, __dirname, 'INDEX')
			}
		}

	} catch (err) {
		res.status(404).send('<h1>404</h1>' + err)		
	}
}


/*
	异步读取目录下的文件列表
	@filePath [string] 文件路径
*/
function readdirAsync(filePath) {
	return new Promise((resolve, reject) => {
		fs.readdir(filePath, (err, files) => {
			if (err) reject(err)
			else resolve(files)
		})
	})
}