const os = require('os')
const macaddress = require('macaddress')

/**
 * 获取当前服务器的 IP
 * @returns 返回 IPv4 与 IPv6
 */
async function getIPs () {
  const mac = await macaddress.one()
  const ip = {}
  const ips = os.networkInterfaces()

  for (let key in ips) {
    ips[key].forEach(item => {
      if (item.mac === mac) {
        ip[item.family] = item.address
      }
    })
  }

  return ip
}

exports.getIPs = getIPs

/**
 * 是否在服务器端
 * @param {String} ip 客户端 IP 地址
 */
async function isServer (ip) {
  let isServer = false

  if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip)) {
    isServer = true
  } else {
    let ipv4 = ip.match(/\d.+/)[0]

    isServer = (await getIPs()).IPv4 === ipv4
  }

  return isServer
}

exports.isServer = isServer
