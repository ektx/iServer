
/*
	静态页面生成器
	v 0.2.4
	----------------------------------------------------
	支持 ejs 或 jade模板文件共存,同时支持生成文件  
	修改文件生成方式,对没有发生变化的内容不再一起生成
	新加对css的合并压缩功能 

	U - [文件路径] 生成成功文件
	x - [文件名]   没有更新的文件
	！- [文件名]   冲突文件
	@ - [文件名]   生成文件有改动
*/


var http = require('http');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var jade = require('jade');

var css = require('./css');

var delaySend = [];
var generateType = '';

exports.generate = function(res, root, copyPath, _type) {
	console.log('--------- GENERATE ---------')

	copyPath = path.normalize(copyPath);
	// 清空数据防止缓存
	var delayPath = [], delaySend = [], changeList = [];
	
	generateType = _type;

	var mkdirs = function(toURL) {

		try {
			var isMS = fs.mkdirSync(toURL)

			if (!isMS) {
				if(delayPath.length == 0) {
					console.log('文件夹生成完成!')
					delaySend = readFile(root, copyPath, delaySend)

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
				// window | mac
				var _path = toURL.replace(/\\\w+$|\w+$/, '')

				mkdirs(_path)
			}
		}

	}

	// 遍历模板
	getPartsList(root, changeList)

	// 指定生成目录判断,创建
	try {
		fs.statSync(copyPath);
		delaySend = readFile(root, copyPath, delaySend)

	} catch(err) {
		console.log('not have dir');
		mkdirs(copyPath)
	}

	return delaySend

}

/*
	读取文件夹下的文件
	----------------------------------
*/
function readFile(path, cPath, delaySend) {

	var filesArr = fs.readdirSync(path);

	for (var i = 0, fileLen = filesArr.length; i < fileLen; i++) {
		(function(i) {

			// delaySend.push(filesArr[i])
			var _src = path  + '/' + filesArr[i]
			var _crc = cPath + '/' + filesArr[i]

			checkFile(filesArr[i], _src, _crc, delaySend)
		})(i)
	}

	
	return delaySend

}


function checkFile(fileName, _url, _curl, delaySend) {

	try {
		// 判断文件上否存在
		var _f = fs.statSync(_url)

		// 如果是文件
		if (_f.isFile()) {
			var _fpath = false;

			// 模板转 HTML
			if (path.extname(fileName) == '.ejs' || path.extname(fileName) == '.jade') {

				_fpath = getHTMLPath(fileName, _url, _curl);
			}

			// 判断要复制到的文件夹中是否已经有此文件了
			try {
				var _ff = fs.statSync(_fpath ? _fpath: _curl)

				// 当前文件内容较新
				if (_ff.mtime < _f.mtime) {
					// 如果文件不是ejs或jade的模板，则提示文件有冲突
					// 冲突：模板的文件没有生成的文件大，可能是修改了生成文件或是模板文件删除内容太多
					// 当前文件比生成区文件小（主要是非模板文件）
					// 注：在强制下会覆盖生成
					if (_ff.size > _f.size && 
						path.extname(fileName) != '.ejs' && 
						path.extname(fileName) != '.jade' && 
						generateType == 'make'
					) {
						console.log(' ! - '+ fileName)
						delaySend.push(' ! - '+ fileName)
					} 
					// 模板文件不考虑大小问题
					// 以模板为准生成
					else {
						makeFiles(fileName, _url, _curl, delaySend)
					}
				} 

				// 生成区文件较新较大
				else {
					if (_ff.size > _f.size &&
						path.extname(fileName) != '.ejs' && 
						path.extname(fileName) != '.jade' &&
						path.extname(fileName) != '.html' &&
						path.extname(fileName) != '.htm' &&
						generateType === 'make'
					) {
						console.log(' @ - '+ fileName)
						delaySend.push(' @ - '+ fileName)
					}
				}
			} catch (err) {
				// 如果不存在,则生成
				makeFiles(fileName, _url, _curl, delaySend)
				return;
			}

		}

		// 是文件夹
		else if (_f.isDirectory()) {
			// 复制非组件的文件夹
			if (fileName !== 'parts') {
				createFolders(_url, _curl, delaySend)
			}
		}

	} catch (err) {
		console.log(err)
	}

}

// 输出文件
function outputs(fileName, _url, _curl) {
	var html = '';

	if (path.extname(fileName) == '.ejs') {

		var read = fs.readFileSync;

		html = ejs.render(read(_url, 'utf8'), {filename: _url});
	} else {
		html = jade.renderFile(_url)
	}

	fs.writeFile(getHTMLPath(fileName, _url, _curl), html, {encodeing:'utf8'})

}

// 获取jade和ejs生成后的文件html的路径
function getHTMLPath(fileName, _url, _curl) {
	var filesname = '', filespath = '';

	if (path.extname(fileName) == '.ejs') {

		filesname = path.basename(_curl, '.ejs')
		filespath = path.dirname(_curl, '.ejs')

	} else {

		filesname = path.basename(_curl, '.jade')
		filespath = path.dirname(_curl, '.jade')

	}

	return path.join(filespath, filesname+'.html');
}

// 处理文件
function makeFiles(fileName, _url, _curl, delaySend) {
	console.log(' U - ' + _curl)
	delaySend.push(' U - ' + _curl+'\n')

	// 如果文件是以 ejs 或是 jade 的类型
	if (path.extname(fileName) === '.ejs' || path.extname(fileName) === '.jade') {

		// 生成HTML
		outputs(fileName, _url, _curl);
	
	} 
	// 如果是样式，且不是压缩过的样式
	else if (path.extname(fileName) === '.css' && path.basename(fileName, '.css').indexOf('.min') === -1) {

		// 样式以下划线命名的将要被忽略
		if (path.basename(fileName).substr(0, 1) !== '_')
			css.css(_url, _url);
			css.css(_url, _curl);

	}
	// 除html以外直接复制
	else {

		var readS = fs.createReadStream(_url)
		var writeS = fs.createWriteStream(_curl)
		readS.pipe(writeS)
	}

}

function createFolders(src, curl, delaySend) {

	try {
		var isMS = fs.mkdirSync(curl)
	} catch (err) {

	}

	readFile(src, curl, delaySend)
}

/*
	对parts文件进行缓存
	---------------------------------------
	当parts中的文件发生变化时，更新其所有相关有引用文件

*/
function getPartsList (path, listArr) {
	var filesArr = fs.readdirSync(path);

	for (var i = 0, fileLen = filesArr.length; i < fileLen; i++) {
		(function(i) {

			console.log('== '+filesArr[i])

			if (filesArr[i] === 'parts') {
				console.log('have mod')
				
			}
		})(i)
	}
}