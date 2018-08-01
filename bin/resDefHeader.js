/**
 * 默认网页头设置
 * @param {string}  type 文件类型 
 */
module.exports = function resHeaders (type = 'text/plain') {
    let option = {
        // 容许跨域请求 * 表示所有,你可以指定具体的域名可以访问
        'Access-Control-Allow-Origin': '*',
        'Content-Type': `${type};charset="utf8"`,
        'x-xss-protection': '1; mode=block',
        'Server': 'workman 0.1'
    }
    let cacheType = [
        'image/jpeg',
        'image/png',
        'image/gif'
    ]

    if (cacheType.includes(type)) {
        let expires = new Date
        // 缓存 1天 24 * 60 * 60 * 1000
        expires.setTime(expires.getTime() + 86400000)

        option.Expries = expires.toUTCString()
        option['Cache-Control'] = 'max-age=86400000'
    }

    return option
}