/*
	app Dev所用的Node服务器
	v 0.2.5
	---------------------------------------------------
	1.支持显示服务IP，方便使用
	zwl	 <myos.me>  2015-4-29
*/

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var os = require('os');

// 服务器网络信息
var ifaces = os.networkInterfaces();
var addresses = [];

for (var i in ifaces) {
	for (var ii in ifaces[i]) {
		var address = ifaces[i][ii];
		if (address.family === 'IPv4') {
			addresses.push(address.address);
		}
	}

};


var root = __dirname;
var fileLocation;
var i = 0;

/*
	404 错误
	--------------------------------------------
*/
function send404(res) {
	console.log(fileLocation + ' 404!');
	res.writeHead(404, {'Content-Type': 'text/html; charset="utf8"'});
	res.write('<h3>404 Error!</h3>');
	res.write('<a href="/">返回首页</a>');
	res.end();	
}

function send505(res) {
	console.log(fileLocation + ' 505 Server Error!');
	res.writeHead(505, {'Content-Type': 'text/html; charset="utf8"'});
	res.write('<h3>505 Server Error!</h2>')	
}

function showDirecotry(req, res, filePath) {
	var html = '';

	fs.readdir(filePath, function(err, files) {
		var html = getHTML(files, filePath);

		res.writeHead(200, {'Content-Type': 'text/html;charset="utf8"'});
		res.write(html);
		res.write('<h5>共有 '+files.length+' 个文件！');
		res.write('</html>')
		res.end();
	})
}


/*
	得到返回HTML
	--------------------------------------------
*/
function getHTML(files, filePath) {
	var title = '';
	var body = [];
	var aURL;

	// 如果目录是'public'且在根上时
	if (path.basename(filePath) == 'public' && root.length == filePath.length-1) {
		title = '/'
	} else {
		title = path.basename(filePath);
	}

	if (filePath.lastIndexOf('/') < 0) {
		// filePath += '\\';
	}
	console.log(filePath);

	body.push("<!doctype html>");
	body.push("<html>");
	body.push("<head>");
	body.push('<meta charset="utf-8">');
	body.push('<link rel="stylesheet" type="text/css" href="/lib/css/layout.css">');
	body.push("<title>localhost:4000</title>");
	body.push("</head>");
	body.push("<body>");
	body.push("<h3>"+title+"</h3>")
	body.push("<ul>");

	if (root.length != filePath.length-1) {
		// body.push("<li><a href='..'>上一级</a></li>");

		// 创建目录面包屑
		var filelink = filePath.replace(__dirname,'').split('\\');
		var aFileLink = '';
		filelink.pop();
		filelink.shift();

		body.push('<li><a class="nav-tags" href="/">.</a>');

		filelink.forEach(function(val, i) {
			if (i == 0) return;
			
			aFileLink += '<a class="nav-tags" href="';
			for (var j = 0; j < filelink.length - i - 1; j++) {
				aFileLink += '../';
			}
			aFileLink += "\">"+ val+"</a>";
		})
		// console.log('aFileLink:'+aFileLink);

		body.push(aFileLink);
		body.push("</li>")
	}

	if (files.length > 0) {
		files.forEach(function(val, index) {
			// console.log('val '+ index+':'+val);
			console.log(filePath + val);
			if ((val == 'css' || val == 'img') && filePath == 'E:\\lantooDev\\public\\\\') {
				console.log(val + ' not show windows!')
			} else {

				var stat = fs.statSync(filePath + val);

				if (stat.isDirectory(val)) {
					aURL = val + '/';
					aImg = "folder";
				} else {
					aURL = val;
					aImg = "file";
				}
				// console.log(val);
				body.push('<li><img class="osFileIco" src="/lib/img/'+aImg+'.png"/><a href="'+aURL+'">'+val+'</a></li>');
			}
		});
	} else {
		body.push("<li><h2>No files in hrer!</li>");
	}


	body.push("</ul>");
	body.push("</body>");

	return body.join('');
}

/*
	显示文件
	----------------------------------------------------------
*/
function sendFile(res, filePath) {

	fs.readFile(filePath, function(err, file) {
		if (err) {
			send404(res);
		} else {
			res.writeHead(
				200, 
				{'Content-Type': mime.lookup(path.basename(filePath))}
			);
			res.end(file);
		}
	})
}


/*
	文件服务
	---------------------------------------
*/
function serverStatic(req, res, pathname) {
	// 如果地址是lib中的文件,不用添加 public
	if (pathname.lastIndexOf('/lib/') == 0) {
		fileLocation = path.join(__dirname, pathname)
	} 
	// 列出 public 下的文件
	else {
		fileLocation = path.join(root, '/public/', pathname);
	}

	// console.log('fileLocation:' + fileLocation)

	if (fs.existsSync(fileLocation)) {
		var isDir = fs.statSync(fileLocation).isDirectory(pathname);

		if (isDir) {
			showDirecotry(req, res, fileLocation);

		} else {

			var stream = fs.createReadStream(fileLocation);

			stream.setEncoding('utf-8');

			stream.on('error', function() {
				send505(res);
			});

			// stream.pipe(res);
			sendFile(res, fileLocation);

		}		
	} else {
		send404(res);
	}
}


http.createServer(function(req, res) {
	var pathname = decodeURI(url.parse(req.url).pathname);
	// 对url转译
	i++;
	console.log(i + ': '+ pathname);

	if (path.extname(pathname) == '.ejs') {
		res.end()
		return;
	}

	serverStatic(req, res, pathname);

}).listen(8888, function() {
	console.log('====================================');
	console.log('Welcome to Dev');
	console.log('====================================');
	console.log('本地请访问: localhost:8888 \n         或 '+ addresses[1]+':8888');
	console.log('内网请访问: '+ addresses[0]+':8888');


});

process.stdin.resume();
process.on('SIGINT', function() {
	console.log('Bye!')
	process.exit(0)
})