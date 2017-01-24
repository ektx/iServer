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