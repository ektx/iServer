var args = process.argv.splice(2)
var comString = args.join()

exports.commandStr = function(str, def) {

	var result = def;

	str.forEach(function(val, i) {

		var regExp = new RegExp('--'+val+':\\w+(?=,?)', 'i')

		var matStr = comString.match(regExp)
		result = matStr == null ? result : matStr[0].split(':')[1]

	})

	return result	
}
