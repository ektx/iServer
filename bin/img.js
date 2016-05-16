var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);
var tinify = require('tinify');
var config = require('../config').tinify;
var myCount = config.compressionCount;

// tinify key
// git it from https://tinypng.com/developers
// tinify.key = "Your_API_Key";
tinify.key = config.key;

if (args.length > 2){
	console.log('请确认地址数!')
} else {
	var compressionDirectory = toSaveDirctory = absoluteCompressPath = args[0];

	// 绝对路径
	absoluteCompressPath = getAbsolutePath(compressionDirectory);
	// 对压缩目录进行处理
	try {
		// 读取文件类型
		var _f = fs.statSync(compressionDirectory);

		// 是文件时
		if (_f.isFile()) {

			if (args.length === 2) {
				toSaveDirctory = args[1];
				// 保存的绝对路径
				toSaveDirctory = getAbsolutePath(toSaveDirctory);
				
				console.log(toSaveDirctory)
			}

			// 保存文件要是png或是jpg
			if (!isPNGorJPG(toSaveDirctory)) {
				console.log('智能保存格式为当前文件相同格式！');

				toSaveDirctory = toSaveDirctory+path.extname(absoluteCompressPath)
			}

			validate(1, function() {
				compressionIMG(absoluteCompressPath, toSaveDirctory);
			})

		}
		// 是文件夹时
		else if (_f.isDirectory()) {

			var files = fs.readdirSync(compressionDirectory);
			var fileLength = files.length;
			// 压缩缓存
			var cache = {};

			// 当有指定压缩目录时
			if (args.length === 2) {
				toSaveDirctory = args[1];

				try {
					fs.statSync(toSaveDirctory);
				} catch(err) {
					console.log('为您生成存放压缩图片目录');

					mkdirs(toSaveDirctory);
				}
			};

			// 保存的绝对路径
			toSaveDirctory = getAbsolutePath(toSaveDirctory);

console.log(toSaveDirctory)

			try {
				cache = require(path.join(toSaveDirctory,'tinify-cache'));
				console.log('has Cache', cache)
			} catch(err) {
				console.log('no cache')
			}			

			// 查询文件列表
			var getFileList = function() {

				for (var i =0, len = files.length; i < len; i++) {
					var _compressionIMG = path.join(absoluteCompressPath,files[i]);
					var _toSaveIMG = path.join(toSaveDirctory, files[i]);
					var fileInfo = fs.statSync(_compressionIMG);

					console.log(typeof cache[files[i]] )
					console.log(typeof JSON.stringify(fileInfo.mtime) )
					console.log(JSON.stringify(cache[files[i]]) ,JSON.stringify(fileInfo.mtime) )
					console.log(cache[files[i]] == JSON.stringify(fileInfo.mtime) )
					
					if ( files[i] in cache &&  JSON.stringify(cache[files[i]]) == JSON.stringify(fileInfo.mtime) ) {
						console.log(files[i],' 已经压缩过了！');
					} else {

						if (files[i] !== 'tinify-cache') {
							cache[files[i]] = fileInfo.mtime;
							compressionIMG(_compressionIMG, _toSaveIMG);
						}
					}
					
				}

				createCache(cache);
			}

			validate(fileLength, getFileList)
		}
	} catch (err) {
		console.log('没有找到您要压缩的文件夹！')
	}
}


// validate key
// @size 将要压缩文件数量
// @callback 认证之后的操作
function validate(size, callback) {
	var compressionsThisMonth = 0;

	console.log('正在为您查询您的压缩数据...')
	tinify.validate(function(err) {
		if (err) throw err;
		
		compressionsThisMonth = tinify.compressionCount;
		console.log('您将要压缩: ' + size + ' 张图片');
		console.log('本月已经使用了: ' + compressionsThisMonth+' 次');
		console.log('您本月还可以用: ' +(myCount -  compressionsThisMonth) +'/'+myCount+ ' 次压缩');

		// var compressionsThisMonth = 1100;

		// how many count can use
		if (compressionsThisMonth + size < myCount) {
			callback()
		} else {

			console.log('您已经不能使用此帐号来压缩图片了！您可以更换帐号或新注册一个\n\nhttps://tinypng.com/developers')

		}
	});

}


function createCache(data) {

	fs.writeFile(path.join(toSaveDirctory,'tinify-cache.json'), JSON.stringify(data), 'utf8', function() {
		console.log('OK tinify Cache')
	})
}

function mkdirs(toURL) {

	try {
		var isMS = fs.mkdirSync(toURL)

		if (!isMS) {
			if(delayPath.length == 0) {
				console.log('文件夹生成完成!')
				delaySend = readFile(root, copyPath, delaySend, changeModArr, cachingModObj)

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

function compressionIMG(compressionPath, toSavePath) {

							console.log(compressionPath, toSavePath,isPNGorJPG(compressionPath))
	if ( isPNGorJPG(compressionPath) ) {
	
		var source = tinify.fromFile(compressionPath);
		source.toFile(toSavePath);
	}

}


function getAbsolutePath(filePath) {
	var absoluteCompressPath = '';

	// 如果没有root时，则是相对路径
	if (!path.parse(filePath).root) {
		absoluteCompressPath = path.join(__dirname, filePath);
	}

	return absoluteCompressPath;
}


function isPNGorJPG(files){
	var extname = path.extname(files);
	var result = false;
	if (extname == '.png' || extname == '.jpg') {
		result = true;
	}

	return result;
}