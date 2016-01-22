var fs = require('fs');
var path = require('path');
var uglifyJS = require('uglify-js');
var mime = require('mime');

// 设置生成入口
// @inputPath: [String]  源文件/文件夹地址
// @outPath:   [String]  生成文件/文件夹地址
// @sourceMap: [boolean] 是否生成 source map
// @makelist:  [Array]   返回生成文件列表
function setPath (inputPath, outputPath, sourceMap, makelist) {
	
	if (typeof makelist != 'array') {
		var makelist = [];
	}

	// 生成文件
	// @inputfile:  [string]  源文件路径
	// @outputfile: [string]  输出文件路径
	// @inputfile:  [boolean] 是否生成 source map
	var makeFile = function(inputfile, outputfile, sourceMap) {

		// 如果源文件和输出目录不在同一个目录
		// 复制原来的文件到指定目录
		if (path.dirname(inputfile) != path.dirname(outputfile)) {
			var _outPath = path.dirname(outputfile) +'/'+ path.basename(inputfile)
			var readStream = fs.createReadStream(inputfile)
			var writeStream = fs.createWriteStream(_outPath)

			makelist.push(_outPath)
			readStream.pipe(writeStream)
		}

		// 压缩处理文件
		if (path.extname(inputfile) === '.js' && path.extname(path.parse(i).name) !== '.min') {
			var outPathDir = path.dirname(outputfile);
			var getMinJS = generateMinJS(inputfile, sourceMap);

			// 生成压缩 js
			fs.writeFile(outputfile, getMinJS.code, {encodeing: 'utf8'});
			makelist.push(outputfile)

			if (sourceMap) {
				// 生成 source map
				var sourceMapFile = outputfile.replace('min.js', 'map');
				fs.writeFile(sourceMapFile, getMinJS.map, {encodeing: 'utf8'});
				
				makelist.push(sourceMapFile)
			}

		}
	};


	try {
		var _intStat = fs.statSync(inputPath);

		// 是文件
		if (_intStat.isFile()) {

			makeFile(inputPath, outputPath, sourceMap)

		}

		// 是文件夹
		else if (_intStat.isDirectory()) {

			try {
				_outStat = fs.statSync(outputPath)
			} catch(err) {
				console.log('No Output Dir!!')
				// 生成文件夹
				toMKOutDir = fs.mkdirSync(outputPath)
			}

			// 读取目录下的所有文件
			var files = fs.readdirSync(inputPath);

			for (var i of files) {
				// 只对 js 文件且为非压缩文件处理
				if (path.parse(i).ext === '.js') {

					// 指定输出路径
					var _int = inputPath + '/'+ i;
					var _out = outputPath + '/'+ i;
					// 修改压缩名称
					_out = _out.replace('.js', '.min.js')

					makeFile(_int, _out, sourceMap)
				}

			}


		}
	} catch (err) {
		console.log(err + '\n没有您指定的文件或文件夹!请重新尝试!!')
	}

	return makelist
}

// 生成 min 文件和 source map
// @inputPath: [String]  源文件路径
// @sourceMap: [boolean] 是否生成 source map
function generateMinJS(inputPath, sourceMap) {
	var result = {};

	if (sourceMap) {
		sourceMap = inputPath+'.map';

		result = uglifyJS.minify(inputPath, {
			outSourceMap: sourceMap
		})
	} else {
		result = uglifyJS.minify(inputPath)
	}

	return result;
}

exports.jsmin = setPath

// TEST
// console.log(setPath('E:/xxx','E:/xx', true))