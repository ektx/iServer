// V8
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()
const send = require('./send')

router
    .get('/favicon.ico', async (ctx, next) => {
        return next()
    })
    .get('/', async (ctx, next) => {
        await next()
        // TODO: 让主页面可配制化
        await send(ctx, path.join(process.cwd(), './web/index.html'))
    })
    .get('/@/*', async (ctx, next) => {
        await next()
        ctx.path = decode(ctx.path)
        
        let file = path.join(process.cwd(), ctx.path.replace('/@', './web'))
        await send(ctx, file)
    })
    .get('/api/*', async (ctx, next) => {
        await next()
        ctx.path = decode(ctx.path)
        // console.log(1, ctx.path)
        let file = path.join(process.cwd(), ctx.path.slice(4))
        // console.log(2, file)
        await send(ctx, file)

    })
    .get('*', async (ctx, next) => {
        await next()
        ctx.path = decode(ctx.path)
    })

// app.get('/get-iserver-ip', r.serverIP)
// app.get('/server/*', r.server)
// app.get('/@/*', r.getWeb)
// app.get('/iproxy-url=*', r.iproxy)

// app.post('/api/opendir', toOpenPath)
// app.post('/server/zipfile', r.tool_zipdownload )
// app.post('/iproxy-url=*', r.iproxy)

// app.post('*', r.postAll)
// app.get('*', r.getAll)

module.exports = router.routes()

function decode (path) {
    try {
        return decodeURIComponent(path)
    } catch (err) {
        return -1
    }
}