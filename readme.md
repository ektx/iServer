## iServer

###iojs server  

#### v0.3.0
* 支持以服务器列表形式查看开发环境  
* 支持以网页的方式查看页面  
* 重构了服务器,增强了稳定性  

使用方式:
```javascript
iojs epp.js
```

防止 ejs 模板下载设置:
```javascript
// server-static index.js 目录下相应位置添加:
	return function serveStatic(req, res, next) {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return next()
		}
		// 添加
		if (req.path.indexOf('.ejs') > 0) {
			//如果是ejs的文件转化成html文件
			res.redirect(req.path.replace('.ejs', '.html'))
			return // 防止ejs错误输出
		}
	// ...
```

文件服务器开启方式:  
```javascript
// epp.js
var ifileServer = true
```

单网站服务器形式:
```javascript
// epp.js
var ifileServer = false
```


查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)