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

async function getIPs () {
	let mac = await getMacAdd()

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

exports.server = getIPs

/*
	得到客户端 IP
	--------------------------
*/
async function getClientIP (req) {

	let isServer = false;
	let ip = req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;

	if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip))
		isServer = true
	else {
		ip = ip.match(/\d.+/)[0]; 
		isServer = await getIPs().IPv4 === ip;
	}

	return {
		ip,
		isServer // 是否请求来自服务器
	}
}

exports.getClientIP = getClientIP;
