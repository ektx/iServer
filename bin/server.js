
const fs = require('fs-extra')
const path = require('path')
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

	// 请求以 '/api/' 开头的，我们默认为请求 api
	if (req.url.startsWith('/api/')) {
		isAPI = true
		req.url = req.url.slice(4)
	}

	let decodeReqPath = decodeURIComponent(req.path)
	let filePath = path.join(process.cwd(), decodeReqPath)
	let extname = path.extname(filePath)

	try {
		let rootFileStat = await statAsync(process.cwd(), decodeReqPath)

		if (rootFileStat.isDir) {
			if (isAPI) {
				let files = await readdirAsync(filePath)
			
				let childrenPathPromises = files.map(file => 
					statAsync(path.join(filePath, file))
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
		} else {
			sendFile(req, res, process.cwd(), decodeReqPath)
		}

	} catch (err) {

		let send404 = function() {
			res.status(404).send('<h1>404</h1>' + err)
		}

		// 迷你文件转换处理
		let minFile = function(type) {
			if (filePath.endsWith(`.min${type}`)) {
				// 这里我们推荐访问 .ejs 后缀名文件
				req.url = req.url.replace(`.min${type}`, type)
				serverInit(req, res)
			} else {
				send404()
			}
		}

		switch (extname) {
			case '.css':
				minFile('.css')
				break

			case '.js':
				minFile('.js')
				break

			default:
				send404()
		}
	}	
}

module.exports = serverInit
