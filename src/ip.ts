import { networkInterfaces } from 'os'
import macaddress from 'macaddress'

/**
 * 获取当前服务器的 IP
 * @returns 返回 IPv4 与 IPv6
 */
async function getIPS() {
  const mac = await macaddress.one()
  const ip = {}
  const ips = networkInterfaces()

  for (let key in ips) {
    ips[key].forEach(item => {
      if (item.mac === mac) {
        ip[item.family] = item.address
      }
    })
  }

  return ip
}

async function isServer(ip: string) {
  let result = false

  if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip)) {
    result = true
  } else {
    let ipv4 = ip.match(/\d.+/)[0]

    result = (<any>(await getIPS())).IPv4 === ipv4
  }

  return result
}

export {
  getIPS,
  isServer
}