// import fs from 'fs'
// import path from 'path'
import Router from '@koa/router'
import { Context } from 'koa'
// import koaBody from 'koa-body'

const router = new Router()

router
  .get('/', async (ctx: Context): Promise<void> => {
    ctx.body = 'hello ts'
  })

export default router.routes()