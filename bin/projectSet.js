/*
	项目操作模块
	-------------------------------
	存放对项目操作的js
*/

const Schemas = require('./schemas');

/*
	更新项目信息
	-----------------------------
	DEMO:
	ProSet.UpDataProInfo({
		filter: {usr: user, name: name},
		set: {
			utime: new Date().toISOString()
		},
		callback: callback(err, data)
	})

	@filter [object]  eg: {usr: user, name: name}
	@setObj [object] er: $set: { utime: new Date().toISOString()}
*/
function UpDataProInfo(options) {
	Schemas.project_m.update(
		options.filter,
		{ $set: options.set },
		(err, data) => {
			if (options.callback) options.callback(err, data)
		}
	)
}

exports.UpDataProInfo = UpDataProInfo;

/*
	查询用户项目信息
	----------------------------------------
	DEMO:


	options:
	@key [object] 查询字段
	@filter [object] 过滤内容
	@help [object] 辅助信息
*/
function FindUsrProjects(options) {

	let filter = options.filter || {};
	let help = options.help || {};

	Schemas.project_m.find(
		options.key,
		filter,
		help,
		(err, data)=> {
			if (options.callback) options.callback(err, data)
		}
	)
}

exports.FindUsrProjects = FindUsrProjects;