# iServers 

本地静态服务器，通过浏览器快捷管理文件服务。

## 功能      

- 静态服务器
- 支持部分文件的直接预览
- 支持智能选择文件  
- 在浏览器中实现文件管理器
- 支持二维码访问
- 支持滚动历史记录

![](http://wx3.sinaimg.cn/large/9444af88gy1fuxazeqwtcj20go0c5abm.jpg)

## 安装

```Shell
npm i -g iservers

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
iserver -p 8000 -b

# 帮助信息
iserver -h
```

## 卸装
```sh
npm uni -g iservers

# with github
# 进入 iServer 克隆目录
npm unlink
```


## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [Express](http://expressjs.com/)  


## License

MIT
