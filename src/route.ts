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

export default router.routes()