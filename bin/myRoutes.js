const Router = require('koa-router')
const path = require('path')
const router = new Router()
const send = require('./send')
const opendir = require('./toOpenPath')
const { getClientIP } = require('./getIPs')

router
    .get('/favicon.ico', async (ctx, next) => {
        await next()
    })
    .get('/', async (ctx, next) => {
        // TODO: 让主页面可配制化
        ctx.$next = true
        await next()
        await send(ctx, path.join(__dirname, '../web/index.html'))
    })
    .get('/@/*', async (ctx, next) => {
        ctx.$next = true
        await next()
        let file = path.join(__dirname, ctx.path.replace('/@', '../web'))
        await send(ctx, file)
    })
    .get('/api/getFileList', async (ctx, next) => {
        ctx.$next = true
        await next()
        let file = path.join(process.cwd(), ctx.query.path)
        await send(ctx, file)
    })
    .get('/api/opendir', async (ctx, next) => {
        ctx.$next = true
        await next()
        let file = ctx.query.path ? ctx.query.path : process.cwd()
        await opendir(ctx, file)
    })
    .get('/api/isServer', async (ctx, next) => {
        ctx.$next = true
        await next()
        ctx.body = (await getClientIP(ctx)).isServer
    })
    .get('*', async (ctx, next) => {
        if (ctx.$next) {
            await next()
        } else {
            await next()
            let file = path.join(process.cwd(), ctx.path)
            await send(ctx, file, {from: '*'})
        }
    })

module.exports = router.routes()
