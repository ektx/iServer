
const fs = require('fs')
const path = require('path')
// const ifiles = require('./ifiles')
const sendFile = require('./sendFile')
const statAsync = require('./statAsync')
const colors = require('colors')

/*
	文件服务主功能
	---------------------------------------------
*/
module.exports = async function (req, res) {

	let filePath = path.join( process.cwd(), req.url)

	try {

		// 判断是文件还是文件夹
		let rootFileStat = await statAsync(process.cwd(), req.url)

		if (rootFileStat.stats.isFile()) {
			console.log('is file')
			sendFile(req, res, process.cwd(), req.url)
		} 
		else if (rootFileStat.stats.isDirectory()) {

			let files = await readdirAsync(filePath)
			
			let childrenPathPromises = files.map(file => 
				statAsync(filePath, file)
			)

			childrenInfo = await Promise.all(childrenPathPromises) 

			res.send(childrenInfo)
		}

	} catch (err) {
		res.status(404).send('404\n' + err)		
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