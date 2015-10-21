
var os = require('os')


module.exports = getIPs;

function getIPs () {
	var ipv4s = [];
	var ipv6s = [];
	var ifaces = os.networkInterfaces();

	for (var i in ifaces) {
		// console.log(ifaces[i])
		for (var ii in ifaces[i]) {
			var ip = ifaces[i][ii]
			// console.log(ip)
			if (ip.family === 'IPv4') {
				ipv4s.push(ip.address)
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

