### 服务器使用手册

在使用服务器时,你需要先对 `os.config.json` 文件进行配置.

| 参数     | 说明             | 示例                         |
| :----:  | :---:            | :---:                        |
| port    | 服务器端口         | 8000                        |
| db      | mongodb 数据库接口 | mongodb://localhost/iserver |

## 启动

```sh
iserver os

# 以后台方式运行(Mac/Linux)
nohup iserver os > log.log &
```