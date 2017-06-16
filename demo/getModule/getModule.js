/*
	目标: 获取 ejs 或 pug 中调用的所有模板
*/

const fs = require('fs');
const path = require('path');

function getModule(filePath) {
	
	let result = [];

	let getUrlPath = (includePath) => {
		console.log( includePath );

		let includeModuleName = includePath.match(/\('(.+)'/)[1];
		let includeModuleData = includePath.match(/(\{.+\})/);

		if (includeModuleData) includeModuleData = includeModuleData[1];

		result.push( includeModuleName );

		return {
			name: includeModuleName,
			data: includeModuleData
		}
	}

	let getModulesArr = (thisFilePath) => {

		fs.readFile(thisFilePath, 'utf8', (err, data) => {
			if (err) throw err;

			let moduleArr = data.match(/<%-\sinclude\('(.+)\)\s%>/g);

			for (let i = 0, l = moduleArr.length; i < l; i++) {
				console.log( getUrlPath( moduleArr[i] ) )
			}

			console.log( result );
		})
		
	}

	getModulesArr( filePath );

}

module.exports = getModule;