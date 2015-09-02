## iServer

iojs server  
- 是什么?  
本地前端开发迷你服务器,主要用于可以用模版的方式来开发你的静态页面  

- 功能  
1. Node服务器功能
2. `ejs`或`jade`模板前端开发  
2. `ejs`或`jade`模板合成的静态页面  
3. 查看访问者IP    

## 更新日志  
#### `epp.js` `v0.8.5`
* 修改生成页面功能,当前目录下当前生成,生成以文件夹关系决定  
* parts 默认不生成,如果在文件下指定,可以生成
* 优化页面展示细节


#### `app.js` `v0.3.0` 
* 修正ejs模板文件下载问题
* 增加退出服务问候  
* 文件服务处理统一用使用 `lib\files.js` 文件  
* 优化了服务器大小   
   


## 使用方式:  
首先您要保证你的电脑上安装了 [IOJS](https://iojs.org/en/index.html) 或 [node.js](https://nodejs.org/) 
* 注: 如果开发时采用了`jade`与`ejs`混合使用的模板,请注意名称不要相同,如给定的test下有2个nav命名的文件,生成时只有一个`nav.html`  

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
npm start // 效果如上

// 启动服务器时,自动打开浏览器
// --open: true 以默认浏览器打开
// --o: true    以默认浏览器打开

// --open : [true | iexplore | chrome | firefox | opera ]
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