// 路径对应请求
const url = require('url')
const path = require('path')
const http  = require('http')
const queryStrring = require('querystring')
const server  = require('./server')
const { httpLog } = require('./signale')
const zip = require('./ZipFiles')
const IP  = require('./getIPs')

const sendFile = require('./sendFile')


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

/*
	请求服务器内部资源
	-----------------------------------
	内部资源目前存放在 ../web 目录中
*/
exports.getWeb = function (req, res) {
	httpLog.get(decodeURI(req.url))
	let url = path.join(__dirname, req.url.replace(/^\/@/, '../web'))
	sendFile(url, req, res)
}


// 所有get * 请求
exports.getAll = (req, res) => {
	httpLog.get(decodeURI(req.url))
	server(req, res)
}

// 服务器内部文件请求
exports.server = (req, res) => {
	server(req, res, {serverRootPath: __dirname.replace('bin', '') });
}


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

		let methodLowerCase = req.method.toLocaleLowerCase()

		// POST
		if (methodLowerCase === 'post') {

			let bodyContent = queryStrring.stringify(req.body)
			let myUrl = url.parse(proxyUrl)
			let options = {
				hostname: myUrl.hostname,
				port: myUrl.port || 80,
				path: myUrl.path,
				method: req.method
			}

			// 模拟 form 的 POST 提交
			options.headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				// 字节长度
				'Content-Length': Buffer.byteLength(bodyContent, 'utf8')
			}

			let xreq = http.request(options, (xres) => {
				xres.pipe(res)
			})

			xreq.write(bodyContent)
			xreq.end()
		} 
		// GET
		else {
			http.get(encodeURI(proxyUrl), (xres)=> {
				xres.setEncoding('utf8');
				xres.pipe(res);
			})
		}
		
	}

}



// 所有 post * 请求
exports.postAll = (req, res) => {
	console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) );

	server(req, res, {serverRootPath: process.cwd() });

};


/*
	工具 - 打包压缩文件
	---------------------------------
	将当前的文件目录打包并下载
*/
exports.tool_zipdownload = zip

/**
 * 客户端获取服务器IP
 * @send {IPv6: '', IPv4: ''}
 */
exports.serverIP = async function (req, res) {
	res.send(await IP.server())
}