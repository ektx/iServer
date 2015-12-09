
var fs = require('fs');
var path = require('path');

var ifiles = require('./ifiles');
var generate = require('./generate')
var colors = require('colors')

/*
	文件服务主功能
	---------------------------------------------
*/
exports.serverStatic = function(req, res, root, reqPath, callback) {
	// 中文乱码转码
	reqPath = decodeURI(reqPath);

	if (reqPath.indexOf('/bin/') !== 0) {
		reqPath = '/public'+reqPath;
	}

	// console.log('reqPath: '+reqPath);
	var _path = path.join(root, reqPath);

	// 生成静态页面
	if (/\/:[make|important]/.test(reqPath)) {

		var _dir = path.dirname(_path)
		var _type = 'make';

		// 判断是否是覆盖生成请求
		if (/important/.test(reqPath)) {
			_type = 'important';
		}

		var copyPath = _dir.replace(/public/i, 'html')

		generate.generate(res, _dir, copyPath, _type);

		sendMakeHTML(res);
		return;
	}

	// 是否存在文件
	var isStat = function(_path, _backupPath) {

		fs.stat(_path, function(err, stats) {
			if (err) {
				console.log('No:'.white.bgRed+' - '+_path)
				/* 
					如果没有指定的文件则为用户推荐ejs或jade的模板文件
					当然前提是在请求html的时候

					目标是为了解决 jQuery load请求时可以统一使用
					/dome/page.html 的方法
					
				*/

				if (_backupPath) {
					_path = _backupPath +'.jade';
					
					console.log('Recommended address:'.white.bgGreen + _path)

					isStat(_path);
					return;
				}

				if (path.extname(_path) === '.html') {
					// 截取原地址
					var cutPath = _path.substr(0, _path.length-5);
					// 先尝试看 ejs的模板
					_path = cutPath + '.ejs';

					// 建议路径
					console.log('Recommended address:'.white.bgGreen + _path)

					// 再次判断文件是否存在
					isStat(_path, cutPath)
					return;
				}

				console.log(_path)

				// 如是根目录不存在,则生成根目录
				if (path.dirname(_path) === root) {
					ifiles.mkdirs(res, _path)
				} else {
					
					ifiles.sendError(res, 404)
				}
				return;
			}

			if (stats.isFile()) {

				if (path.extname(_path) === '.ejs' || path.extname(_path) === '.jade') {
					res.render(_path);
				} else {

					ifiles.sendFile(req, res, _path)
				}

			} else if(stats.isDirectory()) {
				ifiles.showDirecotry(res, root, reqPath)
			}
		})

	}
	isStat(_path)

}

/*
	生成页面
	-----------------------------------------------
	ektx1989 <530675800@qq.com>
*/
function sendMakeHTML(res) {
	var html = '<!doctype html><html><head><meta charset="utf-8">';
	html += '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">';
	html += '<link rel="stylesheet" type="text/css" href="/bin/css/layout.css">';
	html += '<title>成功</title></head><body>';
	html += '<h2>生成页面完成,请查看html文件夹</h2>';
	html += '<a target="_blank" href=":importent">覆盖生成</a>';

	html += '</body>';

	res.send(html)

}