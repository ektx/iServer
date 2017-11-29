
const fs = require('fs')
const path = require('path')
const mime = require('mime')

const statAsync = require('./statAsync')

/*
	sendFile
	----------------------------------------------
	@res: 响应
	@filePath: 文件路径
*/
module.exports = async function(req, res, rootPath, fileName) {
	
	// 如果 等于 INDEX 就是发送模版了
	// 在 server.js  处理请求目录时处理
	if (fileName === 'INDEX') {
		fileName = '../web/index.html';
	}

	let fileAllInfo = await statAsync(rootPath, fileName)
	let filePath = fileAllInfo.path

	if (req.headers['range']) {

		let stat = fileAllInfo.stats
		let total = stat.size;
		let range = req.headers.range;
		let parts = range.replace(/bytes=/, '').split('-');
        let partialstart = parts[0];
        let partialend = parts[1];

        let start = parseInt(partialstart, 10);
        let end = partialend ? parseInt(partialend, 10) : total -1;
 
        let chunksize = (end - start) + 1;

        console.log('RANGE: ' + start+' - '+ end+ ' = '+ chunksize);
        console.log('----------------------------------------');

        res.setHeader("Content-Type",mime.lookup(path.basename(filePath)));

        if (parts) {
            res.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + total);
            res.setHeader("Content-Length", chunksize);
            res.writeHead('206', "Partial Content");
            
            let stream = fs.createReadStream(filePath, {start: start, end: end});
            stream.pipe(res)
            
        } else {
            res.removeHeader("Content-Length");
            // 服务器无法处理请求的数据区间
            res.writeHead(416, "Request Range Not Satisfiable");
            res.end();
        }

	} else {

		let wh_opt = resHeaders( 
				mime.lookup(
					path.basename(filePath)
				) 
			);

		let stream = fs.createReadStream(filePath);

		stream.on('error', function() {
			sendError(res, 505)
		})

		res.set(wh_opt)

		stream.pipe(res);
			
	}

}


/*
	响应头
	-----------------------------------------
	@type {string} 文件类型,默认我们用 text/html
*/
function resHeaders(type = 'text/html') {

	let headerInfo = {
		// 容许跨域请求 * 表示所有,你可以指定具体的域名可以访问
		'Access-Control-Allow-Origin': '*',
		'Content-Type': type+';charset="utf8"',
		'x-xss-protection': '1; mode=block',
		'Server': 'iTools 0.0.2 beta'
	};

	let cacheType = ['javascript', 'css', 'jpeg', 'jpg', 'png', 'gif', 'markdown'];

	if ( cacheType.includes( type.split('/')[1] ) ) {
		let expires = new Date();
		// 31536000 * 1000
		expires.setTime(expires.getTime() + 100000);

		headerInfo.Expires = expires.toUTCString();
		// 缓存一年 60 * 60 * 24 * 365
		headerInfo['Cache-Control'] = 'max-age=' + 100000;
	}

	return headerInfo;
}