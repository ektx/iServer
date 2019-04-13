// V8 https://github.com/koajs/send/blob/master/index.js
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const sendFile = require('./sendFile')
const { basename, extname } = require('path')

module.exports = send

async function send (ctx, file, opts = {}) {
    assert(ctx, 'koa context required')
    assert(file, 'file pathname required')

    // Try to serve the brotli version of a file automatically 
    // when brotli is supported by a client and 
    // if the requested file with .br extension exists (note, that brotli is only accepted over https). defaults to true.
    const brotli = opts.brotli !== false
    // extensions Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to false)
    const extensions = Array.isArray(opts.extensions) ? opts.extensions : false
    const format = opts.format !== false
    const index = opts.index
    const immutable = opts.immutable || false
    const maxage = opts.maxage || 0

    if (file === -1) return ctx.throw(400, 'failed to decode')

    let encodingExt = ''
    if (
        ctx.acceptsEncodings('br', 'identity') === 'br' && 
        brotli &&
        (await fs.exists(file + '.br'))
    ) {
        file += '.br'
        ctx.set('Content-Encoding', 'br')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.br'
    } else if (
        ctx.acceptsEncodings('gzip', 'identity') === 'gizp' &&
        gzip &&
        (await fs.exists(file + '.gz'))
    ) {
        file += '.gz'
        ctx.set('Content-Encoding', 'gzip')
        ctx.res.removeHeader('Content-Length')
        encodingExt = '.gz'
    }

    // console.log('encodingExt:', encodingExt)
    // console.log('extensions:', extensions)
    // 以扩展名来获取指定文件
    if (extensions && !/\.[^/]*$/.exec(file)) {
        const list = [...extensions]

        for (let i = 0; i < list.length; i++) {
            let ext = list[i]
            if (typeof ext !== 'string') {
                throw new TypeError('option extensions must be array of strings or false')
            }

            if (!/^\./.exec(ext)) ext = '.' + ext
            
            // 判断文件是否存在 
            if (await fs.exists(file + ext)) {
                file += ext
                break
            }
        }
    }

    let stats
    try {
        stats = await fs.stat(file)

        if (stats.isDirectory()) {
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
        if (immutable) {
            directives.push('immutable')
        }
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
