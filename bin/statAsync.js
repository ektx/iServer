
const fs = require('fs')
const path = require('path')

/**
 * 异步读取文件的文件具体信息
 * @param {string} filePath 文件绝对路径
 */
module.exports = function (filePath) {
	return new Promise((resolve, reject) => {
        let file = path.basename(filePath)

		fs.stat(filePath, (err, stats) => {
			if (err) {
				reject(err)
			}
			else {
				// 返回内容
				resolve({
					// 文件名
					file,
					// 绝对路径
					path: filePath,
					// 是否为文件夹
					isDir: stats.isDirectory(),
					// 状态信息
					stats: {...stats}
				})
			}
		})
	}).catch(err => {
		// 捕捉错误信息并返回
		return err
	})
}