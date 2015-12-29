var fs = require('fs');
var path = require('path');

/* 
	主程序
	@oldPath : 原始目录
	@outputPath : 目标目录
*/
exports.css = function(oldPath, outputPath) {

	fs.readFile(oldPath, 'utf8', function(err, data) {
		if (err) {
			console.log(err)
		} else {
			console.log('css: ' + oldPath);
			console.log('css: '+outputPath);
			
			var outpouCss = '@charset "utf-8";\n';
			var RegImport = new RegExp("(\\w+\\/?)*.css(?=')", "gi");
			var importCss = data.match(RegImport) || [];
			// css name
			var cssname = path.basename(oldPath, '.css');
			var dirname = path.dirname(oldPath);
			// 输出路径
			var outdirname = path.dirname(outputPath);


			console.log('@import 引用样式有:' + importCss + '\n个数有:'+importCss.length);

			if (importCss.length > 0) {

				for (var i = 0; i < importCss.length; i++) {
					(function(i) {

						var newImpPath = path.normalize(dirname + '/' + importCss[i]);

						// 读取引用样式内容
						fs.stat(newImpPath, function(err,cssdate) {
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

								console.log('合成文件：'+cssname)

								minCss(cssname, outdirname, outpouCss)
							}
						})

					})(i)
				}
			}

			// 如果没有引用样式
			// 直接输出，并压缩
			else {
				var readS = fs.createReadStream(oldPath);
				var writeS = fs.createWriteStream(outputPath);
				readS.pipe(writeS);

				minCss(cssname, outdirname, data);
			}
		}
	})
}


/* 
	压缩功能
	@cssname : 样式名称
	@outputPath : 目标目录
	@css : 样式内容
*/
function minCss(cssname, outputPath, css) {
	var newdir = path.normalize(outputPath + '/' + cssname+'.min.css');

	// 压缩css
	// \t 去换行
	// \s{2,} 去出现2次以上的空格
	// \/\*(.|\r\n|\n)*?\*\/ 去注释
	// \;(?=(\n|\r\n)*?\}) 去样式中最后一个 ;
	/* 
		\s(?=\{) 去 .classname { .. }中的{前空格或是
				 去 @keyframes animate { to { }} {前的空格

		\s(?=\() 去除(前的空格
	*/

	var minOutputCss = css.replace(/(\t|\s{2,}|\/\*(.|\r\n|\n)*?\*\/|\;(?=(\n|\r\n)*?\})|\s(?=\{)|\s(?=\())/g, '');

	// 去 : 后的空格
	minOutputCss = minOutputCss.replace(/:\s/g, ':');
	
	// console.log('整合样式:' + css);

	// console.log(minOutputCss);

	fs.writeFile(newdir, minOutputCss, 'utf8', function(err){
		if (err) console.log(err);
		console.log('OK!')
	});
}