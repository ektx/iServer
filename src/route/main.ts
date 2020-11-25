import { Context, Next } from 'koa'
import { join } from 'path'
import fs from 'fs'
import send from '../send'
import { type } from '../utils'

interface Query {
  path: string
}

/**
 * 返回是否为安全路径
 */ 
function isSafePath (ctx: Context, path: string): boolean {
  let root = ctx.response.get('ServerRoot')

  return path.startsWith(root)
}

/**
 * 获取指定目录的文件列表  
 * eg:/api/files?path=/
 */
export async function getFileList(ctx: Context, next: Next): Promise<void> {
  await next()
  let root = ctx.response.get('ServerRoot')
  let { path }: Query = ctx.query
  
  path = join(root, path)
  let files = await fs.promises.readdir(path)

  if (path.startsWith(root)) {
    let list = files.map(async file => {
      let _path = join(path, file)
      let stat = await fs.promises.stat(_path)
      return {
        name: file,
        path: _path,
        size: stat.size,
        isDir: stat.isDirectory(),
        extname: type(_path, '')
      }
    })
    ctx.status = 200
    ctx.body = await Promise.all(list)
  } else {
    ctx.status = 403
    ctx.body = '无权访问：'+ ctx.query.path
  }
}

/**
 * 返回指定静态文件
 */
export async function getFile (ctx: Context, next: Next): Promise<void> {
  await next()
  let root = ctx.response.get('ServerRoot')
  let { path }: Query = ctx.query

  path = join(root, path)

  isSafePath(ctx, path) && await send(ctx, path)
}