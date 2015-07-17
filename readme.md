## iServer

###iojs server  

v.0.2.2  
1.增强服务器支持中文名的页面工能  
2.优化服务输出提醒功能  
3.修复首次读取ejs时,控制台报错问题   

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