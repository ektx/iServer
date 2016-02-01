## iServer 2.7
![iServer 2](/bin/favicon.png 'Server 2.7')  


- 启动方式
```bash
node epp.js
```
 
## 功能说明:    
* Nodejs 文件服务器  
* 让开发者使用`ejs`和`jade`来组件化开发自己的静态页面     
* 支持样式的合并与压缩功能
* 生成文件统计与输出
* 覆盖生成功能  
* 本地模拟数据引用 
* 从命令行启动并打开浏览器   

## 更新日志
* 新加从命令行启动并打开浏览器  
* 重新优化了命令行功能    
* 部分细节优化   
  
## 本地模拟数据使用方式  
```js
/* 1. 在`bin`中新建个 `config.json`
   添加数据
   比如你的请求为：
   post /demo/getUseList 
   请求doem中getUseList模拟数据 
   其中首个//之间请统一起来,用来指定public的文件夹

*/
{
	'demo': 'demo'
}

/*  2.在 demo/data/config.josn中添加路径
	
*/
{
	'/demo/getUsrList': 'getUsrList.json'
}

// 3.添加 getUsrList.json 数据

```

## 相关资料  
查看 [node.js](https://nodejs.org/)  
查看 [IOJS](https://iojs.org/)  
查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  
查看 [Jade](http://jade-lang.com/)  