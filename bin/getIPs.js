
const os = require('os')

function getIPs () {
	let ipv4s = {};
	let ipv6s = [];
	let ifaces = os.networkInterfaces();

	for (let i in ifaces) {
		for (let ii in ifaces[i]) {
			let ip = ifaces[i][ii]

			if (ip.family === 'IPv4') {

				if (ip.address !== '127.0.0.1') {
					// 公网 IP
					ipv4s.public = ip.address;
				}

				// 私有 IP
				ipv4s.self =  '127.0.0.1';

			} else {
				ipv6s.push(ip.address)
			}
		}
	}

	return {
		IPv4 : ipv4s,
		IPv6 : ipv6s
	}
}

exports.getIPs = getIPs;

/*
	得到客户端 IP
	--------------------------
*/
function getClientIP (req) {

	let isServer = false;
	let ip = req.headers['x-forwarded-for'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress;

	if (['::ffff:127.0.0.1', '127.0.0.1','::1'].includes(ip))
		isServer = true
	else {
		ip = ip.match(/\d.+/)[0]; 
		isServer = getIPs().IPv4.public === ip;
	}

	return {
		ip: ip,
		isServer: isServer // 是否请求来自服务器
	}
}
exports.getClientIP = getClientIP;