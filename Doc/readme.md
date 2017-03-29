# iServer 使用方法

- 作为[本地工具使用手册](tool.md)
- 作为[服务器使用手册](os.md)

## 安装

作为本地简单的web服务器功能,您可以通过以下方式来安装 iServer

```sh
# 1. 全局安装
npm install -g iservers

# 2.1 本地局部安装
npm install iservers

# 2.2 在本地局部安装时,如果想使用iServer的功能,您还需要创建全局启动方式:

npm link
```

## 卸装
```sh
# 1. 全局安装模式下
npm uninstall -g iservers

# 2. 本地安装
# 2.1 进入原始安装位置
# 2.2 删除应用
npm unlink
```


## 使用代理服务器 iproxy-url=

对于跨域请求,你可以在你请求时,添加 __前缀(iproxy-url=)__ 让服务器帮助你跨域:

```javascript
let url = 'your_ajax_url';
let method = 'GET';
let ajax = new XMLHttPRequest();
ajax.open(method, `/iproxy-url=${url}`, true);
ajax.onreadystatechange = ()=> {
  if (this.readyState == 4 && this.status == 200) {
    // this.responseText
  }
}

```

