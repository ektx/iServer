const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
	用户信息
	======================================
	@account: 帐号(不可修改)
	@name: 用户名
	@pwd: 密码
	@ico: 头像

	文档: usrs
*/
const _usrs = new Schema({
	account: String,
	name   : String,
	pwd	   : String,
	email  : String,
	ico	   : String
}, {collection: 'usrs', versionKey: false});

exports.usrs_m = mongoose.model('usrs', _usrs);


/*
	用户项目
	---------------------------------------


	文档: myproject
*/
const _myproject = new Schema({
	usr: String,
	project: [{
		name: String,
		ctime: Date,
		utime: Date,
		private: Boolean
	}]
}, { collection: 'myproject', versionKey: false});

exports.myproject_m = mongoose.model('myproject', _myproject);
