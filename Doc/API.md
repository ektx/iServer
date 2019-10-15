# API

[toc]

## 目录请求
| 地址 | 请求方式 | 备注 |
| --- | :---: | ---|
| `api/filelist` | `GET` | 获取相应的目录下文件列表 |

请求参数
| 参数 | 类型 | 备注 | 示例 |
| --- | :---: | ---| --- |
| path | String | 文件夹地址 | 访问根目录文件列表:<br/>api/getFilePath?path=/ |


返回当前目录下的文件列表信息
| 参数 | 类型 | 备注 |
| --- | :---: | ---|
| name | String | 文件名 |
| path | String | 文件在系统中的位置 |
| isDir | Boolean | 是否为文件夹 |
| type | String | 文件类型 |
| stat | Object | 文件的具体信息 |

> stat 返回的是 fs.stat 所有信息，具体查看：[Class: fs.Stats](https://nodejs.org/dist/latest-v11.x/docs/api/fs.html#fs_class_fs_stats)


## 打开目录
| 地址 | 请求方式 | 备注 |
| --- | :---: | ---|
| `api/opendir` | `GET` | 打开目录 |

请求参数
| 参数 | 类型 | 备注 | 示例 |
| --- | :---: | ---| --- |
| path | String | 文件夹地址 | 打开服务器根目录:<br/>api/opedirn?path=/ |


返回当前目录下的文件列表信息
| 参数 | 类型 | 备注 |
| --- | :---: | ---|
| success | Boolean | 成功失败 |
| mes | String | 失败时返回失败信息 |

## 是否与服务器同机器
| 地址 | 请求方式 | 备注 |
| --- | :---: | ---|
| `api/isServer` | `GET` | 是否与服务器同机器，<br/>true 是；false 否 |


## Socket API

### FileEvent
返回当前系统中的文件变化情况。以下为客户端示例：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js"></script>

<script>
let socket = io()
// 接收事件
socket.on('FileEvent', msg => {
  console.log(msg)
})
</script>
```

msg 返回 Object 数据内容

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| type | String | add 添加<br>change 改变<br>unlink 删除 |
| path | string | 当前的路径 |
