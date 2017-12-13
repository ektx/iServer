
const fs = require('fs')
const path = require('path')

module.exports = function (filePath, data) {
	return new Promise( (resolve, reject) => {
		fs.writeFile(filePath, data, {encodeing: 'utf8'}, (err, status) => {
			if (err) {
				reject(err);
				return
			}

			resolve(status)
		})
	})
}