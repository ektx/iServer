// V8
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()
const send = require('./send')
const opendir = require('./toOpenPath')
const { getClientIP } = require('./getIPs')

router
    .get('/favicon.ico', async (ctx, next) => {
        return next()
    })
    .get('/', async ctx => {
        // TODO: 让主页面可配制化
        await send(ctx, path.join(__dirname, '../web/index.html'))
    })
    .get('/@/*', async ctx => {
        let file = path.join(__dirname, ctx.path.replace('/@', '../web'))
        await send(ctx, file)
    })
    .get('/api/getFileList', async ctx => {
        let file = path.join(process.cwd(), ctx.query.path)
        await send(ctx, file)
    })
    .get('/api/opendir', async ctx => {
        let file = ctx.query.path ? ctx.query.path : process.cwd()
        await opendir(ctx, file)
    })
    .get('/api/isServer', async ctx => {
        ctx.body = (await getClientIP(ctx)).isServer
    })
    .get('*', async ctx => {
        let file = path.join(process.cwd(), ctx.path)
        await send(ctx, file, {from: '*'})
    })

// app.get('/get-iserver-ip', r.serverIP)
// app.get('/server/*', r.server)
// app.get('/@/*', r.getWeb)
// app.get('/iproxy-url=*', r.iproxy)

// app.post('/server/zipfile', r.tool_zipdownload )
// app.post('/iproxy-url=*', r.iproxy)

// app.post('*', r.postAll)
// app.get('*', r.getAll)

module.exports = router.routes()
