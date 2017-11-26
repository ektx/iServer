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