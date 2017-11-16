# iTools 0.0.1  

本地静态服务器

## 功能说明:      

- 浏览本地文件
- shift + 点击，打开文件所在文件夹
- 后台访问日志功能


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


## 快速启动

```Shell
# 进入你想要作用服务器根目录的地址:
cd your_existing_folder

# 启动:
# 启动8000端口并在浏览器中打开服务器根目录
its -p 8000 -b
```

## 卸装
```sh
# with github
# 进入 itools 克隆目录
npm unlink
```


## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [Express](http://expressjs.com/)  


## License

MIT
