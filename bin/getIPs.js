
var os = require('os')


module.exports = getIPs;

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

