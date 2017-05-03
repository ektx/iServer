
var os = require('os')



function getIPs () {
	var ipv4s = {};
	var ipv6s = [];
	var ifaces = os.networkInterfaces();

	for (var i in ifaces) {
		for (var ii in ifaces[i]) {
			var ip = ifaces[i][ii]

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

	ip = ip.match(/\d.+/)[0];

	if (ip !== '127.0.0.1')
		isServer = getIPs().IPv4.public === ip ? true : false;
	else
		isServer = true

	return {
		ip: ip,
		isServer: isServer // 是否请求来自服务器
	}
}
exports.getClientIP = getClientIP;