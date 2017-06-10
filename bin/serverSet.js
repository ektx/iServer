const main = require('./main');
const osInfo = require('../os.config').os;

function getServerSet(options) {

	if (options.type === 'os') {

		osInfo.type = 'os';
		osInfo.version = options.version;

		main(osInfo)

	} else {
		main(options)
	}

}

module.exports = getServerSet