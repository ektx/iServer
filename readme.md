# iServer 4.0  
## 功能说明:    
### 作为服务器使用

* Node.js 多用户服务器 
* 支持 git 文件服务

### 作用本地静态服务器   

* 让开发者使用 `ejs` 和 `jade` 来组件化开发自己的静态页面     

* 支持样式的合并与压缩功能

* 生成文件及统计与输出 

* 从命令行启动并打开浏览器

* 支持生成 `js` `source map`

* 支持min文件重向功能

## 安装
```Shell
npm install -g iservers
```

## 启动服务
```Shell
# 进入你要作为服务根目录的文件夹
cd sites

# 启动服务
iserver os
iserver tool

# 启动服务并在浏览器中打开
iserver tool -b

# 使 Ejs 或 Jade 生成HTML
localhost:8000/your_project/:make
```

_*_ 服务器配置文件: __os.config.json__

## 卸装

```sh
npm uninstall -g iservers
```

## 其它命令

```shell
# 查看版本
iserver version
```



## License

MIT

## 相关资料  
查看 [node.js](https://nodejs.org/)  
查看 [IOJS](https://iojs.org/)  
查看 [GenneratePages](https://github.com/ektx/Node/tree/master/GenneratePages)  
查看 [Express](http://expressjs.com/)  
查看 [Ejs](http://ejs.co/)  
查看 [Jade](http://jade-lang.com/)  