// import fs from 'fs'
// import path from 'path'
import Router from '@koa/router'
import { Context } from 'koa'
// import koaBody from 'koa-body'
import send from './send'
import { join } from 'path'

const router = new Router()

router
  .get('/', async (ctx: Context, next): Promise<void> => {
    await next()
    await send(ctx, join(__dirname, '../../web/index.html'))
  })
  .get('(.*)', async (ctx, next) => {
    let file: string = ''
    await next()
    
    // 访问服务器上的系统资源
    if (ctx.path.startsWith('/@/')) {
      file = ctx.path.replace('/@', '../../web')
      await send(ctx, join(__dirname, file))
    } 
    // 访问服务启动处文件
    else {
      let root = ctx.response.get('ServerRoot')
      await send(ctx, join(root, '../', ctx.path))
    }
  })

export default router.routes()