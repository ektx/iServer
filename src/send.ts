// 参考：https://github.com/koajs/send/blob/master/index.js
import fs from 'fs'
import { Context } from 'koa'
import { join } from 'path'
import { type } from './utils'

interface Options {
  immutable?: boolean,
  maxage?: number
}
/**
 * 发送指定的文件
 * @param ctx 上下文
 * @param file 文件地址
 * @param opts 配制选择
 */
export default async function send(
  ctx: Context, 
  file: any, 
  opts: Options = {}
): Promise<void> {
  const immutable = opts.immutable || false
  const maxage = opts.maxage || 0
  let encodingExt = ''

  // 解码地址，增加对英文之外的路径支持
  file = decode(file)

  if (file === -1) return ctx.throw(400, '解析失败')

  // 文件是否存在及是否为文件
  let stats: fs.Stats
  try {
    stats = await fs.promises.stat(file)

    if (stats.isDirectory()) {
      // 是目前就发送默认页面给客户端
      await send(ctx, join(__dirname, '../../web/index.html'))
      return
    }
  } catch (err) {
    const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']

    if(notfound.includes(err.code)) {
      ctx.status = 404
      ctx.body = `404\n${err}`
      return
    }

    err.status = 500
    throw err
  }

  // steam
  ctx.set('Content-Length', String(stats.size))
  if (!ctx.response.get('Last-Modified')) 
    ctx.set('Last-Modified', stats.mtime.toUTCString())
  if (!ctx.response.get('Cache-Control')) {
    const directives = [`max-age=${(maxage / 1000 | 0)}`]
    if (immutable) {
      directives.push('immutable')
    }
    ctx.set('Cache-Control', directives.join(','))
  }

  if (!ctx.type) ctx.type = type(file, encodingExt)

  sendRangeFile(ctx, file, stats)
} 

/**
 * 解码 url 地址
 * @param path url地址
 */
function decode(path: string): string | number {
  try {
    return decodeURIComponent(path)
  } catch(err) {
    return -1
  }
}

function sendRangeFile(
  ctx: Context, 
  file: string,
  stats: fs.Stats
): void {
  if (ctx.header.range) {
    const { size } = stats
    let {start, end} = getRange(ctx.header.range)
    end = end ? end : size -1

    if (start >= size || end >= size) {
      ctx.status = 416
      return ctx.set('Content-Range', `bytes */${size}`)
    }
    // 206 部分响应
    ctx.status = 206
    ctx.set('Content-Range', `bytes ${start}-${end}/${size}`)
    ctx.body = fs.createReadStream(file, {start, end})
  } else {
    ctx.set('Accept-Ranges', 'bytes')
    ctx.body = fs.createReadStream(file)
  }
}

interface RangeObj {
  start: number;
  end: number;
}

/**
 * 获取起止位置
 * @param range 
 */
function getRange(range: string): RangeObj  {
  let obj: RangeObj = {
    start: 0,
    end: 0
  }

  let match = /bytes=([0-9]*)-([0-9]*)/.exec(range)

  if (match) {
    if (match[1]) obj.start = Number(match[1])
    if (match[2]) obj.end = Number(match[2])
  }

  return obj
}