
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const generate = require('./generate');
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
		let copyPath = '';
		let reqURL = reqPath.replace('/:make','');
		let originalPath = path.join(rootPath, reqURL )

		// 如果是根目录，就在根目录下生成一个压缩发布文件夹
		if (!reqURL) {
			copyPath =  path.join(rootPath, 'HTML');
		} 
		// 如果不是根目录，就在同级目录下面生成一个发布文件夹
		else {
			copyPath = path.join(rootPath, reqURL + '_HTML');
			console.log('Not root Path:', copyPath)
		}

		let dealwithFiles = generate(originalPath, copyPath);

		if (dealwithFiles.length == 0) {
			dealwithFiles.push('您本次没有修改任何文件')
		}

		let _html = ejs.render(fs.readFileSync(__dirname + '/make.ejs', 'utf8'), {MArr: dealwithFiles});

		res.send(_html)

		return;
	}

	let fileAbsolutePath = path.join(rootPath, reqPath);

	// 是否存在文件
	let isStat = function(_path) {

		// 文件路径参数集
		// 用来收集建议信息
		var statsArr = arguments;

		// 生成建议路径
		if (statsArr.length > 1) {
			// 对Js或Css的迷你文件建议
			if (statsArr[1] === 'USE_MIN') {
				_path = _path.replace(/\.min/i, '');
			}
			// 对HTML的文件
			else {
				// 修改文件名
				var extName = path.extname(_path);
				_path = _path.replace(extName, statsArr[1]);
			}
			console.log('Suggest Path:'.white.bgYellow, _path)
		}

		// 处理路径乱码,解决URI加密问题,解决下载不了有空格命名的文件
		_path = decodeURI(_path);

		fs.stat(_path, function(err, stats) {
			if (err) {
				console.log('No '.white.bgRed+' - '+_path)
				
				/* 
					如果没有找到的文件
					则为用户推荐ejs或jade的模板文件
					当然前提是在请求html的时候

					目标是为了解决 
					1.jQuery load请求时可以统一使用
					/dome/page.html 的方法
					2.导航上直接使用以html为后缀的文件跳转名
				*/

				// 文件后缀名是什么
				var fileExtName = ''

				// 当在原始请求时，参数只有地址
				// 这时长度为1，我们取文件格式
				// 判断是否满足以下建议形式的文件
				if (statsArr.length == 1) {
					fileExtName = path.extname(_path)
				} 
				// 当是建议文件时，我们会增加2个参数进去
				// 用来处理建议内容
				else {
					// 如果当前是采用建议地址
					// 如果建议文件扩展名是 jade,那就结束建议
					// 只有为 ejs 建议时，才进行第2次建议
					if (statsArr[1] !== '.ejs') {
						// 取得建议文件的原始格式
						fileExtName = statsArr[2]
					}
				}

				switch (fileExtName) {
					// 在请求的HTML不存在时
					// 我们先去尝试请求 ejs 模板文件
					// 然后在 ejs 的模板也不存在时，尝试jade模板
					// 如果您使用 jade 的比较多，可以修改下面文件
					case '.html':

						// 添加建议格式 ejs
						let suggestExtName = '.ejs';

						// 参数大于1时，这时建议已经在处理过 ejs 的建议了
						if (statsArr.length > 1 && statsArr[1] !== '.jade') {
							suggestExtName = '.jade'
						}

						isStat(_path, suggestExtName, '.html');
						return;

					case '.js':
					case '.css':
						if (path.basename(_path, '.js').indexOf('.min') > -1 || path.basename(_path, '.css').indexOf('.min') > -1) {
							isStat(_path, 'USE_MIN', '.js')
							return;
						}

				}

				// 如果没有建议文件或建议文件也不存在
				// 提示 404
				ifiles.sendError(res, 404, 404)
				return;
			}

			// 如果请求的文件存在
			// 判断是文件还是文件夹
			// 文件则显示内容
			if (stats.isFile()) {

				// 如果文件是ejs或是jade
				// 我们渲染成页面输出，防止下载下来了
				if (path.extname(_path) === '.ejs' || 
					path.extname(_path) === '.jade') {
					res.render(_path);
				} else {

					ifiles.sendFile(req, res, _path)
				}

			} 
			// 文件夹则显示内部的文件目录
			else if(stats.isDirectory()) {

				if ( !reqPath.endsWith('/') ) {
					reqPath += '/';
				}
				ifiles.showDirecotry(req, res, rootPath, reqPath)
			}
		})

	}

	isStat(fileAbsolutePath)

}
