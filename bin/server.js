
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pug = require('pug');
const ifiles = require('./ifiles');
const colors = require('colors');

/*
	文件服务主功能
	---------------------------------------------
*/
module.exports = (req, res, options) => {
	// 取用户设置的地址或是URL上的地址
	let reqPath = options.path || req.path;
	let rootPath = options.serverRootPath;
	// type 是用户服务还是根服务
	let isUsr = options.isUsr;

	// 生成静态页面
	if (/\/:[make|important]/.test(reqPath)) {

		let reqURL = reqPath.replace('/:make','');

		res.redirect('/server/make?url=' + reqURL)

		return;
	}

	let fileAbsolutePath = path.join(rootPath, reqPath);

	// 是否存在文件
	let isStat = function(_path) {

		// 文件路径参数集
		// 用来收集建议信息
		let statsArr = arguments;

		// 生成建议路径
		if (arguments.length > 1) {
			// 对Js或Css的迷你文件建议
			if (arguments[1] === 'USE_MIN') {
				_path = _path.replace(/\.min/i, '');
			}
			// 对HTML的文件
			else {
				// 修改文件名
				let extName = path.extname(_path);
				_path = _path.replace(extName, arguments[1]);
			}
			console.log('Suggest Path:'.white.bgYellow, _path)
		}

		// 处理路径乱码,解决URI加密问题及解决下载不了有空格命名的文件
		_path = decodeURI(_path);

		fs.stat(_path, function(err, stats) {
			// 1. 文件不存在时，智能提供参考文件
			if (err) {
				console.log('No '.white.bgRed+' - '+_path)
				
				/* 
					如果没有找到的文件
					则为用户推荐ejs或jade的模板文件
					当然前提是在请求html的时候
				*/
				// 文件后缀名是什么
				let fileExtName = ''

				// 原始请求时
				if (arguments.length == 1) {
					fileExtName = path.extname(_path)
				} 
				// 处理建议内容
				else {
					if (arguments[1] !== '.ejs') {
						// 取得建议文件的原始格式
						fileExtName = arguments[2]
					}
				}

				switch (fileExtName) {
					case '.html':

						// 添加建议格式 ejs
						let suggestExtName = '.ejs';

						// 参数大于1时，这时建议已经在处理过 ejs 的建议了
						if (arguments.length > 1 && arguments[1] === '.ejs') {
							suggestExtName = '.jade'
						}

						isStat(_path, suggestExtName, '.html');
						return;

					case '.js':
					case '.css':
						if ( path.basename(_path, '.js').endsWith('.min') || 
							path.basename(_path, '.css').endsWith('.min') ) {
							
							isStat(_path, 'USE_MIN', fileExtName)
							return;
						}

				}

				// 如果没有建议文件或建议文件也不存在
				ifiles.sendError(res, 404, 404)
				return;
			}

			// 2.如果请求的文件存在
			// 判断是文件还是文件夹
			if (stats.isFile()) {

				// 文件则显示内容
				// 如果文件是ejs或是jade
				// 我们渲染成页面输出，防止下载下来了
				if (path.extname(_path) === '.ejs') {
					res.render(_path);
				} 
				else if (path.extname(_path) === '.jade' || path.extname(_path) === '.pug') {

					if (_path.endsWith('.jade')) {
						_path = _path.replace(/.jade$/, '.pug')
						res.send('Please Use Pug to Replace Jade File Extname!<br/>请使用 pug 来做为新的模板名!')
					} else {
						res.render(_path)
					}

				}
				else {

					if (options.fileCallback) {
						options.fileCallback(_path)
					} else {
						ifiles.sendFile(req, res, _path)
					}
				}

			} 
			// 文件夹则显示内部的文件目录
			else if(stats.isDirectory()) {

				if ( !reqPath.endsWith('/') ) {
					reqPath += '/';
				};

				if (options.dirCallback) {
					options.dirCallback(_path)
				} else {
					ifiles.showDirecotry(req, res, rootPath, reqPath)
				}

			}
		})

	}

	isStat(fileAbsolutePath)

}
