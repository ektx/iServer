

const fs = require('fs');
const path = require('path');

const ejs  = require('ejs');
const mime = require('mime');

/*
	获取文件类型
	-----------------------------------------
*/
function getFileType( files, filePath ) {
	let result = [];

	if (files.length > 0) {
		files.forEach( (val, index) => {
			let stat = fs.statSync( filePath + val);
			let type = '';
			if ( stat.isDirectory() ) {
				type = 'dir';
			}
			else {
				type = 'file'
			}

			result.push({
				name: val,
				type: type
			})
		})
	}

	return result;
}

/*
	showDirecotry
	---------------------------------------------------
	@req: 请求
	@res: 响应
	@serverRootPath: 根目录
	@reqPath: 请求路径
*/
exports.showDirecotry = (req, res, serverRootPath, reqPath) => {
	let _filePath = decodeURI(path.join(serverRootPath, reqPath))

	reqPath = decodeURI(reqPath);

	fs.readdir(_filePath, (err, files)=> {
		if (err) {
			console.log(err);
			res.send('Show Directory Error!');
			return;
		}

		let fileInfo = getFileType(files, _filePath);


		let breadCrumbs = reqPath.split('/');
		breadCrumbs.pop();

		let index = breadCrumbs.length - 1;
		let title = index ? breadCrumbs[ index ] : 'iServer' ; 

		res.render('project', {
			serverType: 'tool',
			files: fileInfo,
			host: '',
			title: title,
			titurl: reqPath,
			usrInfo: false,
			breadCrumbs: breadCrumbs,
			projectInfo: '',
			proStatus: ''
		})
	})

}


/*
	sendFile
	----------------------------------------------
	@res: 响应
	@filePath: 文件路径
*/
exports.sendFile = function(req, res, filePath) {
	
	let stat = fs.statSync(filePath);

	if (req.headers['range']) {

		var total = stat.size;
		var range = req.headers.range;
		var parts = range.replace(/bytes=/, '').split('-');
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total -1;
 
        var chunksize = (end - start) + 1;

        console.log('RANGE: ' + start+' - '+ end+ ' = '+ chunksize);
        console.log('----------------------------------------');

        res.setHeader("Content-Type",mime.lookup(path.basename(filePath)));

        if (parts) {
            res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
            res.setHeader("Content-Length", chunksize);
            res.writeHead('206', "Partial Content");
            
            var stream = fs.createReadStream(filePath, {start: start, end: end});
            stream.pipe(res)
            
        } else {
            res.removeHeader("Content-Length");
            res.writeHead(416, "Request Range Not Satisfiable");
            res.end();
        }

	} else {
		let lastModifed = stat.mtime.toUTCString();

		let wh_opt = resHeaders( 
				mime.lookup(
					path.basename(filePath)
				) 
			);
		wh_opt['Last-Modified'] = lastModifed;

		if (req.headers['if-modified-since'] && lastModifed == req.headers['if-modified-since'] ) {
			res.writeHead(304, wh_opt);
			res.end()
		} else {

			let stream = fs.createReadStream(filePath);

			stream.on('error', function() {
				sendError(res, 505)
			})

			res.writeHead( 200,	wh_opt )

			stream.pipe(res);
			
		}
	}

}


/*
	响应码
	--------------------------------------------
*/
exports.sendError = function sendError(res, codeNo, msg) {
	res.writeHead(codeNo, resHeaders() );
	res.write('<h2>'+msg+'!</h2>');
	res.end()	
}


/*
	响应头
	-----------------------------------------
	@type {string} 文件类型,默认我们用 text/html
*/
function resHeaders(type) {
	type = type || 'text/html';

	let headerInfo = {
		// 容许跨域请求 * 表示所有,你可以指定具体的域名可以访问
		'Access-Control-Allow-Origin': '*',
		'Content-Type': type+';charset="utf8"',
		'x-xss-protection': '1; mode=block',
		'Server': 'iServer 5.0.0 beta'
	};

	let cacheType = ['javascript', 'css', 'jpeg', 'png', 'gif', 'x-markdown'];

	if ( cacheType.includes( type.split('/')[1] ) ) {
		let expires = new Date();
		// 31536000 * 1000
		expires.setTime(expires.getTime() + 31536000000);

		headerInfo.Expires = expires.toUTCString();
		// 缓存一年 60 * 60 * 24 * 365
		headerInfo['Cache-Control'] = 'max-age=' + 31536000;
	}

	return headerInfo;
}

