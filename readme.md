# iServer 5.2.x  


## 功能说明:    

### 作为服务器使用
__需要 Mongodb 数据库__

* Node.js 多用户服务器 
* 配合 git 服务器
* 支持渲染模板文件, ejs或pug
* 支持用户注册与登录及密码修改
* 增加 api 接口
  - 用户项目接口

### 作用本地静态服务器   

* 让开发者使用 `ejs` 和 `pug` 来组件化开发自己的静态页面       
* 支持样式的合并与压缩功能  
* 生成文件及统计与输出 
* 从命令行启动并打开浏览器  
* 支持生成 `js` `source map`  
* 支持min文件重向功能  
* [增加代理跨域功能](https://github.com/ektx/iServer/tree/master/Doc#使用代理服务器-iproxy-url)
* 支持快速打开本地文件 [Demo](/Doc/images/openDir.gif)




## 文件生成

[文档](Doc/生成页面功能.md)



## 安装

```Shell
# 使用 NPM (use npm)
npm install -g iservers

# 使用github (use github)
# 1. 克隆(clone)
git clone https://github.com/ektx/iServer.git
cd iServer
# 2. 安装依赖 (install package)
npm i
# 3. 建立本地命名 (make node server)
npm link
```


## 快速启动

```Shell
# 进入你想要作用服务器根目录的地址:
cd your_existing_folder

# 启动:
iserver tool

# 在浏览器中打开浏览:
http://localhost:8000
```
> 更多使用帮助:  [配置文档](/Doc/)


## 卸装
```sh
# with NPM
npm uninstall -g iservers

# with github
npm unlink
```


## License

MIT


## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  
查看 [Jade](http://jade-lang.com/)  