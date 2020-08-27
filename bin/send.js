const fs = require('fs-extra')
const path = require('path')
const sendFile = require('./sendFile')
const { basename, extname, join } = require('path')

async function send (ctx, file, opts = {}) {
    // 解码地址，增加对英文之外的路径支持
    file = decodeURIComponent(file)

    // Try to serve the brotli version of a file automatically 
    // when brotli is supported by a client and 
    // if the requested file with .br extension exists (note, that brotli is only accepted over https). defaults to true.
    // const brotli = opts.brotli !== false
    const immutable = opts.immutable || false
    const maxage = opts.maxage || 0

    ctx.path = decode(ctx.path)

    if (file === -1) return ctx.throw(400, 'failed to decode')

    let encodingExt = ''
    if (
        ctx.acceptsEncodings('br', 'identity') === 'br' && 
        // brotli &&
        (await fs.exists(file + '.br'))
    ) {
        file += '.br'
        ctx.set('Content-Encoding', 'br')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.br'
    } else if (
        ctx.acceptsEncodings('gzip', 'identity') === 'gzip' &&
        (await fs.exists(file + '.gz'))
    ) {
        file += '.gz'
        ctx.set('Content-Encoding', 'gzip')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.gz'
    }

    let stats
    try {
        stats = await fs.stat(file)

        if (stats.isDirectory()) {
            // 在访问非根路径(eg:localhost:8080/abc)时
            if (opts.from && opts.from === '*') {
                // 先返回 SPA 主页面
                await send(ctx, path.join(__dirname, '../web/index.html'))
                return
            }

            let fileList = await fs.readdir(file)

            fileList = fileList.map(async val => {
                let filePath = path.join(file, val)
                let stat = await fs.stat(filePath)
                return {
                    name: val,
                    path: filePath,
                    stat,
                    isDir: stat.isDirectory(),
                    type: type(filePath)
                }
            })

            ctx.body = await Promise.all(fileList)

            return
        }
    } catch (err) {
        if (['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(err.code)) {
            ctx.status = 404
            ctx.body = `400 \n${err}`
            return
        }

        err.status = 500
        throw err
    }

    // steam
    ctx.set('Content-Length', stats.size)
    if (!ctx.response.get('Last-Modified'))
        ctx.set('Last-Modified', stats.mtime.toUTCString())
    if (!ctx.response.get('Cache-Control')) {
        const directives = ['max-age=' + (maxage / 1000 | 0)]

        if (immutable) directives.push('immutable')

        ctx.set('Cache-Control', directives.join(','))
    }

    // set Content-Type
    ctx.type = type(file, encodingExt)

    sendFile(ctx, file, stats)
}

/**
 * file type
 */
function type (file, ext) {
    return ext !== '' ? extname(basename(file, ext)) : extname(file)
}

function decode (path) {
    try {
        return decodeURIComponent(path)
    } catch (err) {
        return -1
    }
}

module.exports = send
