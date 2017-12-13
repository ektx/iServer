# API

### 目录请求

请求指定目录，返回目录信息

> /api/your_ask_path

```javascript
// 请求根目录
// http://localhost:9000/

{
	server: true, // true 表示访问终端与服务器是同一台设备
	data: [
		{
			file: 'workman', // 名称
			isDir: true,     // 表示是文件夹
			path: '/Sites/workman', // 服务器上绝对路径
			stats: {} 				// 文件的相关信息
		}
	]
}
```


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