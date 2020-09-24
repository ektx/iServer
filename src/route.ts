// import fs from 'fs'
// import path from 'path'
import Router from '@koa/router'
// import koaBody from 'koa-body'

const router = new Router()

router
  .get('/', async (ctx: any) => {
    ctx.body = 'hello ts'
  })

export default router.routes()