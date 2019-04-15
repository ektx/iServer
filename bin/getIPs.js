const os = require('os')
const macaddress = require('macaddress')

async function getMacAdd () {
	return new Promise((resolve, reject) => {
		macaddress.one((err, mac) => {
			if (err) {
				reject(err)
				return
			}
			resolve(mac)
		})
	})
}

/**
 * 获取当前服务器的 IP
 * @returns 返回 IPv4 与 IPv6
 */
async function getIPs () {
	const mac = await getMacAdd()
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
 * 得到客户端 IP
 * @param {Context} ctx koa context
 */
async function getClientIP (ctx) {
	let isServer = false
	let ip = ctx.request.ip

	if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip))
		isServer = true
	else {
		ip = ip.match(/\d.+/)[0]; 
		isServer = await getIPs().IPv4 === ip
	}

	return {
		ip,
		isServer // 是否请求来自服务器
	}
}

exports.getClientIP = getClientIP
