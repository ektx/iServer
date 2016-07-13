# iServer 3.0.1 beta
![iServer 2](/bin/favicon.png 'Server 3.0 Beta')  

## 功能说明:    
* Nodejs 文件服务器  
* 让开发者使用`ejs`和`jade`来组件化开发自己的静态页面     
* 支持样式的合并与压缩功能
* 生成文件及统计与输出
* 覆盖生成功能  
* 本地模拟数据引用 
* 从命令行启动并打开浏览器
* 支持生成 `js` `source map`
* 支持min文件重向功能

## 安装
```
npm install -g iservers
```

## 启动服务
```sh
# 进入你要作为服务根目录的文件夹
# 启动服务
iserver

# 启动服务并在浏览器中打开
iserver -b

# 使 Ejs 或 Jade 生成HTML
localhost:8000/your_project/:make
```

## 卸装
```sh
npm uninstall -g iservers
```


## 相关资料  
查看 [node.js](https://nodejs.org/)  
查看 [IOJS](https://iojs.org/)  
查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  
查看 [Jade](http://jade-lang.com/)  