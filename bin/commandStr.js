var args = process.argv.splice(2)
var comString = args.join('')


// 把命令行的内容换成JSON之后，返回出去
exports.commandStr = function() {

	var result = {};

	for (var i of args) {

		var name = i.split(':')[0].replace(/-/g, '');
		var inner = i.split(':')[1] || true;

		// 格式化输出
		switch (name) {
			case 'p':
				name = 'port';
				break;

			case 'b':
				name = 'browser';
				break;

			case 'h':
				name = 'help';
				break;
		}

		// 对空命令不添加,eg: -h - - - 
		// => {help:true}
		if (name)
			result[name] = inner;
	}

	return result;	
}


/*
	帮助信息
	----------------------------------
*/
exports.printHelp = function () {
	var Hstr = 'Usage: node epp.js [ -p port] [...]\n\n';
	Hstr += 'Options\n';
	Hstr += '-p, -port       iserver 端口号\n';
	Hstr += '-v, -version    iServer 版本信息\n';

	console.log(Hstr)
}