// 路径对应请求
const fs = require('fs')
const os = require('os')
const url = require('url')
const ejs = require('ejs')
const path = require('path')
const http  = require('http')
const colors  = require('colors')
const server  = require('./server')
const JSZip   = require('jszip')

const IP  = require('./getIPs')



// 访问 / [get]
exports.root = (req, res) => {
	// 默认访问根目录时,如果用户登录过则进入用户中心
	if (req.session.act) {
		res.redirect('/'+req.session.act)
	} 
	// 没有登录过则是进入登录页面
	else {
		res.render('login')
	}
}


// 所有get * 请求
exports.getAll = (req, res) => {
	console.log('%s %s %s', req.method.bgGreen.white, new Date().toLocaleString().blue, decodeURI(req.url) );

	server(req, res);
};

// 服务器内部文件请求
exports.server = (req, res) => {

	server(req, res, {serverRootPath: __dirname.replace('bin', '') });
};

/*
	添加简单的自定义跨域访问
	------------------------
	支持 GET
*/
exports.iproxy = (req, res) => {
	let proxyUrl = req.url.substr(12);
	console.log('%s $ %s', req.method.bgGreen.white,  proxyUrl);

	// 当用户使用 htpps 想让服务器代理时,我们提醒他让开发配合使用相关技术方案
	if (url.parse(proxyUrl).protocol === 'https:') {
		res.send('Please Set: Access-Control-Allow-Origin:*, Help Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS')
	} 
	// 当用户使用的是 http 请求的后端时,我们可以简单的代理
	else {

		http.get(encodeURI(proxyUrl), (xres)=> {
			xres.setEncoding('utf8');
			xres.pipe(res);
		})
		
	}

}



// 所有 post * 请求
exports.postAll = (req, res) => {
	console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) );

	server(req, res, {serverRootPath: process.cwd() });

};


/*
	打开文件目录功能
	-----------------------------------
	为作为本地服务器时,可以通过
	Mac 上 command + 点击
	Win 上 Ctrl + 点击
	打开对应的文件夹
*/
exports.toOpenPath = (req, res) => {

	let platform = os.platform();
	let openPath = path.join(process.cwd(), req.body.url );
	let stat = fs.statSync( openPath );

	if ( stat.isFile() ) {
		openPath = path.dirname( openPath )
	}

	// 处理空格
	openPath = openPath.replace(/\s/g, '\\ ');

	if ( IP.getClientIP(req).isServer ) {
		if ( platform === 'darwin') {
			exec('open '+ openPath)
		} 
		else if ( platform === 'linux2' ) {
			exec('nautilus '+openPath)
		}
		else if ( platform === 'win32' ) {
			openPath = openPath.replace(/\//g, '\\');
			exec('explorer '+ openPath)
		}
	}

	res.send({
		success: true
	})
}

/*
	make
	-----------------------------------
	归属: tool
	说明: 用于生成页面
*/
exports.makeHTMLPage = (req, res) => {
	fs.readFile( path.join(__dirname, '../server/make.ejs'), 'utf8', (err, data) => {
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}

		let html = ejs.render( data )

		res.send( html )
		
	} )

}


/*
	工具 - 打包压缩文件
	---------------------------------
	将当前的文件目录打包并下载
*/
exports.tool_zipdownload = ( req, res) => {
	toZipdownload(req, res);	
}



/*
	压缩输出
	------------------------------
*/
function toZipdownload(req, res) {

	let zipFilePathArr = [];
	let zipFolderPathArr = [];

	let dealWithPath = (_filePath) => {

		let statsData = fs.statSync(_filePath);
		let filter = ['.DS_Store'];
		
		if (statsData.isFile()) {
			if ( !/\.DS_Store/.test(_filePath) ){
				zipFilePathArr.push(_filePath);
			}
		} 
		else if (statsData.isDirectory()) {
			let files = fs.readdirSync(_filePath);

			zipFolderPathArr.push(_filePath);

			for(let i = 0, l = files.length; i < l; i++) {
				dealWithPath(path.join(_filePath, files[i]))
			}
		}

	}

	let addZipFile = () => {

		let zip = new JSZip();

		res.setHeader('Content-Type','application/zip');

		zipFilePathArr.forEach( file => {
			console.log(file)
			let stream = fs.createReadStream(file);
			file = file.replace(path.join(process.cwd(), req.body.filePath), '');
			zip.file(file, stream)
		})

		zipFolderPathArr.forEach( folder => {
			folder = folder.replace(path.join(process.cwd(), req.body.filePath), '');
			zip.folder(folder)
		})
	
		zip
		.generateNodeStream({type:'nodebuffer', streamFiles:true})
		.pipe(res)

	}

	// 取地址
	dealWithPath( path.join(process.cwd(), req.body.filePath) );
	// 压缩文件
	addZipFile();
	console.log( zipFilePathArr.length )
}