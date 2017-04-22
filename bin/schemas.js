const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
	用户信息
	======================================
	@account: 帐号(不可修改)
	@name: 用户名
	@pwd: 密码
	@email: 邮箱
	@ico: 头像
	@power: 用户权限
	@reset: 找回密码Code

	文档: usrs
*/
const _usrs = new Schema({
	account: String,
	name   : String,
	pwd	   : String,
	email  : String,
	ico	   : String,
	power  : String,
	reset  : String
}, {collection: 'usrs', versionKey: false});

exports.usrs_m = mongoose.model('usrs', _usrs);


/*
	用户项目[old]
	---------------------------------------
	未来项目不在使用此方式保存 [不使用]

	文档: myproject
*/
const _myproject_project = new Schema({
	name: String,
	ctime: String,
	utime: String,
	private: Boolean
}, {_id: false});

const _myproject = new Schema({
	usr: String,
	project: [_myproject_project]
}, { collection: 'myproject', versionKey: false});

exports.myproject_m = mongoose.model('myproject', _myproject);


/*
	项目[new]
	---------------------------------------
	未来项目将采用此保存
	@usr: 用户
	@name: 项目名称
	@ctime: 创建时间
	@utime: 更新时间
	@private: 隐私
	@type: 类型(为normal|git)
	@url: git项目时的克隆地址

	文档: project
*/
const _project = new Schema({
	usr: String,
	name: String,
	ctime: String,
	utime: String,
	private: Boolean,
	type: String,
	url: String
}, { collection: 'project', versionKey: false});
exports.project_m = mongoose.model('project', _project);


/*
	SMTP 邮件服务器
	---------------------------------------


	文档: myproject
*/
const _server_SMTP = new Schema({
	host: String,
	port: Number,
	usr: String,
	pwd: String
}, {collection: 'SMTP', versionKey: false});

exports.SMTP_m = mongoose.model('SMTP', _server_SMTP);
