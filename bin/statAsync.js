
const fs = require('fs')
const path = require('path')

/*
	异步读取文件的状态情况
	@filePath [string] 文件父母路径
	@file [string] 文件名
*/
module.exports = function (filePath, file) {
	return new Promise((resolve, reject) => {

		let absolutePath = ''

		if (file)
			absolutePath = path.join(filePath, file)
		else {
			absolutePath = filePath
			file = path.basename(filePath)
		}

		fs.stat(absolutePath, (err, stats) => {
			if (err) {
				reject(err)
			}
			else {
				// 返回内容
				resolve({
					// 文件名
					file,
					// 绝对路径
					path: absolutePath,
					// 是否为文件夹
					isDir: stats.isDirectory(),
					// 状态信息
					stats
				})
			}
		})
	}).catch(err => {
		// 捕捉错误信息并返回
		return err
	})
}