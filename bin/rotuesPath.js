// 路径对应请求
const fs = require('fs');
const url = require('url');
const path = require('path');
const colors  = require('colors');
const multer = require('multer');
const server  = require('./server');
const Schemas = require('./schemas');
const mongoose = require('mongoose');


// 访问 / [get]
exports.root = (req, res) => {
	// 默认访问根目录时,如果用户登录过则进入用户中心
	if (req.session.act) {
		res.redirect('/'+req.session.act)
	} 
	// 没有登录过则是进入登录页面
	else {
		res.render('login')
	}
}

// 所有get * 请求
exports.getAll = (req, res) => {
	console.log('%s * %s', req.method.bgGreen.white, decodeURI(req.url) );

	server(req, res, {serverRootPath: process.cwd() });
};

// 请求服务本身
exports.server = (req, res) => {

	server(req, res, {serverRootPath: __dirname.replace('bin', '') });
};



// 所有 post * 请求
exports.postAll = (req, res) => {
	console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) );

	server(req, res, {serverRootPath: process.cwd() });

};


// /session [get]
exports.session = (req, res) => {
	let sess = req.session;

	if (sess.views) {
		sess.views++

		res.setHeader('Content-Type', 'text/html; charset=utf-8')
		res.write('<p>Views: ' + sess.views + '</p>');
		res.write('<p>Exprirs in: ' + (sess.cookie.maxAge / 1000)+ 's</p>')
		res.end()
	} else {
		sess.views = 1;
		res.end('Welcomw to the session test! refresh!')
	}
}


// 访问用户
exports.usrHome = (req, res, next)=> {

	console.log(':: Your asking ', req.params.usr );
	console.log(req.headers.host)
	console.log(req.url)
	let fields = {_id:0, project: 1};

	// 查看是否有此用户信息
	let findAskUsr = new Promise((resolve, reject) => {
		Schemas.usrs_m.findOne(
			{'account': req.params.usr}, 
			{_id:0, pwd:0}, 
			(err, data)=> {
				if (data) {
					resolve({
						usr: data.account,
						pic: data.ico
					})
					console.log(data)
				} else {
					reject('404')
				}
			}
		)
	});

	let sendMsg = (req, res, usrData, proData)=> {
		console.log(proData)
							
		res.render('demo', {
			usrInfo: { 
				usr: req.session.usr,
				ico: req.session.ico
			},
			host: 'http://'+ req.headers.host,
			askUsr: usrData,
			project: proData
		});
	};

	findAskUsr.then( 
		// 存在用户时,查找此用户的项目
		(usrData)=> {

			// 非用户本人访问时
			if (req.params.usr !== req.session.act) {
				Schemas.myproject_m.aggregate([
						{$match: {
							'usr': req.params.usr
						}},
						{$unwind: '$project'},
						{$match: {
							'project.private': false
						}},
						{$sort: {
							'project.ctime': -1
						}},
						{$group: {
							_id: '$usr',
							project: {$push: '$project'}
						}}
					],
					(err, data)=> {

						if (data.length > 0) {
							sendMsg(req, res, usrData, data[0].project)
						} else {
							sendMsg(req, res, usrData, false)
						}
					}
				)
			}
			// 如果是用户本人访问个人中心
			else {
				Schemas.myproject_m.findOne(
					{usr : req.params.usr},
					(err, data)=> {

						if (!data) {
							data = false
						} else {
							data = data.project;

							data.reverse();
						}

						sendMsg(req, res, usrData, data)
					}
				);
			}

		},
		// 不存在此用户时, 404
		(reject)=> {
			res.send(reject)
		}
	)
};


// 访问用户项目
exports.usrProject = (req, res, next)=> {

	console.log(':: Your asking User:', req.params.usr )
	console.log(':: Your asking Her Project:', req.params.project )

	// 如果只有一个/时,也就是 '/用户名' 时进入用户中心
	if (req.url.split('/').length === 2) {

		console.log('you vist :', req.url.substr(1))
		// 先判断用户在不在了
		// checkLoginForURL(req, res, () => {
			res.render('demo', {
				usrInfo: {
					act: req.session.act,
					usr: req.session.usr,
					ico: req.session.ico
				}
			})
		// })
		
	} else {
		next()
	}
};


// 设置个人信息
exports.setProfile = (req, res) => {
	
	debugLog(req, res);

	checkLoginForURL(req, res, ()=> {
		Schemas.usrs_m.findOne(
			{account: req.session.act},
			(err, data)=> {
				if (err) {
					res.json({
						"success": false,
						"msg": "服务器错误"
					})
					return;
				}

				console.log(data)

				res.render('profile', {
					usrInfo: {
						act: data.account,
						usr: data.name,
						email: data.email,
						ico: data.ico
					},
					host: 'http://'+ req.headers.host,
					askUsr: false
				})
				
			}
		) // End Schemas
	})
}

/*
	更新个人信息
	--------------------------
	[POST]
	1.更新头像
	2.更新呢称
	3.更新邮箱
*/
exports.PSetProfile = (req, res)=> {
	console.log('%s + %s', req.method.bgBlue.white, decodeURI(req.url) )


	if (req.session.act) {	
		let saveDir = path.join(process.cwd(), req.session.act, '__USER/');
		let storage = multer.diskStorage({
			destination: (req, file, cb)=> {
				cb(null, saveDir)
			},
			filename: (req, file, cb)=> {
				saveDir = path.join(req.session.act, '__USER', file.originalname);
				cb(null, file.originalname)
			}
		})

		let upload = multer({storage: storage}).single('ico');

		
		upload(req, res, function (err) {
			if (err) {
			  console.log(err)
			  return
			}

			let updateUsr = {
				name: req.body.name,
				email: req.body.email
			}
			req.session.usr = req.body.name;

			// 存在新头像就更新头像
			if (!req.body.ico && req.body.ico === undefined) {
				// 删除老的头像
				if (req.session.ico !== 'server/img/kings.png') {
					fs.unlink( path.join(process.cwd(), req.session.ico) )
				}

				updateUsr.ico = saveDir;
				req.session.ico = saveDir;
				console.log(req.session)
			}

			Schemas.usrs_m.update(
				{account: req.session.act},
				{$set: updateUsr},
				(err, raw)=> {
					if (err) throw err;
					setTimeout(function() {

						res.send({
							"success": true
						})
					}, 10000)
				}
			)
		})
	} else {

		res.json({
			"success": false,
			"msg": {
				"info": "登录过期!",
				"href": "/#referer=set/profile"
			}
		})
	}
}


/*
	访问密码修改页面
	--------------------------------------
*/
exports.getPasswdPage = (req, res) => {
	goToPage(req, res, 'passwd')
}


/*
	修改密码时,验证旧密码是否正确
	----------------------------------------
*/
exports.checkPwd = (req, res)=> {
	debugLog(req, res);

	if (req.session.act) {

		Schemas.usrs_m.findOne({account: req.session.act, pwd: req.body.pwd}, (err, data)=> {

			if (err) throw err;

			if (!data) {
				res.send({
					"success": false,
					"msg": {
						txt: "密码错误!"
					}
				})
			}
		})

	} else {
		res.send({
			"success": false,
			"msg": {
				txt: "登录过期",
				href: "/#referer=set/passwd"
			}
		})
	}
}


/*
	更新密码
	-------------------------------------
*/
exports.updatePwd = (req, res)=> {
	debugLog(req, res);

	checkLoginForURL(req, res, ()=> {
		Schemas.usrs_m.update(
			{account: req.session.act},
			{$set: {pwd: req.body.pwd}},
			(err, data)=> {
				if (err) {
					res.send({
						"success": false,
						"msg": "保存出错!"
					});
					return;
				}

				console.log(data);
				setTimeout(function(){
					res.send({
						"success": true,
						"msg": "完成!"
					})

				}, 5000)
			}
		) // End Schemas
	})
}

/*
	登录页面功能
	---------------------------------------
*/
// 注销  /loginOut [get]
exports.loginOut = (req, res)=> {
	req.session.destroy((err)=>{
		if (err) throw err;
		res.redirect('/')
	})
};


// 登录 /loginIn [post]
exports.loginIn = (req, res) => {
	
	console.log(req.body.user, req.body.passwd);

	let sendMsg = {};

	Schemas.usrs_m.find({account: req.body.user}, (err, character) => {

		if ( character.length == 0 ) {
			sendMsg = {
				'success': false,
				'msg': '不存在此用户'
			}
			res.json(sendMsg)

		} 
		else if ( character.length > 0) {
			console.log(character[0])
			if ( character[0].pwd === req.body.passwd ) {

				console.log(character)

				// 保存 session 信息
				req.session.act = character[0].account;
				req.session.usr = character[0].name;
				// req.session.pwd = req.body.passwd;
				req.session.ico = character[0].ico;

				console.log('登录后信息:',req.session)

				sendMsg = {
					"success": true,
					"msg": '/'
				}

				res.json(sendMsg)
			} else {
				sendMsg = {
					'success': false,
					'msg': '密码错误!'
				}
				res.json(sendMsg)
			}
		}

	}) // End find
};


/*
	添加新项目页面
	-------------------------------------
*/
exports.addProject = (req, res) => {
	goToPage(req, res, 'addProject')
}

/*
	添加新项目-提交功能
	------------------------------------
*/
exports.addProject_p = (req, res)=> {
	checkLoginForURL(req, res, ()=> {

		let _proName = req.body.name;
		let _private = req.body.private;

		console.log(req.body.name, req.body.private);

		let sendMsg = (err, data)=> {
			if (err) {
				res.send({
					success: false,
					msg: "项目创建失败!请稍候再试!!"
				});
				return;
			}

			res.send({
				success: true,
				msg: "/"+req.session.act+"/"+_proName
			})
		}

		let updatePro = () => {
			Schemas.myproject_m.update(
				{usr: req.session.act},
				{$push: {
					'project': {
						name: _proName,
						private: _private,
						ctime: new Date().toISOString()
					}
				}},
				{_id: false},
				(err, data)=> {
					sendMsg(err, data)
				}
			)
		};

		let insertUsrAndPro = () => {
			Schemas.myproject_m.create(
			{
				usr: req.session.act,
				project: {
					name: _proName,
					private: _private,
					ctime: new Date().toISOString()
				}
			}, 
			(err, data) => {
				sendMsg(err, data)
			})
		}

		let toSaveProject = ()=> {
			Schemas.myproject_m.find({usr: req.session.act}, (err, data)=>{
				if (err) {
					res.end('Find usr Err!');
					return
				}

				if (data.length > 0) {
					updatePro()
				} else {
					insertUsrAndPro()
				}
			})
		}

		Schemas.myproject_m.findOne(
			{usr: req.session.act, 'project.name': _proName},
			(err, data)=> {
				if (err) {
					console.log(err);
					res.end('Server Error!')
					return;
				}

				if (!data) {
					toSaveProject();
				} else {
					res.send({
						success: false,
						msg: "此项目已经存在"
					})
				}
			}
		)
	})
} 

/*
	checkLoginForURL
	---------------------------------------
	如果没有 session 同时还不是来自服务器自己的请求
	往回登录页面
*/
function checkLoginForURL(req, res, callback) {
	let url = req.url;

	if ( !req.session.act ) {
		res.redirect(url ? '/#referer='+url : '/');
		result = false;
	} else {
		callback()
	}
}


function debugLog (req, res) {
	console.log('-------------------------------------')
	if (req.method === 'GET') {
		console.log('%s > %s', req.method.bgGreen.white, decodeURI(req.url) );
	} else if (req.method === 'POST') {
		console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) )
	}

}


function goToPage(req, res, page) {

	debugLog(req, res);

	checkLoginForURL(req, res, ()=> {
		res.render(page, {
			usrInfo: { 
				act: req.session.act,
				usr: req.session.usr,
				ico: req.session.ico
			},
			host: 'http://'+ req.headers.host,
			askUsr: false
		});
	})	
}







