## iServer

###iojs server  

#### `epp.js` `v0.5.1`

* 优化命令行功能
* 增加对`jada`有支持
* 优化了控制台的输出
* 增加了部分演示页面在`public`下

#### `app.js` `v0.3.0` 
* 修正ejs模板文件下载问题
* 增加退出服务问候  
* 文件服务处理统一用使用 `lib\files.js` 文件  
* 优化了服务器大小   
   


- 使用方式:  
首先您要保证你的电脑上安装了[IOJS](https://iojs.org/en/index.html)或[node.js](https://nodejs.org/)  

- 启动方式:
```sh
// 默认网站模拟
iojs epp.js

// 指定以文件服务器形式
iojs epp.js --fileServer:true

// 指定端口
iojs epp.js --port:3000

// 指定端口与打开文件服务器
iojs epp.js --fileserver:true --port:3000
// 简约方式
iojs epp.js --f:true --p:3000
```

## 文件夹说明  
- lib  服务器所用文件夹  
- node_modules  组件文件夹  
- public  开发文件文件夹,您的开发文档都放在此
  - parts 模块文件,这里的文件不会生成静态页面,您的组件都可以安全的放在这
  		  比如,可以把html的头部菜单单独存放在此,主页面里引用它


- 防止 ejs 模板下载设置:
```js
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
查看 [Jade](http://jade-lang.com/)  