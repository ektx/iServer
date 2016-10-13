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

	文档: usrs
*/
const _usrs = new Schema({
	account: String,
	name   : String,
	pwd	   : String,
	email  : String,
	ico	   : String,
	power  : String
}, {collection: 'usrs', versionKey: false});

exports.usrs_m = mongoose.model('usrs', _usrs);


/*
	用户项目
	---------------------------------------


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
