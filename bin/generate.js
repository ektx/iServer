
/*
	静态页面生成器
	v 0.3.0
	----------------------------------------------------
	支持 ejs 或 jade模板文件共存,同时支持生成文件  
	修改文件生成方式,对没有发生变化的内容不再一起生成
	新加对css的合并压缩功能 

	U - [文件路径] 生成成功文件
	x - [文件名]   没有更新的文件
	！- [文件名]   冲突文件
	@ - [文件名]   生成文件有改动
*/


const http = require('http');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const jade = require('pug');

const css = require('./css');
const js = require('./jsmin');

var delaySend = [];

module.exports = function generate (originalPath, copyPath) {
	console.log('--------- GENERATE ---------')
	console.log('originalPath:', originalPath)
	console.log('copyPath:', copyPath)
	console.log('------- GENERATE End -------')

	copyPath = path.normalize(copyPath);
	// 清空数据防止缓存
	let delayPath = []
	, delaySend   = []
	, changeList  = []
	, cachingModObj = {}


	let mkdirs = function(toURL) {

		try {
			var isMS = fs.mkdirSync(toURL)

			if (!isMS) {
				if(delayPath.length == 0) {
					console.log('文件夹生成完成!')
					delaySend = readFile(originalPath, copyPath, delaySend, changeModArr, cachingModObj)

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

	// 遍历模板
	changeModArr = getPartsList(originalPath);

	// 指定生成目录判断,创建
	try {
		fs.statSync(copyPath);
		delaySend = readFile(originalPath, copyPath, delaySend, changeModArr, cachingModObj)

	} catch(err) {
		console.log('not have dir:', copyPath);
		mkdirs(copyPath)
	}

	return delaySend

}

/*
	读取文件夹下的文件
	----------------------------------
*/
function readFile(originalPath, cPath, delaySend, changeModArr, cachingModObj) {

	// 如果目录是以 . 开头的,不进行复制和生成
	if ( /\/\.\w+/.test(originalPath) ) return;

	let filesArr = fs.readdirSync(originalPath);

	for (let i = 0, len = filesArr.length; i < len; i++) {

		const _src = path.join(originalPath, filesArr[i])
		const _crc = path.join(cPath, filesArr[i])

		if ( _src != cPath) {
			checkFile(filesArr[i], _src, _crc, delaySend, changeModArr, cachingModObj)
		}
	}

	return delaySend

}


function checkFile(fileName, _url, _curl, delaySend, changeModArr, cachingModObj) {

	// @type 模板类型
	// @str  模板内容
	var getIncludeMod = function(type, str) {

		var includeArr = []
		,	strArr = [];
		
		if (type == '.ejs') {
			
			strArr = str.match(/<%-.+(?=(%>))/g);

			if (!!strArr) {

				for (var modPath of strArr) {
					includeArr.push(modPath.match(/'.+(?=')/)[0].substr(1) + type)
				}
	
			}
			
		} else {

			strArr = str.match(/include (.+)/g)

			if (!!strArr) {
				for (var modPath of strArr) {
					includeArr.push(modPath.replace(/include /, '') + type)
				}
			}
		}

		return includeArr
	}


	var includePath = function(type, url, cache) {

		var returnARR = []

		var str = fs.readFileSync(url, 'utf8');

		var arr = getIncludeMod(type, str);

		if (arr.length > 0) {
			// 遍历此模板
			for (var innerMod of arr) {

				var innerModPath = path.join(path.dirname(url), innerMod)
				// console.log('innerModPath: ',innerModPath)
				// console.log('innerModPath dirname: ',path.dirname(url))

				// 在缓存模板中
				if (innerModPath in cache) {

					returnARR.push(innerModPath)
					returnARR = returnARR.concat(cache[innerModPath])
				} 
				// 不在缓存模板中
				else {
					var innerArr = includePath(type, innerModPath, cache)
					var outArr = []

					// 添加当前自身的完整路径
					outArr.push(innerModPath)
					cache[innerModPath] = []

					// 添加内部包含的所有路径
					for (var iA of innerArr) {
						outArr.push(iA)
						cache[innerModPath].push(iA)
					}

					returnARR = returnARR.concat(outArr)

				}
			}
		}

		// console.log('includePath: '+returnARR)
		return returnARR

	}


	try {
		// 判断文件上否存在
		var _f = fs.statSync(_url)


		/*
			过滤以下内容:
			----------------------------------
			/parts   parts目录
			.*		 以 . 命名的文件夹
		*/
		if ( /^(parts)|^\.\w+/i.test(fileName) ) return;

		// 如果是文件
		if (_f.isFile()) {
			var _fpath = false;
			let fs_ext = path.extname(fileName)

			// 模板转 HTML
			if (fs_ext == '.ejs' || fs_ext == '.jade' || fs_ext == '.css') {
			// console.log('changeModArr', changeModArr)
				if (changeModArr.length > 0) {
					

					var thisIncludeArr = includePath(path.extname(fileName), _url, cachingModObj)

					if (thisIncludeArr.length > 0) {

						for (var changeMod of thisIncludeArr) {

							if (inArray(changeMod, changeModArr) > -1) {
								// console.log('变化的子模板是：', changeMod)
								
								makeFiles(fileName, _url, _curl, delaySend)
								break;
							}

						}
					}

				}

				_fpath = getHTMLPath(fileName, _url, _curl);
			}

			// 判断要复制到的文件夹中是否已经有此文件了
			try {
				let _ff = fs.statSync(_fpath ? _fpath: _curl)

				// 当前文件内容较新
				if (_ff.mtime < _f.mtime) {
					// 如果文件不是ejs或jade的模板，则提示文件有冲突
					// 冲突：模板的文件没有生成的文件大，可能是修改了生成文件或是模板文件删除内容太多
					// 当前文件比生成区文件小（主要是非模板文件）
					// 注：在强制下会覆盖生成
					if (_ff.size > _f.size && 
						path.extname(fileName) != '.ejs' && 
						path.extname(fileName) != '.jade'
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
						path.extname(fileName) != '.css' && 
						path.extname(fileName) != '.ejs' && 
						path.extname(fileName) != '.jade' &&
						path.extname(fileName) != '.html' &&
						path.extname(fileName) != '.htm'
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
			createFolders(_url, _curl, delaySend, changeModArr, cachingModObj)
		}

	} catch (err) {
		console.log(err, '\n没有文件')
	}

}

// 输出文件
// @fileName 文件名
// @_url 原始路径
// @_curl 复制目标路径
function outputs(fileName, _url, _curl) {
	var html = '';


	if (path.extname(fileName) == '.ejs') {

		var read = fs.readFileSync(_url, 'utf8');

		html = ejs.render(read, {filename: _url});
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

	var _extname = path.extname(fileName);

	switch (_extname) {
		// 如果文件是以 ejs 或是 jade 的类型
		case '.ejs':
		case '.jade':
			// 生成 HTML
			outputs(fileName, _url, _curl);
			break;

		// 如果是样式，且不是压缩过的样式
		case '.css':
			if (path.basename(fileName, '.css').indexOf('.min') === -1) {
				console.log('NOT MIN CSS : ' + fileName)
				// 样式以下划线命名的将要被忽略
				if (path.basename(fileName).substr(0, 1) !== '_') {
					// css.css(_url, _url);
					css.css(_url, _curl);
				}
			} else {
				// min 文件直接输出
				var readS = fs.createReadStream(_url)
				var writeS = fs.createWriteStream(_curl)
				readS.pipe(writeS)
			}

			break;

		case '.js':
			js.min(_url, _curl, true)
			break;

		default:
			// 除html以外直接复制
			var readS = fs.createReadStream(_url)
			var writeS = fs.createWriteStream(_curl)
			readS.pipe(writeS)
	}

}

function createFolders(src, curl, delaySend, changeModArr, cachingModObj) {

	try {
		var isMS = fs.mkdirSync(curl)
	} catch (err) {

	}

	readFile(src, curl, delaySend, changeModArr, cachingModObj)
}

/*
	对parts文件进行缓存
	---------------------------------------
	当parts中的文件发生变化时，更新其所有相关有引用文件

*/
function getPartsList (_path) {
	let filesArr = fs.readdirSync(_path);
	let result = [];
	// 当前项目中所有 parts 文件夹
	let partsDirArr = [];
	console.log('******* GET MODS *******')
	console.log('Pro. Add. : ' + _path)

	/*
		获取所有的 parts 目录
		然后把parts的内部文件统一处理
	*/ 
	const forEachDir = function(_pathName) {
		let dirFilses = fs.readdirSync(_pathName);

		// 遍历文件夹中的文件
		for (let i of dirFilses) {
			let newPath = path.normalize(path.join(_pathName,i));
			let fileStat = fs.statSync(newPath);

			// 只查看文件夹
			if (fileStat.isDirectory()) {
				// 文件夹只能是 parts 文件夹
				if (i === 'parts') {
					partsDirArr.push(newPath)
				}
				// 不是parts文件夹，我们再对内部文件遍历
				// 把它内部的所有 parts 文件夹列出来
				else {
					// console.log('Dir name: '+ newPath)
					forEachDir(newPath)
				}
			}
		}
	};


	// 得到所有 parts 文件夹下的文件
	const getPartsFile = function (dirPath) {

		let partsDirFiles = fs.readdirSync(dirPath);
		// 是否有版本文件，默认为无
		// 在没有时，所有的关联文件默认是会被更新到的
		let isVersionFile = false;
		let versionFile = {};
		// 当前版本文件的路径
		let versionPath = path.join(dirPath, 'version.json');
		// console.log('V P :' + versionPath)

		try {
			// 读取版本文件内容
			versionFile = fs.readFileSync(versionPath)
			// 解释成json，以方便使用
			versionFile = JSON.parse(versionFile)
			// 如果正常读取到了版本文件
			isVersionFile = true;

		} catch (err) {
			console.log('Warning: Not have version files!\n' + err)
		}

		// 遍历文件，然后对文件进行属性进行对比
		// 以得到发生变化的文件信息
		for (let filesname of partsDirFiles) {
			let filePath = path.join(dirPath, filesname);
			let fileStat = fs.statSync(filePath);


			// 处理的文件不包含版本控制文件
			if (filesname !== 'version.json') {

				// 当文件是目录时
				if (fileStat.isDirectory()) {
					getPartsFile(filePath)
				} 
				// 当只是文件时
				else if (fileStat.isFile()) {

					let timeStr = +new Date(fileStat.mtime);

					// 如果没有版本控制文件在
					if (!isVersionFile) {
						versionFile[filesname] = timeStr;
						result.push(filesname)
					}
					// 如果版本控制在的话
					else {
						// 判断文件的修改时间是否变化了
						if (versionFile[filesname] !== timeStr) {
							// console.log('= C = ', filesname)
							// console.log(versionFile[filesname])
							// console.log(timeStr)
							versionFile[filesname] = timeStr;
							result.push(filePath)
						}
					}

				}
			}
		}

		// 更新或生成版本控制文件
		fs.writeFile(versionPath, JSON.stringify(versionFile), {encodeing: 'utf8'})
	}


	forEachDir(_path)
	// console.log('所有 Parts 文件夹: ', partsDirArr)

	for (let i of partsDirArr) {
		getPartsFile(i)
	}

	console.log('Have been change sub-template：\n' + result)
	return result 
}


/*
	判断元素是否在数组中
	@str 查询内容
	@arr 数组
*/
function inArray(str, arr) {
	var index = -1;

	for (var i =0, l = arr.length; i < l; i++) {
		if (arr[i] === str) {
			index = i;
			break
		}
	}

	return index
}