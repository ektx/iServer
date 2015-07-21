## iServer

###iojs server  

#### v0.4.0
* 新加--fileServer:[true|false]命令行功能开启服务器的文件模拟还是网站模拟
* 增加退出服务问候

使用方式:
```javascript
// 默认网站模拟
iojs epp.js
// or
node epp.js

// 指定以文件服务器形式
iojs epp.js --fileServer:true
// or
node epp.js --fileServer:true
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

### 相关资料  
查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  