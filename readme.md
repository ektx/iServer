# iServers 

A simple server developed using nodeJS.
使用nodeJS开发的简单服务器。

本地静态服务器，通过浏览器快捷管理文件服务。

[TOC]

## 主题效果   
支持深色模式与白昼模式   

![主题效果](http://ww1.sinaimg.cn/large/9444af88ly1g9270mkrdpj219p0u0jui.jpg)

- 支持 HTML、CSS、Vue、JOSN、markdown 等文件的预览
- 支持打开本地文件目录
- 支持快速复制文件目录  
- 支持快速查寻功能
- 支持预览图片
- 支持 markdown 文件渲染
- 支持 HTML 文件的预览
- 支持使用二维码快速访问
- LightView（支持滚动历史记录）

## Installation
```bash
npm i -g iservers
```

## Usage
```bash
# 进入你想要作用服务器根目录的地址:
cd yourExistingFolder

# 启动:
# 启动8000端口并在浏览器中打开服务器根目录
iserver -p 8000 -b

# 帮助信息
iserver -h
```

## UnInstallation
```bash
npm uni -g iservers
```

## Features 

### 动态监听文件的变化
![Nov-18-2019 15-11-13.gif](http://ww1.sinaimg.cn/large/9444af88ly1g927pt321hg20hs0bfkjq.gif)

同时也支持文件夹的变化监听。

### 文件预览
可以对 html\css\js等文件文件直接查看
![](http://wx3.sinaimg.cn/large/9444af88ly1fwo814cgurg20lw0e70w9.gif)

### 打开本地文件
在你查看的项目文件时，可以快速的打开本地地址。
![](http://wx3.sinaimg.cn/large/9444af88gy1fvnwqugwvsg20lw0e7jyt.gif)

### 复制文件路径
你可以使用右键然后选择**复制当前路径**快速得到文件地址，然后可以在你要使用的地方，粘贴出来
![](http://wx1.sinaimg.cn/mw690/9444af88gy1fvnwr0ttkaj20h60dkq3v.jpg)

### LightView
高亮hash定位内容，让你更容易看到内容。
![](http://wx3.sinaimg.cn/large/9444af88gy1fxd6cp076ag20q90hzq9m.gif)

## 属性说明
**iserver [options]**

| 属性 | 类型 | 说明 | 默认值 |
|:---:|:---|:---|:---|
| `-p` | `number` | 端口 | - |
| `-s` | `boolean` | 是否要使用 https | true |
| `-b` | `[chrome\|firefox\|ie\|opera]` | 指定打开浏览器 | 默认浏览器 |


## 相关资料  

查看 [node.js](https://nodejs.org/)  
查看 [koa](https://koajs.com/)  


## License

MIT
