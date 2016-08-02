const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
	用户信息
	======================================
	name: 用户名
	pwd: 密码
	ico: 头像

	文档: usrs
*/
const _usrs = new Schema({
	name   : String,
	pwd	   : String,
	ico	   : String
}, {conllection: 'usrs', versionKey: false});

const usrs = mongoose.model('usrs', _usrs);

module.exports.usrs_m = usrs;