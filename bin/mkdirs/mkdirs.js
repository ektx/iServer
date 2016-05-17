/*!
 * mkdirs
 * Copyright(c) 2016 ektx
 */

var fs = require('fs');
var path = require('path');

var delayPath = [];

function mkdirs(toURL) {

	try {
		var isMS = fs.mkdirSync(toURL)

		if (!isMS) {
			
			if(delayPath.length == 0) {
				console.log(toURL+' 文件夹生成完成!')
				return;
			}

			// 反向调用地址列表
			// 然后删除最初的那个
			var _toPath = (delayPath.reverse())[0]
			delayPath.shift()
			mkdirs(_toPath)
		}
	} catch(err) {

		// 返回错误为无法生成时
		if (err.code === 'ENOENT') {

			delayPath.push(toURL);
			var _path = path.dirname(toURL)
			mkdirs(_path)
		}
	}

}

module.exports = mkdirs;