/*
	iMkdirs 3
	-----------------------------
	Copyright(c) 2017 ektx
	增加对地址数组功能的支持

 */

const fs = require('fs');
const path = require('path');


function mkdirs(pathArr) {

	delayPath = [];

	let todo = url => {
		try {
			let isMS = fs.mkdirSync(url)

			if (!isMS) {
				
				if(delayPath.length == 0) return;

				// 反向调用地址列表
				// 然后删除最初的那个
				let _toPath = (delayPath.reverse())[0]
				delayPath.shift()
				todo(_toPath)
			}
		} catch(err) {

			// 返回错误为无法生成时
			if (err.code === 'ENOENT') {

				delayPath.push(url);
				let _path = path.dirname(url)
				todo(_path)
			}
		}
		
	}

	for (let i = 0, l = pathArr.length; i < l; i++) {
		todo(pathArr[i])
	}

	return true
}

module.exports = mkdirs;