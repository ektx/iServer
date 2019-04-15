const fs = require('fs-extra')

/**
 * 发送文件功能
 * @param {context} ctx koa ctx
 * @param {string} file 文件地址
 * @param {object} stats 文件基础信息
 */
module.exports = async function(ctx, file, stats) {
    if (ctx.header.range) {
        const { size } = stats
        let {start, end} = getRange(ctx.header.range)
        end = end ? end : size -1

        if (start >= size || end >= size) {
            ctx.response.status = 416
            return ctx.set('Content-Range', `bytes */${size}`)
        }
        // 206 部分响应
        ctx.response.status = 206
        ctx.set('Content-Range', `bytes ${start}-${end}/${size}`)
        ctx.body = fs.createReadStream(file, {start, end})

    } else {
        ctx.set('Accept-Ranges', 'bytes')
        ctx.body = fs.createReadStream(file)
    }
}

/**
 * 返回文件起始位置
 * @param {string} ragne ctx.header.range
 * @returns {object}
 */
function getRange (ragne) {
    const obj = {}
    let match = /bytes=([0-9]*)-([0-9]*)/.exec(ragne)

    if (match) {
        if (match[1]) obj.start = Number(match[1])
        if (match[2]) obj.end = Number(match[2])
    }

    return obj
}