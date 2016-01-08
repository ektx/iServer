var args = process.argv.splice(2)
var comString = args.join()

exports.commandStr = function() {

	var result = false;

	// 帮助信息
	if (/h|help/i.test(comString)) {
		printHelp('h');
		result = false;

	} 
	// 版本信息
	else if (/v|version/i.test(comString)) {
		result = 'getVersion'

	} 
	// 其它非特定
	else  {
		// 端口号
		if (/p|port/i.test(comString)) {
			var port = comString.match(/(p|port),(\w+)/)[2];
			result = {
				port: port
			}
		}
	}

	return result;	
}


/*
	帮助信息
	----------------------------------
*/
function printHelp(type) {
	if (type == 'h') {

		var Hstr = 'Usage: node epp.js [ -p port] [...]\n\n';
		Hstr += 'Options\n';
		Hstr += '-p, -port       iserver 端口号\n';
		Hstr += '-v, -version    iServer 版本信息\n';

		console.log(Hstr)
	}
}