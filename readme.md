## iServer

iojs server  
- 是什么?  
本地前端开发迷你服务器,主要用于可以用模版的方式来开发你的静态页面  

- 功能  
用于开发预览网页,支持同网络下,多终端上页面查看  
用于生成模板合成的静态页面  
迷你文件服务器(需指定开启状态下)  
查看访问者IP    

## 更新日志  
#### `epp.js` `v0.7.1`
* 修复生成开发环境文件夹错误问题  
* 新加启动服务器时在浏览器中打开网页  
* 新加支持 `jade` 文件的页面生成  
* 优化代码处理  


#### `app.js` `v0.3.0` 
* 修正ejs模板文件下载问题
* 增加退出服务问候  
* 文件服务处理统一用使用 `lib\files.js` 文件  
* 优化了服务器大小   
   


## 使用方式:  
首先您要保证你的电脑上安装了 [IOJS](https://iojs.org/en/index.html) 或 [node.js](https://nodejs.org/)  

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

// 启动服务器时,自动打开浏览器
// --open: [browsername] 以默认浏览器打开
// --o: [browsername]    以默认浏览器打开

// browsername : [true | iexplore | chrome | firefox | opera ]
iojs epp.js --open:true
```

## 文件夹说明  
- lib  服务器所用文件夹  
- node_modules  组件文件夹  
- public  开发文件文件夹,您的开发文档都放在此
  - parts 模块文件,这里的文件不会生成静态页面,您的组件都可以安全的放在这
  		  比如,可以把html的头部菜单单独存放在此,主页面里引用它


```js
// server-static index.js 目录下相应位置添加:
	return function serveStatic(req, res, next) {
		if (req.method !== 'GET' && req.method !== 'HEAD') {
			return next()
		}
		if (req.path.indexOf('.ejs') > 0) {
			//如果是ejs的文件转化成html文件
			res.redirect(req.path.replace('.ejs', '.html'))
			return
		} else if (req.path.indexOf('.jade') > 0) {
			// 防止发送jade模版文件流
			res.redirect(req.path.replace('.jade', '_jade'))
			return
    }
	// ...
```

## 相关资料  
查看 [node.js](https://nodejs.org/)  
查看 [IOJS](https://iojs.org/en/index.html)  
查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  
查看 [Jade](http://jade-lang.com/)  