/* 
	获取JSON
	-------------------------------------
	去除JSON中的注释 
*/
function getJSONNote (dataPath) {
	var JSONInner = {};

	try {

		JSONInner = fs.readFileSync(dataPath, 'utf8')
		// 去注释和压缩空格
		JSONInner = JSONInner.replace(/(\/{2}.+)|\s/g, '')

	} catch (err) {
		console.log('无法找到配置文件 ' + dataPath)
	}

	JSONInner = JSON.parse(JSONInner);

	return JSONInner
}

module.exports = getJSONNote;