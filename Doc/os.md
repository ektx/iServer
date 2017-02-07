### 服务器使用手册

在使用服务器时,你需要先对 `os.config.json` 文件进行配置.

| 参数     | 说明                | 示例                         |
| :----:  | :---:               | :---:                       |
| port    | 服务器端口(必填)      | 8000                        |
| http    | 辅助 http 服务器端口  | 8000                        |
| https   | 辅助 https 服务器端口 | 8000                        |
| db      | mongodb 数据库接口   | mongodb://localhost/iserver |

## 启动

```sh
iserver os

# 以后台方式运行(Mac/Linux)
nohup iserver os > log.log &
```