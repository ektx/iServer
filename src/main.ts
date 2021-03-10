import fs from 'fs'
import http from 'http'
import http2 from 'http2'
import path from 'path'
import Koa from 'koa'
// import WebSocket from 'ws'
// import { watchInit } from './watch'
import routes from './route'
// import open = require('./open')
import { getIPs } from './ip'
// import IO = require('./socketIO')

const app = new Koa()

export default async function (opts: any) {
  let server = null
  let serverIP = await getIPs()
  // process.__iserverConfig = opts
  
  if (opts.https) {
    const sslOpts = {
      key: fs.readFileSync(path.join(__dirname, '../ssl/its.pem')),
      cert: fs.readFileSync(path.join(__dirname, '../ssl/its-cert.pem'))
    }

    server = http2.createSecureServer(sslOpts, app.callback())
  } else {
    server = http.createServer(app.callback())
  }

  // Socket.IO
  // const io = require('socket.io')(server)
  // IO(io)

  if (opts.watch === 2) {
    // watchInit(io)
  } else {
    // watchInit(io, 0)
  }

  app.use(async (ctx, next) => {
    console.log(900000)
    try {
      await next()
    } catch(err) {
      console.log(9999999)
      console.log('error', ctx)
    }
  })

  app.use(async (ctx, next) => {
    console.log('设置全局配制信息')
    ctx.set('ServerRoot', opts.webRoot)
    ctx.set('ServerDirname', opts.dirname)
    // ctx.$serverRoot = opts.webRoot
    await next()
    ctx.remove('ServerRoot')
    ctx.remove('ServerDirname')
  })

  app.use(routes)

  app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${rt} - ${decodeURIComponent(ctx.url)}`)
  })

  // X-Response-Time
  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
  })

  // CROS
  app.use(async (ctx, next) => {
    await next()
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Max-Age', String(86400))
    ctx.set('Access-Control-Allow-Methods', ctx.method)
  })
  
  // server info
  app.use(async ctx => {
    ctx.set('Server', `iServer ${opts.version}`)
  })

  server.listen(opts.port, async () => {
    let protocol = opts.https ? 'https' : 'http'
    let local = `${protocol}://localhost:${opts.port}`
    let network = `${protocol}://${serverIP.IPv4}:${opts.port}`
    
    console.log(`\niServer v${opts.version}`)
    console.log(`Server Running at:\n`)
    console.log(`  - Local:   ${local}`)
    console.log(`  - Network: ${network}`)

    if (opts.browser) open(local, opts.browser)
  })

  server.on('error', err => {
    console.log('❌', err)
  })
}