// 参考：https://github.com/koajs/send/blob/master/index.js
import fs from 'fs'
import { Context } from 'koa'
import { extname, basename, join } from 'path'

export default async function send(
  ctx: Context, 
  file: any, 
  opts: any = {}
): Promise<void> {
  // 结尾是否为 /
  // const trailingSlash: boolean = file[file.length - 1] === '/'
  const immutable = opts.immutable || false
  const maxage = opts.maxage || 0
  let encodingExt = ''

  // 解码地址，增加对英文之外的路径支持
  file = decode(file)

  if (file === -1) return ctx.throw(400, '解析失败')

  // 文件是否存在及是否为文件
  let stats
  try {
    stats = await fs.promises.stat(file)

    if (stats.isDirectory()) {
      // ctx.status = 404
      // ctx.body = 'It is directory, not a file!'
      await send(ctx, join(__dirname, '../../web/index.html'))
      return
    }
  } catch (err) {
    const notfound = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']

    if(notfound.includes(err.code)) {
      ctx.status = 403
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

function type (file: string, ext: string) {
  return ext !== '' ? extname(basename(file, ext)) : extname(file)
}

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
) {
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

function getRange(range: string): any  {
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