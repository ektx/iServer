# API

### 目录请求
| 地址 | 请求方式 | 备注 |
| --- | :---: | ---|
| `api/*` | `GET` | 获取相应的目录下文件列表 |

返回当前目录下的文件列表信息
| 参数 | 类型 | 备注 |
| --- | :---: | ---|
| name | String | 文件名 |
| path | String | 文件在系统中的位置 |
| isDir | Boolean | 是否为文件夹 |
| type | String | 文件类型 |
| stat | Object | 文件的具体信息 |

> stat 返回的是 fs.stat 所有信息，具体查看：[Class: fs.Stats](https://nodejs.org/dist/latest-v11.x/docs/api/fs.html#fs_class_fs_stats)

### 打开目录

打开指定文件目录

> /api/opendir

#### 传参
- path [string] 文件路径
- name [string] 文件名

#### 示例
```javascript
// 打开 /abc/def 文件夹
fetch('/api/opendir', {
	method: 'POST',
	data: JSON.stringify({
		path: 'abc/def',
		name: 'def'
	})	
})
.then(res => res.json())
.then(res => {
	//...
})


```