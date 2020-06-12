const fs = require('fs-extra')
const path = require('path')
const Router = require('koa-router')
const koaBody = require('koa-body')
const send = require('./send')
const opendir = require('./toOpenPath')
const { getClientIP, getIPs } = require('./getIPs')
const { watchAdd } = require('./watch')

const router = new Router()

router
    .get('/favicon.ico', async (ctx, next) => {
        await next()
    })
    .get('/', async (ctx, next) => {
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
    // 获取文件夹下文件列表
    .get('/api/filelist', async (ctx, next) => {
        ctx.$next = true
        await next()
        let { __directory } = process.__iserverConfig
        let file = path.join(__directory, ctx.query.path)
        
        await send(ctx, file)
        watchAdd(file)
    })
    // 打开对应文件的文件夹
    .get('/api/opendir', async (ctx, next) => {
        ctx.$next = true
        await next()

        let { __directory } = process.__iserverConfig
        let { path: _p } = ctx.query.path
        let file = _p ? _p : __directory

        await opendir(ctx, file)
    })
    .get('/api/isServer', async (ctx, next) => {
        ctx.$next = true
        await next()
        ctx.body = (await getClientIP(ctx)).isServer
    })
    .get('/api/serverip', async (ctx, next) => {
        ctx.$next = true
        await next()
        ctx.body = (await getIPs())
    })
    .get('*', getAllFile)
    .post('/upload', koaBody({
        formidable: {
            //设置文件的默认保存目录，不设置则保存在系统临时目录下  os
            uploadDir: path.resolve(__dirname, '../tem')
        },
        multipart: true // 开启文件上传，默认是关闭
    }), ctx => {
        // 多文件上传
        let files = ctx.request.files.file 
        let result = []

        files && files.forEach(item => {
            console.log(files)
            let {path: address, name} = item


            if (item.size > 0 && address) {
                let extname = path.extname(name)
                let nextPath = address + extname
                console.log(address, extname, nextPath)

                fs.renameSync(address, nextPath)

                result.push(nextPath)
            }
        })

        ctx.body = JSON.stringify(result)
    })

/**
 * 获取通用文件请求
 * @param {*} ctx 
 * @param {*} next 
 */
async function getAllFile (ctx, next) {
    await next()
    if (!ctx.$next) {
        let { __directory } = process.__iserverConfig
        let file = path.join(__directory, ctx.path)
        
        await send(ctx, file, {from: '*'})
    }
}
module.exports = router.routes()
