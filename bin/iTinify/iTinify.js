var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);
var tinify = require('tinify');
var config = require('../../config').tinify;
var myCount = config.compressionCount;
var colors = require('colors');
var mk = require('../mkdirs/mkdirs');

// tinify key
// get it from https://tinypng.com/developers
// tinify.key = "Your_API_Key";
tinify.key = config.key;

if (args.length == 0) {
	console.log("请输入要压缩的图片文件或文件夹!\n")
	console.log("node img.js [文件名] [保存文件名(非必填)]")
	console.log("node img.js [文件夹] [保存文件夹(非必填)]")
	return;
}

if (config.key == 'Your_API_Key') {
	console.log('请确认你的 Tinify API Key');
	console.log('请在 config.json 中设置!')
	return;
}

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
				if ( !path.isAbsolute(toSaveDirctory) ) {
					toSaveDirctory = path.join( path.dirname(absoluteCompressPath), toSaveDirctory)
				};
				
			}

			// 保存文件要是png或是jpg
			if (!isPNGorJPG(toSaveDirctory)) {
				console.log('智能保存格式为当前文件相同格式！');

				toSaveDirctory = toSaveDirctory+path.extname(absoluteCompressPath)
				console.log(toSaveDirctory)
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

				// 获取绝对路径
				if ( !path.isAbsolute(toSaveDirctory) ) {
					toSaveDirctory = path.join( path.dirname(absoluteCompressPath), toSaveDirctory)
				}

				try {
					fs.statSync(toSaveDirctory);
				} catch(err) {
					console.log('为您生成存放压缩图片目录: ' + toSaveDirctory);

					mk(toSaveDirctory);
				}
			};

			try {
				cache = require(path.join(toSaveDirctory,'tinify-cache'));
			} catch(err) {
			}			

			// 查询文件列表
			var getFileList = function() {

				for (var i =0, len = files.length; i < len; i++) {
					var _compressionIMG = path.join(absoluteCompressPath,files[i]);
					var _toSaveIMG = path.join(toSaveDirctory, files[i]);
					var fileInfo = fs.statSync(_compressionIMG);

					
					if ( files[i] in cache &&  JSON.stringify(cache[files[i]]) == JSON.stringify(fileInfo.mtime) ) {
						console.log(files[i].yellow);
					} else {

						if (files[i] !== 'tinify-cache') {

							if ( isPNGorJPG(_compressionIMG) ) {
								cache[files[i]] = fileInfo.mtime;
							}

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


/* 
	validate key
	@size 将要压缩文件数量
	@callback 认证之后的操作
*/
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

// 生成压缩缓存
// 用来确认图片是否需要再次进行压缩，删除之后无法判断(慎删)
function createCache(data) {

	fs.writeFile(path.join(toSaveDirctory,'tinify-cache.json'), JSON.stringify(data), 'utf8', function() {
		console.log('= 非压缩文件'.red+' = 已经压缩文件'.yellow+' = 刚压缩文件'.green)
	})
}


/*
	压缩图片
	@compressionPath 压缩文件地址
	@toSavePath 保存文件路径
*/
function compressionIMG(compressionPath, toSavePath) {

	if ( isPNGorJPG(compressionPath) ) {
	
		var source = tinify.fromFile(compressionPath);
		source.toFile(toSavePath);
		console.log( path.basename(compressionPath).green )
	} else {
		console.log( path.basename(compressionPath).red )
	}

}

/*
	获取文件的绝对路径
	@filePath 要得到的文件路径 
*/
function getAbsolutePath(filePath) {
	var absoluteCompressPath = filePath;

	// 如果没有root时，则是相对路径
	if (!path.parse(filePath).root) {
		absoluteCompressPath = path.join(__dirname, filePath);
	}

	return absoluteCompressPath;
}

/*
	是否为PNG or Jpg文件
	@files: 文件路径
*/
function isPNGorJPG(files){
	var extname = path.extname(files);
	var result = false;
	if (extname == '.png' || extname == '.jpg') {
		result = true;
	}

	return result;
}