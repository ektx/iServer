# iTools  

本地静态服务器，通过浏览器快捷管理文件服务。


## 功能      

- 静态服务器
- 模块化项目开发
	- 支持对 min 文件不存在时，自动查询引用对应完整文件功能  
	- 支持对html 文件不存在时，自动查询 ejs 模板文件
	- 支持工作台生成输入html文件（ejs > html）
- JavaScript、Css文件压缩
- 在浏览器中实现文件管理器
- 支持 readme.md 文件查看

## 安装

```Shell
# 使用github (use github)
# 1. 克隆(clone)
git clone https://github.com/ektx/iServer.git
cd iServer
# 2. 安装依赖 (install package)
npm i
# 3. 建立本地命名 (make node server)
npm link
```


## 使用

```Shell
# 进入你想要作用服务器根目录的地址:
cd your_existing_folder

# 启动:
# 启动8000端口并在浏览器中打开服务器根目录
its -p 8000 -b

# 帮助信息
its -h
```

## 卸装
```sh
# with github
# 进入 iServer 克隆目录
npm unlink
```

## 代理使用
```javascript
// 代理访问 google
fetch('/iproxy-url=https://google.com', ...)
```

## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [Express](http://expressjs.com/)  


## License

MIT
