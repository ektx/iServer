import { networkInterfaces } from 'os'
import macaddress from 'macaddress'

/**
 * 获取当前服务器的 IP
 * @returns 返回 IPv4 与 IPv6
 */
function getIPs(): Promise<{IPv4?: string, IPv6?: string}> {
  return new Promise(async (resolve) => {
    const mac = await macaddress.one()
    const ip = {}
    const ips = networkInterfaces()
  
    for (let key in ips) {
      ips[key].forEach(item => {
        if (item.mac === mac) {
          (<any>ip)[item.family] = item.address
        }
      })
    }
  
    resolve(ip)
  })
}

async function isServer(ip: string) {
  let result = false

  if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip)) {
    result = true
  } else {
    let ipv4 = (<any>ip).match(/\d.+/)[0]
    let ips = await getIPs()

    result = ips.IPv4 === ipv4
  }

  return result
}

export {
  getIPs,
  isServer
}