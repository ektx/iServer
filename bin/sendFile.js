
const fs = require('fs')
const mime = require('mime')
const statAsync = require('./statAsync')
const resDefHeader = require('./resDefHeader')

mime.define({
    'text/vue': ['vue', 'VUE']
})

/**
 * 发送文件功能
 * @param {string} filePath 绝对文件地址
 * @param {object} req 请求信息
 * @param {object} res 返回信息
 */
module.exports = async function(filePath, req, res) {
    let fileInfo = await statAsync(filePath)
    let fileType = mime.getType(filePath)

    if (!fileType) {
        fileType = 'text/plain'
    }

    if (req.headers['range']) {
        let {stats} = fileInfo
        let {size: total} = stats
        let range = req.headers.range
        let parts = range.replace(/bytes=/, '').split('-')
        let partialStart = parts[0]
        let partialEnd = parts[1]
        let start = parseInt(partialStart, 10)
        let end = partialEnd ? parseInt(partialEnd, 10) : total -1
        let chunkSize = (end - start) + 1

        console.log(`RANGE: ${start} - ${end} = ${chunkSize}`)

        res.setHeader('Content-Type', fileType)

        if (parts) {
            res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`)
            res.setHeader('Content-Length', chunkSize)
            res.writeHead('206', 'Partial Content')

            let stream = fs.createReadStream(filePath, { start, end })
            stream.pipe(res)
        } else {
            res.removeHeader('Content-Length')
            res.status(416).send('Request Range Not Satisfiable')
        }
    } else {
        let webHeaderOption = resDefHeader(fileType)
        let stream = fs.createReadStream(filePath)

        stream.on('error', function () {
            res.status(505).send('Server Error!')
        })

        res.set(webHeaderOption)
        stream.pipe(res)
    }
}
