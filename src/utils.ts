import { extname, basename } from 'path'
import { Context } from 'koa'

export function type (file: string, ext: string): string {
  return ext !== '' ? extname(basename(file, ext)) : extname(file)
}

/**
 * 返回是否为安全路径
 */ 
export function isSafePath (ctx: Context, path: string): boolean {
  let root = ctx.response.get('ServerRoot')

  return path.startsWith(root)
}