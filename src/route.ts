// import fs from 'fs'
// import path from 'path'
import Router from '@koa/router'
import { Context } from 'koa'
// import koaBody from 'koa-body'
import send from './send'
import { join, relative } from 'path'

const router = new Router()

router
  .get('/', async (ctx: Context, next): Promise<void> => {
    await next()
    await send(ctx, join(__dirname, '../../web/index.html'))
  })
  .get('(.*)', async (ctx, next) => {
    let root = ctx.response.get('ServerRoot')
    let dirname = ctx.response.get('ServerDirname')
    let file = ''
    await next()
    
    // 访问服务器上的系统资源
    if (ctx.path.startsWith('/@/')) {
      file = ctx.path.replace('/@', '../../web')
      file = join(__dirname, file)

      // 处理非法路径访问
      if (file.startsWith(dirname)) {
        await send(ctx, file)
      } else {
        ctx.status = 403
        ctx.body = '无法访问'
      }
    } 
    // 访问服务启动处文件
    else {
      await send(ctx, join(root, '../', ctx.path))
    }
  })

export default router.routes()