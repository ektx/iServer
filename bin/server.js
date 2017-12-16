
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const colors = require('colors')
const sendFile = require('./sendFile')
const statAsync = require('./statAsync')
const getIP = require('./getIPs')

/*
	文件服务主功能
	---------------------------------------------
*/


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

async function serverInit (req, res) {
	// 请求 API
	let isAPI = false
	let isWorkbench = req.url.startsWith('/@workbench')

	// 请求以 '/api/' 开头的，我们默认为请求 api
	if (req.url.startsWith('/api')) {
		isAPI = true
		req.url = req.url.replace(/^\/api/i, '')
	}

	let filePath = isWorkbench ? req.url : path.join( process.cwd(), req.url)
	let extname = path.extname(filePath)

	console.log(filePath, 111, isWorkbench)

	if (isWorkbench) {
		sendFile(req, res, __dirname, 'INDEX')
		return
	}

	try {

		// 判断是文件还是文件夹
		let rootFileStat = await statAsync(process.cwd(), req.url)

		// 对于文件我们发送给用户
		if (rootFileStat.stats.isFile()) {
			let fileInner = ''

			switch (extname) {
				case '.ejs':
					// fs.readFile(rootFileStat.path, 'utf8', (err, data) => {
					// 	if (err) {
					// 		res.stats(204).send('<h4>204</h4>' + err)
					// 		return;
					// 	}

					// 	let html = ejs.render(data, {filename: rootFileStat.path})

					// 	console.log(html)

					// })
					res.render(rootFileStat.path)
					break;

				default:
					sendFile(req, res, process.cwd(), req.url)
			}
			
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
		// 对于访问 html 的文件，如果不存在的话，我们让他试试其它后缀名访问看看
		if (['.html'].includes(extname)) {
			// 这里我们推荐访问 .ejs 后缀名文件
			req.url = req.url.replace('.html', '.ejs')
			serverInit(req, res)
		} else {
			res.status(404).send('<h1>404</h1>' + err)		
		}
	}	
}

module.exports = serverInit
