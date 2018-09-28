# iServers 

本地静态服务器，通过浏览器快捷管理文件服务。

## 功能      
- 支持部分文件的直接预览
- 支持打开本地文件目录
- 支持快速复制文件目录  
- 支持预览图片
- 支持 markdown 文件浏览
- 支持使用二维码快速访问
- 支持滚动历史记录

![](http://wx3.sinaimg.cn/large/9444af88gy1fuxazeqwtcj20go0c5abm.jpg)

## 安装
```bash
npm i -g iservers
```


## 使用
```bash
# 进入你想要作用服务器根目录的地址:
cd yourExistingFolder

# 启动:
# 启动8000端口并在浏览器中打开服务器根目录
iserver -p 8000 -b

# 帮助信息
iserver -h
```

## 卸装
```bash
npm uni -g iservers
```

## 功能展示 
### 文件预览
可以对 html\css\js等文件文件直接查看
![](http://wx2.sinaimg.cn/large/9444af88gy1fvnwqla3aig20lw0e7jv3.gif)

### 打开本地文件
在你查看的项目文件时，可以快速的打开本地地址。
![](http://wx3.sinaimg.cn/large/9444af88gy1fvnwqugwvsg20lw0e7jyt.gif)

### 复制文件路径
你可以使用右键然后选择**复制当前路径**快速得到文件地址，然后可以在你要使用的地方，粘贴出来
![](http://wx1.sinaimg.cn/mw690/9444af88gy1fvnwr0ttkaj20h60dkq3v.jpg)


## 属性说明
**iserver [options]**

| 属性 | 类型 | 说明 | 默认值 |
|:---:|:---:|:---:|:---:|
| -p | number | 端口 | - |
| -s | boolean | 是否要使用 https | true |
| -b | [chrome|firefox|ie|opera] | 指定打开浏览器 | 默认浏览器 |


## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [Express](http://expressjs.com/)  


## License

MIT
