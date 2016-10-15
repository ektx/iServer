// 路径对应请求
const fs = require('fs');
const url = require('url');
const path = require('path');
const colors  = require('colors');
const multer  = require('multer');
const imkdirs = require('imkdirs');
const server  = require('./server');
const Schemas = require('./schemas');
const mongoose = require('mongoose');
const rimraf = require('rimraf');
const CExec = require('child_process').exec;

const ifiles = require('./ifiles');
const email = require('./email');


const hasProject = (req, res, options) => {

	let usr = req.params.usr || options.usr;

	let p = new Promise(function(resolve, reject) {
		// 如果只有一个/时,也就是 '/用户名' 时进入用户中心
		Schemas.myproject_m.aggregate([
			{$match: {usr: usr }},
			{$unwind: '$project'},
			{$match: {'project.name': req.params.project || options.proName }}
		], (err, data)=> {
			if (err) { console.log(err); return }

			// 归属状态
			let isOpen = (status)=> {
				// 项目状态
				if (data[0].project.private) {
					// 是本人访问隐私项目
					if (status.isMaster) {
						status.isOpen = 0;
						resolve(status)
					} 
					// 非本人访问隐私项目
					else {
						ifiles.sendError(res, 423, '您无权访问此项目!!')
					}
				} else {
					// 访问公开项目
					status.isOpen = 1;
					resolve(status)
				}

			};

			if (data.length == 0) {
				ifiles.sendError(res, 404, '没有此项目!')
				return;
			}

			if (req.session.act && req.session.act == usr) {
				// isMaster: 1 这个项目只有自己可以看
				isOpen({ isMaster: 1})
			} else {
				isOpen({ isMaster: 0})
				// 423 当前资源被锁定
			}

		})
	});

	return p;
}


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

/*
	添加用户 [GET]
	---------------------------
*/
exports.addUser = (req, res)=> {
	if (req.session.pow === 'root') {
		res.render('addUser')
	} else {
		res.redirect('/')
	}
}

// 所有get * 请求
exports.getAll = (req, res) => {
	console.log('%s * %s', req.method.bgGreen.white, decodeURI(req.url) );

	server(req, res, {serverRootPath: process.cwd() });
};

// 服务器内部文件请求
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
		console.log( usrData, proData)
							
		res.render('demo', {
			usrInfo: { 
				usr: req.session.usr,
				ico: req.session.ico,
				pow: req.session.pow
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


exports.__USER = (req, res)=> {
	server(req, res, {serverRootPath: process.cwd() });
}


// 访问用户项目
exports.usrProject = (req, res, next)=> {

	console.log(':: Your asking User:', req.params.usr )
	console.log(':: Your asking Her Project:', req.params.project || options.proName )

	let realUrl  = req.url = req.url.replace('/f', '');	
	let filePath = process.cwd()+ realUrl;
	
	let gitProFiles = (status)=> {

		let isFs = false;

		try {
			isFs = fs.statSync(filePath);
		} catch (err) {
			ifiles.sendError(res, 404, '没有发现此目录');
			return;
		}

		// 如果是文件,只接读取
		if ( isFs.isFile() ) {
			server(req, res, {serverRootPath: process.cwd() });
			return;
		}

		// 对目录文件时
		fs.readdir(filePath, (err, files)=> {

			// 防止访问文件夹时,系统崩溃
			if (!filePath.endsWith('/')) filePath += '/';

			if (err) {
				console.log(err); 
				return;
			}

			let fileArr = [];
			for (let f = 0, l = files.length; f < l; f++) {
				let stat = fs.statSync(filePath + files[f]);

				if (stat.isDirectory()) {
					fileArr.push({
						type: 'dir',
						name: files[f]
					})
				} else {
					fileArr.push({
						type: 'file',
						name: files[f]
					})
				}
			}

			let usrInfo = false;
			let breadArr = realUrl.split('/');
			realUrl.endsWith('/') ? breadArr.pop() : breadArr;

			if (req.session.act) {
				usrInfo = {
					usr: req.session.act,
					ico: req.session.ico,
					pow: req.session.pow
				}
			}

			res.render('../server/project', {
				files: fileArr,
				host: req.secure?'https://':'http://'+ req.headers.host,
				usrInfo: usrInfo,
				proStatus: status,
				title: req.params.project,
				titurl: '/'+req.params.usr+'/'+req.params.project+'/',
				breadCrumbs: breadArr
			})
		})
	}

	hasProject(req, res).then( (status)=>{
		gitProFiles(status) 
	})

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
				let sendJSON = defaultHeader(req);

				sendJSON.askUsr= false
				sendJSON.usrInfo.email = data.email;

				res.render('profile', sendJSON)
				
			}
		) // End Schemas
	})
}


// 设置邮件服务器
exports.getSMTP = (req, res) => {

	// 过滤非管员用户
	if (req.session.pow !== 'root') {

		res.redirect('/');
		return;
	}
	
	Schemas.SMTP_m.findOne(
		{},
		(err, data)=> {
			if (err) {
				res.json({
					"success": false,
					"msg": "服务器错误"
				})
				return;
			}

			console.log(data);
			let sendJSON = defaultHeader(req);
			sendJSON.askUsr = false;
			sendJSON.SMTP = !data ? {host:'',port:'',usr:''} : data;

			res.render('SMTP', sendJSON)
			
		}
	) // End Schemas
}

exports.setSMTP = (req, res) => {
	console.log(req.body);

	if (isNaN(req.body.port)) {
		res.send({
			success: false,
			msg: "端口应该是数字"
		});
		return;
	}

	Schemas.SMTP_m.remove({}, (err, data)=>{
		if(err) {
			res.send({
				success: false,
				msg: '清空出错!'
			});
			return
		}

		Schemas.SMTP_m.create(req.body, (err, small)=> {
			if (err) {
				res.send({
					success: false,
					msg: '保存出错'
				});
				return;
			};

			res.send({
				success: true,
				msg: '成功!'
			})
		})
		
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

		// 设置上传头像参数
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
					fs.unlink( path.join(process.cwd(), req.session.ico) , (err, data)=> {
						if (err) {
							console.log('Not Find Old Pic!');
							return;
						}
					})
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

					res.send({
						"success": true
					})
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
			} else {
				res.send({
					"success": true
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

	Schemas.usrs_m.update(
		{account: req.session.act},
		{$set: {pwd: req.body.newpwd}},
		(err, data)=> {
			if (err) {
				res.send({
					"success": false,
					"msg": "保存出错!"
				});
				return;
			}

			res.send({
				"success": true,
				"msg": "完成!"
			})

		}
	) // End Schemas
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
			if ( character[0].pwd === req.body.passwd ) {

				let sess = req.session;

				// 保存 session 信息
				sess.act = character[0].account;
				sess.usr = character[0].name;
				sess.pwd = req.body.passwd;
				sess.ico = character[0].ico;
				sess.pow = character[0].power;


				sendMsg = {
					"success": true,
					"msg": '/'
				}

				console.log('登录后信息:',sess)
				res.send(sendMsg)
			} else {
				sendMsg = {
					'success': false,
					'msg': '密码错误!'
				}
				res.send(sendMsg)
			}
		}

	}) // End find
};


/*
	注册
	==============================================
*/
exports.signUp = (req, res)=> {
	console.log(req.body.user, req.body.passwd, req.body.email);

	let act = req.body.user;
	let ico = 'server/img/kings.png';
	let pow = 'user'; // root admin user 
	let filter = ['root', 'admin', 'help'];

	// 过滤名称安全
	if ( !/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/g.test(req.body.user) ) {
		res.send({
			success: false,
			msg: '项目名称中只能使用 - 或 _'
		});
		return;
	}

	if ( filter.includes(req.body.user) ) {
		res.send({
			success: false,
			msg: '此用户已经注册'
		});
		return;
	}

	// 权限设置
	Schemas.usrs_m.findOne({power: 'root'}, (err, data)=> {
		if (err) {
			console.log(err); return;
		}

		console.log('>>>-----> ',data)

		if (!data) {
			pow = 'root' // 超级管理员
		}
	})


	let toSaveUsr = ()=> {
		Schemas.usrs_m.create(
		{
			account: act,
			name: act,
			pwd: req.body.passwd,
			email: req.body.email,
			ico: ico,
			power: pow
		}, 
		(err, data) => {
			imkdirs( path.join(process.cwd(), act, '__USER') );

			// 自动登录
			req.session.act = act;
			req.session.ico = ico;
			req.session.usr = act;
			req.session.pow = pow;

			// 发送邮件
			sendemail({
				from: 'UED iServer',
				to: req.body.email,
				subject: '欢迎!',
				text: '欢迎加入!',
				html: '<style>h1,h3,p {color:#333}</style><h1>欢迎使用 iServer</h1><h3>以下是你注册信息,请妥善保管</h3>'+
					  '<p><b>帐号:</b>'+ act +'</p>'+
					  '<p><b>注册邮箱:</b>'+ req.body.email +'</p>'+
					  '<p>你可以通过帐号登录系统!通过邮箱找回密码</p>'+
					  '<br><p>UED 团队</p>'
			})

			// 跳转主页
			res.send({
				success: true,
				msg: '/'+act
			})
		})
	};

	Schemas.usrs_m.find({account: act}, (err, data)=> {
		if (err) {
			console.log(err);
			
			res.send({
				success: false,
				msg: '服务器错误'
			});
			return;
		}

		if (data.length > 0) {
			res.send({
				success: false,
				msg: '此用户已经注册'
			})
		} else {
			toSaveUsr()
		}
	})
}


/*
	添加用户 [POST]
	==============================================
*/
exports.addUserPost = (req, res)=> {
	console.log('addUser POST',req.body.user, req.body.passwd, req.body.email);

	let act = req.body.user;
	let ico = 'server/img/kings.png';
	let pow = 'user'; // root admin user 
	let filter = ['root', 'admin', 'help'];

	// 过滤名称安全
	if ( !/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/g.test(req.body.user) ) {
		res.send({
			success: false,
			msg: '项目名称中只能使用 - 或 _'
		});
		return;
	}

	if ( filter.includes(req.body.user) ) {
		res.send({
			success: false,
			msg: '此用户已经注册'
		});
		return;
	}


	let toSaveUsr = ()=> {
		Schemas.usrs_m.create(
		{
			account: act,
			name: act,
			pwd: req.body.passwd,
			email: req.body.email,
			ico: ico,
			power: pow
		}, 
		(err, data) => {
			imkdirs( path.join(process.cwd(), act, '__USER') );

			// 跳转主页
			res.send({
				success: true,
				msg: act
			})
		})
	};

	Schemas.usrs_m.find({account: act}, (err, data)=> {
		if (err) {
			console.log(err);
			
			res.send({
				success: false,
				msg: '服务器错误'
			});
			return;
		}

		if (data.length > 0) {
			res.send({
				success: false,
				msg: '此用户已经注册'
			})
		} else {
			toSaveUsr()
		}
	})
}


/*
	获取用户列表页面 [GET]
	-------------------------------------
*/
exports.getUserList = (req, res) => {
	var page = req.body.page;
	var limit = parseInt(req.body.limit);
	console.log(page, limit)

	Schemas.usrs_m.count({}, (err, c)=>{
		if (err) {
			console.log(err);
			return;
		}

		console.log(c)

		Schemas.usrs_m.find(
			{},
			{'_id': 0, pwd: 0, power: 0},
			{skip: page * limit, limit: limit },
			(err, data)=> {
				if (err) {
					console.log(err);
					res.send({
						success: false,
						msg: 'Get user list error!'
					})
					return;
				}

				let obj = [];

				for (var i = 0, l = data.length; i < l; i++) {
					obj[i] = {};
					obj[i]['act'] = data[i].account; 
					obj[i]['name'] = data[i].name;
					obj[i]['ico'] = data[i].ico;
				}

				res.send({
					success: true,
					msg: obj,
					count: c
				})
			}
		)
	})

}


/*
	添加新项目页面 [GET]
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

	let _proName = req.body.name;
	let _private = req.body.private;

	console.log(req.body.name, req.body.private);
		console.log('usr project path:')

	let sendMsg = (err, errInfo)=> {
		if (err) {
			res.send({
				success: false,
				msg: errInfo
			});
			return;
		}

		// 生成项目目录
		fs.mkdir(path.join(process.cwd(), req.session.act, _proName), (err, i)=>{

			res.send({
				success: true,
				msg: "/"+req.session.act+"/"+_proName
			})
		})
	}

	// 验证值是否正常
	if (!_proName) {
		res.send({
			success: false,
			msg: '项目名称不可为空'
		});
		return;
	}
	else if ( !/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/g.test(_proName) ) {
		res.send({
			success: false,
			msg: '项目名称中只能使用 - 或 _'
		});
		return;
	}

	// 更新数据 
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
				sendMsg(err, "项目创建失败!请稍候再试!!")
			}
		)
	};

	// 第一次时,创建添加
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
			sendMsg(err, "项目创建失败!请稍候再试!!")
		})
	}

	// 验证保存数据的方法
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

	// 查看项目是否已经存在
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
} 

/*
	项目设置 [GET]
	-----------------------------------
*/
exports.proSettings = (req, res)=> {

	hasProject(req, res).then((status)=>{
		console.log('This people have the project!', status)

		if (!status.isMaster) {
			res.redirect('/'+req.params.usr+'/'+req.params.project)
			return;
		}

		res.render('../server/proSettings', {
			host: req.secure?'https://':'http://'+ req.headers.host,
			usrInfo: { 
				usr: req.session.act,
				name: req.session.usr,
				ico: req.session.ico
			},
			proStatus: status,
			title: req.params.project,
			titurl: '../'+req.params.project+'/'
		})
	})
}

/*
	更新项目设置 [GET]
	-----------------------------------
*/
exports.updateProSettings = (req, res)=> {
	let oldProName = req.body.oldName;
	let newProName = req.body.proName;
	let newPrivate = req.body.private;
	let filePath   = path.join(process.cwd(), req.session.act);
	let updateJSON = {};

	console.log('原项目名称: '+oldProName, '\n新项目名称: '+newProName, '\n新隐私: '+newPrivate)

	hasProject(req, res, {
		usr: req.session.act, 
		proName: oldProName
	})
	.then( (status)=> {
		if (newPrivate == 'true') {
			if (status.isOpen) {
				console.log('公开项目不可以收回!!')
			} 
		} else {
			updateJSON['project.$.private'] = false;
		}

		updateJSON['project.$.name'] = newProName;

		// 通过抓包将公开的项目 private: false 改成自己的项目时 true
		// 或是本来就是个人的项目,测试直接保存时
		// 项目名称不变时,直接返回成功(不修改数据库)
		console.log( oldProName == newProName)
		if (oldProName === newProName && (newPrivate == status.isOpen?'false':'true')) {
			console.log('No cchange! OK')
			res.send({
				success: true,
				msg: '保存成功!'
			});
			return;
		}

		let renameDir = (req, res)=> {
			fs.rename(path.join(filePath, oldProName), path.join(filePath, newProName), (err, data)=>{
				if (err) {
					console.log(err);
					return;
				}
				console.log(data,'1')

				res.send({
					success: true,
					msg: '保存成功!'
				})
				
			})
		}

		Schemas.myproject_m.update(
			{usr: req.session.act, 'project.name': oldProName},
			{$set: updateJSON },
			(err, data)=> {
				console.log(data)
				if (err) {
					console.log(err);
					return;
				}

				renameDir(req, res)
			}
		)
	})
}

/*
	删除个人项目
	==========================================

*/
exports.delMyPro = (req, res)=> {
	let oldProName = req.body.proName;

	Schemas.myproject_m.update(
		{usr: req.session.act, 'project.name': oldProName},
		{$pull: {
			'project': {
				'name': oldProName
			}
		}},
		(err, data)=>{
		if (err) {
			console.log(err);
			return
		}

		if (data) {

			rimraf( path.join(process.cwd(), req.session.act, oldProName), (err, data)=> {
			
				if (err) {
					console.log(err);
					res.send({
						success: false,
						msg: '无法物理删除项目'
					})
					return;
				}

				res.send({
					success: true,
					msg: '项目已经删除!'
				})

			})

		} else {
			res.send({
				success: false,
				msg: 'No! Something was error!'
			})
		}
	})
}


exports.delMyProFile = (req, res)=> {
	let filePath = getPhysicalFilePath(req.body.file);
	let user = filePath[0];

	if ( user === req.session.act ) {

		rimraf( path.join(process.cwd(),filePath.join('/')), (err)=>{
			if (!err) {
				res.send({
					success: true,
					msg: '文件已经删除'
				})
			} else {
				res.send({
					success: false,
					msg: '删除文件出错!'
				});
			}
		} )
		
	} else {
		res.send({
			success: false,
			msg: '你无权删除此文件!'
		})
	}
}


/* 上传个人项目文件 */
exports.uploadUsrProFile = (req, res)=> {
	let hasErr = {
		status: false,
		msg: ''
	};
	// 最多上传 6 -1 = 5个
	let maxCount = 21;
	let hasCount = 0;

	let storage = multer.diskStorage({
			destination: (req, file, cb)=> {
				let projectPathArr = req.body.dir.split(',');

				if (projectPathArr[1] !== req.session.act ) {
					hasErr.status = true;
					hasErr.msg ='上传非法用户目录!';
				}


				hasCount++;
				if ( hasCount >= maxCount ) {
					res.send({
						success: false,
						msg: '上传数量过多!'
					});
					return;
				}

				cb( null, path.join( process.cwd(), projectPathArr.join('/') ) )
			},
			filename: (req, file, cb)=> {
				cb(null, file.originalname)
			}
		})

	let upload = multer({storage: storage}).array('files', maxCount);
	
	upload(req, res, function (err) {
		if (err) {
		  	console.log(err)
			res.send({
				success: false,
				msg: 'Server Error!'
			})
			return
		}

		if (hasErr.status) {
			res.send({
				success: false,
				msg: hasErr.msg
			})
			return;
		}

		res.send({
			success: true,
			msg: 'Success!'
		})

	})
}


/*
	创建用户文件夹
	--------------------------------------------
	用于用户在自己的项目中手工添加目录文件夹

*/
exports.createUsrProjectDirs = (req, res)=> {
	// 当前文件夹位置
	let filePathArr = getPhysicalFilePath( req.body.path);
	// 要创建个文件夹数组
	let dirArr = req.body.dirs;

	if ( filePathArr[0] === req.session.act ) {

		dirArr = dirArr.split(',');

		for (let i = 0, l = dirArr.length; i < l; i++) {
			if (dirArr[i]) {
				imkdirs( path.join(process.cwd(), filePathArr.join('/'), dirArr[i]) );
			}
		}

		res.send({
			success: true,
			msg: 'OK'
		})

	} else {
		res.send({
			success: false,
			msg: '你无权在此创建文件夹!'
		})
	}
}

/*
	查看用户信息 [get]
	-------------------------------------------
*/
exports.getUsers = (req, res)=> {

	let session = req.session;

	if (session.pow === 'user') {
		res.redirect('/')
	} else {

		Schemas.usrs_m.find(
			{'power': {'$ne': 'user'}},
			{'_id': 0, 'pwd': 0},
			(err, data)=> {
				if (err) {
					console.log(err);
					return;
				}

				console.log(data);

				res.render('users', {
					usrInfo: { 
						usr: session.act,
						name: session.usr,
						ico: session.ico,
						pow: session.pow
					},
					title: '用户管理',
					titurl: '/'+req.session.act,
					admin: data,
					host: req.secure?'https://':'http://'+ req.headers.host,
					askUsr: false
				});
			}
		);

	}
}

/*
	发送邮件测试
	sendMsg:
	{
		from: 'UED <' +data.usr+'>', 		// 发件地址
		to: '530675800@qq.com',		// 收件地址,多个可用','分隔
		subject: 'Hello!',				// 主题
		text: 'nodejs email test!',		// plaintext body
		html: '<h1>Nodejs email</h1>'	// 邮件内容
	}
*/
function sendemail(sendMsg) {

	Schemas.SMTP_m.findOne(
		{},
		(err, data)=> {
			if (err) {
				console.log(err);
				return;
			}

			sendMsg.from = sendMsg.from +'<'+data.usr+'>';

			console.log(sendMsg)
			email({
				host: data.host,
				port: data.port,
				auth: {
					user: data.usr,
					pass: data.pwd
				}
			},
			sendMsg
			)
		}
	)
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
				usr: req.session.act,
				name: req.session.usr,
				ico: req.session.ico
			},
			host: req.secure?'https://':'http://'+ req.headers.host,
			askUsr: false
		});
	})	
}

/*
	获取文件地物理地址
	-----------------------------------------------------
	/ektx/NX/f/iservers/
	=>
	/ektx/NX/iservers/
*/
function getPhysicalFilePath(url) {
	let _url = decodeURIComponent(url).split('/')
	_url.shift();
	_url.splice(2,1);

	return _url;
}

/*
	网页头部统一返回内容
	--------------------------------
	1.用户设置
	2.SMTP  -  setSMTP
*/
function defaultHeader(req) {
	let session = req.session;

	return {
		usrInfo: { 
			usr: session.act,
			name: session.usr,
			ico: session.ico,
			pow: session.pow
		},
		host: req.secure?'https://':'http://'+ req.headers.host,
	}
}



