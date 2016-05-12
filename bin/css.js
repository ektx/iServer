var fs = require('fs');
var path = require('path');

/* 
	主程序
	@oldPath : 原始目录
	@outputPath : 目标目录
*/
function css(oldPath, outputPath) {

	try {

		var data = fs.readFileSync(oldPath, 'utf8');
		var cssname = path.basename(oldPath, '.css');
		var outdirname = path.dirname(outputPath);
		console.log(outdirname)
		
		// min 文件输出路径
		var outMinFilePath = path.normalize(outdirname + '/' + cssname+'.min.css');

		// 在当前目录下生成压缩文件
		if (oldPath === outputPath) {

			outMinFile(outMinFilePath, minCss(cssname, outdirname, data));

		} else {

			var RegImport = new RegExp("^@im[^;]+", "gi");
			var importCss = data.match(RegImport) || [];
			// css name
			var dirname = path.dirname(oldPath);

			// 要输出的样式内容
			var outpouCss = data;
			// 清除 import 引用样式
			outpouCss = outpouCss.replace(/@import.*?.css('|")\);/gi, '')

			console.log('@import 引用样式有:' + importCss + '\n个数有:'+importCss.length);

			if (importCss.length > 0) {

				for (var i = 0; i < importCss.length; i++) {
					(function(i) {

						var newImpPath = path.normalize(dirname + '/' + importCss[i]);

						// 读取引用样式内容
						fs.stat(newImpPath, function(err, cssdate) {
							if (err) {
								console.log(newImpPath + ' 引用样式表不存在!!')
							} else {
								// 读取样式表内容
								cssdate = fs.readFileSync(newImpPath, 'utf-8');

								cssdate = cssdate.replace(/@charset\s('|")utf-8('|");/i, '');

								outpouCss += cssdate;
							}

							// 输出
							if (i == importCss.length -1) {

								// 合成文件
								fs.writeFile(outputPath, outpouCss, 'utf8', function(err) {
									if (err) { 
										console.log('合成输出出错了！')
									} else {
										console.log('合成成功: '+ cssname);
									}
								});

								console.log('压缩文件 CSS ：'+cssname)

								outMinFile(outMinFilePath, minCss(cssname, outdirname, data));
							}
						})

					})(i)
				}
			}

			// 如果没有引用样式
			// 直接输出，并压缩
			else {
				outMinFile(outMinFilePath, minCss(cssname, outdirname, data));

				// 合成文件
				fs.writeFile(outputPath, data, 'utf8', function(err) {
					if (err) { 
						console.log('!!')
					} else {
						console.log(':: '+ cssname);
					}
				});

			}
		}

	} catch (err) {
		console.log(err)
	}

}


/* 
	压缩功能
	@cssname : 样式名称
	@outputPath : 目标目录
	@css : 样式内容
*/
function minCss(cssname, outputPath, css) {
	// 压缩css
	// \t 去换行
	// \s{2,} 去出现2次以上的空格
	// \/\*(.|\r\n|\n)*?\*\/ 去注释
	// \;(?=(\n|\r\n|\t)*?\}) 去样式中最后一个 ;
	/* 
		\s(?=\{) 去 .classname { .. }中的{前空格或是
				 去 @keyframes animate { to { }} {前的空格

		\s(?=\() 去除(前的空格
		,\s      去,后的空格
	*/

	var minOutputCss = css.replace(/(\t|\s{2,}|\/\*(.|\r\n|\n)*?\*\/|\;(?=(\n|\r\n|\t)*?\})|\s(?=\{)|\s(?=\())/g, '');

	// 去 : 后的空格
	minOutputCss = minOutputCss.replace(/:\s/g, ':');

	minOutputCss = minOutputCss.replace(/,\s/g, ',');

	minOutputCss = minOutputCss.replace(/\s>\s/g, '>')
	
	return minOutputCss;

};

/*
	输出 minCss 文件
	@outPath 存放路径
	@minCss  压缩的Css内容 
*/
function outMinFile(outPath, minCss) {
	// 输出处理之后的样式 
	fs.writeFile(outPath, minCss, 'utf8', function(err){
		if (err) console.log(err);
		console.log('OK!')
	});	
};


exports.css = css;

