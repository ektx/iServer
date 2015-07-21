/*
	iServer v.0.4.x
	-----------------------------------------------
	支持页面生成
	使用方法: localhost:8000/:make
*/

var http = require('http')
var fs = require('fs')
var express = require('express')
var url = require('url')
var path = require('path')
var os = require('os')

var generate = require('./lib/generate.js')
var ifiles = require('./lib/files.js')

// 服务器网络信息
var ifaces = os.networkInterfaces()
var addresses = []


var args = process.argv.splice(2)
var argServer = args.length > 0 ? args.join().match(/--fileServer:\w+(?=,?)/i)[0] : undefined
// 默认设置
// 是否需要文件服务器 true 是; false 否
var ifileServer = argServer ? argServer.replace(/--\w+?:/, '') == 'true'? true: false : false;
// 默认端口设置
var port = 8000;


for (var i in ifaces) {
	for (var ii in ifaces[i]) {
		var address = ifaces[i][ii];
		if (address.family === 'IPv4') {
			addresses.push(address.address);
		}
	}

};

var app = express()
var root = !ifileServer ? __dirname + '/public' : __dirname;

app.set('views', root)
app.set('view engine', 'ejs')
app.use(express.static(root))

app.get('/favicon.ico', function(req, res, next) {
	res.end();
	return
})

app.get('*', function(req, res, next) {
	var _path = decodeURI(req.path)

	console.log('用户IP:' + req.ip)
	console.log(req.method + ' ' + _path)

	var _filePath;
	if (_path.split('.')[1] == 'html') {
		_filePath = _path.split('.')[0].replace('/', '')
	} else {
		_filePath = _path
	}

	// 生成静态页面
	if (_filePath === '/:make') {
		var copyPath = __dirname + '/html'
		var root = __dirname + '/Public'

		generate.generate(root, copyPath, app, ifileServer);
		res.send('<h2>生成页面完成,请查看html文件夹</h2>')
		return;
	}

	console.log(req.method + '-' + _filePath)

	if (isDir(_path)) {
		if (_filePath === '/') {

			if (ifileServer) {
				res.redirect('/public/')
			} else {
				res.render('demo')
			}

		} else {

			if (ifileServer) {

				var pathname = decodeURI(url.parse(req.url).pathname)
				ifiles.serverStatic(req, res, pathname, __dirname)

			} else {
				res.redirect('/')
			}
		}
		return
	} else {
		renderFile(res, _filePath)
	}

});

/*
	判断路径是否为目录
*/
function isDir(_path) {
	__path = path.join(__dirname, _path)

	if (fs.existsSync(__path)) {

		var isDir = fs.statSync(__path).isDirectory(_path)
		
		console.log(isDir? '是目录':'非目录文件')

		return isDir;
	} else {
		return false
	}
}


/*
	解析文件
*/
function renderFile(res, _path) {
	console.log('renderFile():' + _path)

	// 错误处理
	res.render(_path, function(err, html) {
		// 如果不存在此页面
		if (err) {
			console.log(err)
			res.status(404).send('<h2>404</h2>')
		} else {
			res.send(html)
		}

	})
}


// 创建指定文件夹
function createPublic(file) {
	var publicF = __dirname + file;

	fs.exists(publicF, function(exists) {
		if (!exists) {
			fs.mkdir(publicF)
		}
	})
}

app.listen(port, function() {
	createPublic('public')

	console.log('Server runing at localhost:'+ port)
	console.log('===============================')
	console.log('iServer')
	console.log('===============================')
	console.log('本地请访问: http://localhost:'+ port +' \n         或 http://'+ addresses[1]+':'+ port)
	console.log('内网请访问: http://'+ addresses[0]+':'+port)
})

process.stdin.resume();
process.on('SIGINT', function() {
	console.log('Bye!')
	process.exit(0)
})