/*
	目标: 获取 ejs 或 pug 中调用的所有模板
	----------------------------------
	v0.0.1
*/

const fs = require('fs');
const path = require('path');

function getModule(filePath, sync ) {
	
	let result = [];

	let getUrlPath = (thisFilePath, includePath) => {

		let includeModuleName = includePath.match(/\('(.+)'/)[1];
		let includeModuleData = includePath.match(/(\{.+\})/);

		if (includeModuleData) includeModuleData = includeModuleData[1];

		result.push( path.join(path.dirname(thisFilePath), includeModuleName + '.ejs') );

		return {
			name: includeModuleName,
			data: includeModuleData
		}
	}

	let doWithData = (filePath, data) => {

		let moduleArr = data.match(/<%-\sinclude\('(.+)\)\s%>/g);

		if (moduleArr && moduleArr.length > 0) {

			for (let i = 0, l = moduleArr.length; i < l; i++) {
				getUrlPath(filePath, moduleArr[i] )
			}

		}
	}

	let getModulesArr = (thisFilePath) => {

		fs.readFile(thisFilePath, 'utf8', (err, data) => {
			if (err) throw err;

			doWithData(thisFilePath, data )
		})
		
	}

	let getModulesArrSync = (thisFilePath) => {

		try {

			let _data = fs.readFileSync(thisFilePath, 'utf8')

			doWithData(thisFilePath, _data )

		} catch (err) {
			console.log(err)
		}
		
	}

	if (sync) {
		getModulesArrSync( filePath );

		return result
	} else {
		getModulesArr( filePath );
	}

}

module.exports = getModule;