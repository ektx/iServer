import { Context, Next } from 'koa'
import { join } from 'path'
import fs from 'fs'
import send from '../send'
import { isSafePath, type } from '../utils'
import { isServer } from '../ip'

interface Query {
  path: string
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

  if (isSafePath(ctx, path)) {
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

/**
 * 获取是否在服务器上运行客户端
 * @param ctx Context
 * @param next Next
 */
export async function isOnServer(ctx: Context, next: Next) {
  await next();

  ctx.body = {
    status: 'success',
    data: await isServer(ctx.request.ip)
  }
}

/**
 * 打开指定的文件地址  
 * /api/open?path=(/readme.md || /)
 */
export async function openPath(ctx: Context, next: Next) {
  await next();

  if (isSafePath(ctx, ctx.query.path)) {
    ctx.body = 'ready to open'
  } else {
    ctx.body = {
      status: 'success',
      data: '',
      mes: `非法地址: ${ctx.query.path}`
    }
  }
}