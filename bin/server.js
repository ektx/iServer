
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
	if (/\/:make/.test(reqPath)) {

		var _dir = path.dirname(_path)

		// console.log('dirname:'+_dir)

		var copyPath = _dir.replace(/public/i, 'html')

		generate.generate(res, _dir, copyPath);

		sendMakeHTML(res);
		return;
	}
	
	fs.stat(_path, function(err, stats) {
		if (err) {
			console.log('No:'.white.bgRed+' - '+_path)

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


function sendMakeHTML(res) {
	var html = '<!doctype html><html><head><meta charset="utf-8">';
	html += '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">';
	html += '<link rel="stylesheet" type="text/css" href="/bin/css/layout.css">';
	html += '<title>成功</title></head><body>';
	html += '<h2>生成页面完成,请查看html文件夹</h2></body>';

	res.send(html)

}