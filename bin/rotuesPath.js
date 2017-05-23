// 路径对应请求
const fs = require('fs');
const os = require('os');
const url = require('url');
const ejs = require('ejs');
const path = require('path');
const http  = require('http');
const async = require('async');
const colors  = require('colors');
const multer  = require('multer');
const imkdirs = require('imkdirs');
const server  = require('./server');
const Schemas = require('./schemas');
const rimraf = require('rimraf');
const querystring = require('querystring');
const pack    = require('tar-pack').pack;
const unpack  = require('tar-pack').unpack;

require('shelljs/global');

const ifiles = require('./ifiles');
const email = require('./email');
const IP  = require('./getIPs');

const ProSet = require('./projectSet');

/*
	是否有项目的权限与功能
	-----------------------------
	返回用户与项目的关系和项目的信息
	options:
	@usr {string} 用户
	@proName {string} 项目名称
*/
const hasProject = (req, res, options) => {

	options = options || {usr: null, proName: null};

	let usr = options.usr || req.params.usr;

	let p = new Promise(function(resolve, reject) {
		// 如果只有一个/时,也就是 '/用户名' 时进入用户中心

		Schemas.project_m.findOne(
			{
				usr: usr,
				name: options.proName || req.params.project
			},
			(err, data)=> {
				if (err) console.log(err);

				if (data) {

					let status = {};

					if (req.session.act && req.session.act == usr) {
						status.isMaster = 1
					} else {
						status.isMaster = 0
					}

					if (data.private) {
						status.open = 1
					} else {
						status.open = 0
					}

					// 返回状态和数据
					resolve({
						data: data, 
						status: status
					})

				} else {
					reject({
						status: 404, 
						data: '没有此项目!!'
					})
				}
			}
		)


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

/*
	添加简单的自定义跨域访问
	------------------------
	支持 GET
*/
exports.iproxy = (req, res) => {
	let proxyUrl = req.url.substr(12);
	console.log('%s $ %s', req.method.bgGreen.white,  proxyUrl);

	// 当用户使用 htpps 想让服务器代理时,我们提醒他让开发配合使用相关技术方案
	if (url.parse(proxyUrl).protocol === 'https:') {
		res.send('Please Set: Access-Control-Allow-Origin:*, Help Link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS')
	} 
	// 当用户使用的是 http 请求的后端时,我们可以简单的代理
	else {

		http.get(encodeURI(proxyUrl), (xres)=> {
			xres.setEncoding('utf8');
			xres.pipe(res);
		})
		
	}

}



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
exports.usrHome = (req, res)=> {

	console.log(':: You asking ', req.params.usr );
	console.log(req.headers.host)
	console.log(req.url)

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

		if (!proData.length) {
			proData = false;
		}

		res.render('demo', {
			usrInfo: { 
				usr: req.session.usr,
				ico: req.session.ico,
				pow: req.session.pow
			},
			askUsr: usrData,
			project: proData
		});
	};

	findAskUsr.then( 
		// 存在用户时,查找此用户的项目
		(usrData)=> {

			let keyVal = {
						usr: req.params.usr
					};

			// 非用户本人访问时
			if (req.params.usr !== req.session.act) {

				keyVal.private = false;
			}

			ProSet.FindUsrProjects({
				key: keyVal,
				help: {
					sort:{
						ctime: 1
					}
				},
				callback: (err, data)=> {
					sendMsg(req, res, usrData, data.reverse())
				}
			})

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
exports.usrProject = (req, res)=> {

	console.log(':: You asking User:', req.params.usr )
	console.log(':: You asking Her Project:', req.params.project )

	// 保留原始地址,方便其它使用
	let originURL = req.url.split('/');
	originURL.splice(3,1);
	// 修改请求地址和真实地址,为后面读取准备
	let realUrl  = req.url = originURL.join('/');	
	let filePath = process.cwd()+ realUrl;
	let getTar   = false;
	

	let gitProFiles = (status, projectInfo)=> {

		console.log('===>', getTar, filePath)

		// 文件回调操作
		let fileCallback = function(file) {
			if ( file.endsWith('.md') ) {
				res.render('md', {
					path: '/viewmd'+realUrl
				})
			} else {
				ifiles.sendFile(req, res, file)
			}
		}

		// 目录回调操作
		let dirCallback = function(filePath) {
			// 对目录文件时
			fs.readdir(filePath, (err, files)=> {

				// 防止访问文件夹时,系统崩溃
				if (!filePath.endsWith('/')) filePath += '/';

				if (err) {
					console.log(307, err); 
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

				let breadArr = realUrl.split('/');
				let defHead  = defaultHeader(req);

				realUrl.endsWith('/') ? breadArr.pop() : breadArr;

				res.render('project', {
					files: fileArr,
					projectInfo: projectInfo,
					host: defHead.host,
					usrInfo: defHead.usrInfo || false,
					proStatus: status,
					title: req.params.project,
					titurl: '/'+req.params.usr+'/'+req.params.project+'/',
					breadCrumbs: breadArr
				})
			})
		}

		// 使用文件服务
		server(req, res, {
			serverRootPath: process.cwd(),
			fileCallback: fileCallback, // 对文件操作
			dirCallback: dirCallback 	// 对目录操作
		});
		
	}

	// 1. 验证
	if ( req.params.project.endsWith('.igit') ) {
		let req_usr = querystring.parse(url.parse(req.url).query);
		req.params.project = req.params.project.replace(/\.igit(\?.*)?/i, '');

		console.log( '1.SomeBody want get tar.gz ...' , req.params.project, req_usr);

		if (req_usr && req_usr.p) {

			let callback = (data)=>{
				// 用户密码判断
				if (data.pwd === req_usr.p) {
					// 密码正确,返回密码用于下次下载需求使用
					res.send({
						success: true,
						stream: req_usr.p
					})
				} else {
					// 密码错误
					res.send({
						success: true,
						msg: '密码错误!请稍重新输入!!',
						pwd: true
					})
				}
			}

			getUserInfo({account: req.params.usr}, callback, (err)=>{
				res.send("Get usrInfo error!")
			});

		} else {

			Schemas.project_m.findOne(
				{usr: req.params.usr, 'name': req.params.project},
				(err, data)=>{
					if (err) {
						res.send({
							msg: "请求项目时出现错误!请稍候再试!"
						})
						return;
					}

					// 是否有此项目存在
					if (data) {

						// 如果项目是个人项目,要求用户输入密码
						if (data.private) {
							res.send({
								success: true,
								msg: '请先确认用户信息:',
								pwd: true
							})
						} else {
							// stream 表示不需要密码的公开项目
							res.send({
								success: true,
								stream: false
							})
						}
					} else {
						res.send({
							success: false,
							msg: '不存在此项目,请确认后再试!'
						})
					}
				}
			)
		}

	} 
	// 2.下载
	else if (req.params.project.endsWith('.stream') ) {
		console.log( '2.SomeBody will get tar.gz ...' );

		let req_usr = querystring.parse(url.parse(req.url).query);
		filePath = filePath.replace(/\?.+/, '');
		req.params.project = req.params.project.replace('.stream', '');

		// 文件下载格式化
		let toDownTar = ()=>{
			filePath = filePath.replace(/\.stream(\?.*)?/, '/');
			getTar   = true;
			gitProFiles();
		}

		// 对于公开的项目,直接下载
		if (!req_usr.p) {
			toDownTar()
		} else {
			// 取得个人信息,验证当前用户是否可以下载项目
			getUserInfo(
				{account: req.params.usr, pwd: req_usr.p}, 
				(data)=>{
					// 密码正确时下载
					if (data.pwd === req_usr.p) toDownTar() 
					else {
						res.send('Error!')
					}

				}, 
				(err)=>{
					res.send("Get usrInfo error!")
				}
			);
		}



	}
	// 正常浏览器访问项目
	else {

		hasProject(req, res).then( (options)=>{

			gitProFiles(options.status, options.data) 
		}, (reject)=>{
			res.send('404')
		})
		
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
	debugLog(req, res);

	res.render('passwd', defaultHeader(req));
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
		res.redirect(req.headers.referer)
	})
};


// 登录 /loginIn [post]
exports.loginIn = (req, res) => {

	let sendMsg = {};

	Schemas.usrs_m.find(
		{
			$or: [
				{account: req.body.user}, 
				{email: req.body.user}
			]
		},
		(err, character) => {

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
	let filter = ['root', 'admin', 'help', 'api', 'doc', 'server', 'version'];

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

	let options = defaultHeader(req);
	let type = url.parse(req.url).query;

	if (type === 'git') {
		options.title = "创建 Git 项目";
	} else {
		options.title = "创建项目";
	}
	options.type = url.parse(req.url).query;

	res.render('addProject', options)
}

/*
	添加新项目-提交功能
	------------------------------------
*/
exports.addProject_p = (req, res)=> {

	let _proName = req.body.name;
	let _private = req.body.private;
	let _type    = req.body.type;
	let _url     = req.body.git;

	console.log('====> ',req.body);
	console.log('usr project path:');

	let sendMsg = (err, errInfo)=> {
		if (err) {
			res.send({
				success: false,
				msg: errInfo
			});
			return;
		}

		let proPath = path.join(process.cwd(), req.session.act, _proName);

		let __status = true,
			__msg = '';

		if (_type === 'git') {

			console.log('will git..');

			let clonePath

			try {
				clonePath = exec('git clone '+ _url +' '+proPath);
			} catch (err) {
				res.send({
					success: false,
					msg: 'Clone Err!'+ err
				});

				return;
			}
			console.log(clonePath);

			switch (clonePath.code) {
				case 0:
					__msg = "/"+req.session.act+"/"+_proName+"/";
					break;

				case 128:
					__status = false;
					__msg = 'Could not read from remote repository.';
					break;

				default:
					__status = false;
					__msg = 'Error! Git clone failed';
				
			}

			if (!__status) {
				res.send({
					success: __status,
					msg: __msg
				});
				return;
			}

			toSaveProject(__msg);

		} else {
			let isMK;
			// 生成项目目录
			try {
				isMK = fs.mkdirSync(proPath);
			} catch (err) {
				res.send({
					success: false,
					msg: '项目文件夹已经存在!'
				})
				return;
			}

			if (!isMK) {
			
				__msg = "/"+req.session.act+"/"+_proName+"/";
				toSaveProject(__msg);
				
			} 
		}
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

	// 验证保存数据的方法
	let toSaveProject = (path)=> {
		Schemas.project_m.create(
		{
			usr: req.session.act,
			name: _proName,
			private: _private,
			ctime: new Date().toISOString(),
			type: _type,
			url: _url
		}, 
		(err, data) => {
			
			res.send({
				success: true,
				msg: path
			})
			
		})
	}

	// 查看项目是否已经存在
	Schemas.project_m.findOne(
		{
			usr: req.session.act, 
			name: _proName
		},
		(err, data)=> {
			if (err) {
				console.log(err);
				res.end('Server Error!')
				return;
			}

			if (!data) {
				// toSaveProject();
				sendMsg()
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

	hasProject(req, res).then(
		(options)=>{
			let status = options.status;
			let defHead = defaultHeader(req);

			console.log('This people have the project!', status)

			if (!status.isMaster) {
				res.redirect('/'+req.params.usr+'/'+req.params.project)
				return;
			}

			res.render('../server/proSettings', {
				host: defHead.host,
				usrInfo: defHead.usrInfo,
				project: options.data,
				proStatus: status,
				title: req.params.project,
				titurl: '../'+req.params.project+'/'
			})
		},
		(failed)=> {
			res.send('404')
		}
	)
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
	let msg = '';

	console.log('原项目名称: '+oldProName, '\n新项目名称: '+newProName, '\n新隐私: '+newPrivate)

	hasProject(req, res, {
		usr: req.session.act, 
		proName: oldProName
	})
	.then( (options)=> {
		let status = options.status;
		// 0 不公开项目
		if ( status.isOpen ) {
			msg = '公开项目不可以收回!!';
			newPrivate = true;
		} else {
			if (newPrivate && newPrivate === 'true') {
				newPrivate = true;
			} else {
				updateJSON.private = false;
				newPrivate = false;
			}
		}

		updateJSON.name = newProName;

		if (oldProName === newProName && newPrivate ) {
			console.log('No change! OK!!')
			res.send({
				success: false,
				msg: msg || '没有修改!'
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

		Schemas.project_m.update(
			{
				usr: req.session.act, 
				name: oldProName
			},
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

	Schemas.project_m.remove(
		{
			usr: req.session.act,
			name: oldProName
		},
		(err, data)=> {
			if (err) {
				res.send(err);
				return;
			}

			console.log(data);

			if (data) {

				rimraf( path.join(process.cwd(), req.session.act, oldProName), (err, data)=> {
				
					if (err) {
						console.log(err);
						res.send({
							success: false,
							msg: '无法物理删除项目,请联系管理员!'
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
		}
	)
}

/*
	删除文件
	-----------------------------------------

*/
exports.delMyProFile = (req, res)=> {
	let filePath = getPhysicalFilePath(req.body.file);
	let user = filePath[0];

	if ( user === req.session.act ) {

		rimraf( decodeURI(path.join(process.cwd(),filePath.join('/'))), (err)=>{
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
	console.log(req.body)
	let hasErr = {
		status: false,
		msg: ''
	};
	// 最多上传 6 -1 = 5个
	let maxCount = 21;
	let hasCount = 0;
	let projectPathArr = [];

	let storage = multer.diskStorage({
			destination: (req, file, cb)=> {
				projectPathArr = req.body.dir.split(',');

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
		
		// 更新项目的更新时间信息
		ProSet.UpDataProInfo({
			filter: {usr: req.session.act, name: projectPathArr.reverse()[0]},
			set: {
				utime: new Date().toISOString()
			},
			callback: (err, data) => {
				if (err) {
					res.send({
						success: false,
						msg: err
					})
					return;
				}

				res.send({
					success: true,
					msg: 'Success!'
				})
				
			}
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
					askUsr: false
				});
			}
		);

	}
}


/*
	找回密码功能
	-----------------------------------
	用户输入注册时的邮箱,我们会先发一份确认文件给用户
	防止其它用户误写邮件造成非必要的操作
*/
exports.forgotPwd = (req, res) => {
	let _email = req.body.email;

	let sendGetPwd = function() {
		let newPwd = Math.random().toString(36).substring(2, 8);

		Schemas.usrs_m.update(
			{email: _email},
			{$set: {reset: newPwd}},
			(err, uD)=> {
				if (err) {
					console.log(err);
					return;
				}

				let host = req.secure?'https://':'http://'+ req.headers.host;

				sendemail({
					from: 'UED 帮助中心',
					to: req.body.email,
					subject: '找回密码确认',
					text: '请确认您要重置你的密码!',
					html: '<h1>找回密码确认</h1>'+
					      '<p>我们收到您要重置密码的需求,请点击下面的链接重置!</p>'+
					      '<p><a href="'+host+'/resetPWD?code='+newPwd+'&email='+_email+'">确认重置密码</a></p>'+
					      '<p>新密码将在您<b>确认重置</b>后发送!注意查收!!</p>'+
						  '<br><p>UED 团队</p>'
				});

				res.send({
					success: true,
					msg: '请查收您的邮件！'
				})
			}
		)		
	};

	Schemas.usrs_m.find(
		{email: _email},
		(err, data)=> {
			if (err) {
				console.log(err);
				return;
			}

			if (data.length > 0) {
				sendGetPwd()
			}
		}
	)
}

/*
	获取重置密码功能
	-----------------------------
	当用户从邮箱中点击了确认重置密码功能后,
	后台自动生成一个随机的密码给用户,方便用户登录
*/
exports.getResetPWD = (req, res)=> {
	let data = querystring.parse(url.parse(req.url).query);

	Schemas.usrs_m.find(
		{email: data.email, reset: data.code},
		(err, json)=> {
			if (err) {
				console.log(err);
				return;
			}

			if (json.length > 0) {
				let newPwd = Math.random().toString(36).substring(2, 8);

				Schemas.usrs_m.update(
					{email: data.email, reset: data.code},
					{$set: {pwd: newPwd}},
					(err, uDate)=> {
						if (err) {
							console.log(err);
							return;
						}

						sendemail({
							from: 'UED 帮助中心',
							to: data.email,
							subject: '重置新密码',
							text: '您的新密码是...',
							html: '<h1>重置新密码</h1>'+
							      '<p>您的新密码是:</p>'+
							      '<p>'+newPwd+'</p>'+
							      '<p>请妥善保管!</p>'+
								  '<br><p>UED 团队</p>'
						});

						res.redirect('/')
					}
				)

			} else {
				res.send({
					success: false,
					msg: '无法匹配到您的帐号!'
				})
			}
		}
	)
}


/*
	刷新 Git 项目代码
	-----------------------------
*/
exports.refreshGitProject = (req, res)=> {

	let user = req.session.act,
		name = req.body.name;

	// 查寻当前用户是否有对应的项目
	Schemas.project_m.findOne(
		{
			usr: user,
			name: name
		},
		(err, data)=> {

			// 没有项目时
			if (err) {
				res.send({
					success: false,
					msg: '没有发现相关数据!'
				});
				return;
			}

			async.parallel([
				// 更新数据
				callback => {
					let _gitDir = decodeURI( name );
					let _proPath = path.join(process.cwd(), user, _gitDir);
					let _url = 'git --work-tree='+_proPath+' --git-dir='+_proPath+'/.git pull ';
					let _run = exec(_url);

					callback(null, _run)
				},
				// 更新时间
				callback => {
					ProSet.UpDataProInfo({
						filter: {usr: user, name: name},
						set: {
							utime: new Date().toISOString()
						},
						callback: callback(err, data)
					})
				}
			], (err, results) => {
				
				if (err) {
					res.send({
						success: false,
						msg: 'update failed!' + err
					})
					return console.log(err);
				}

				if (results[0].code === 0 && results[1] ) {
					res.send({
						success: true,
						msg: 'Already up-to-date.'
					})
				} else {
					res.send({
						success: false,
						msg: 'update failed!'+ results[0]
					})
				}
			})

		}
	)

}

/*
	更新 Git 项目目录
	---------------------------------
*/
exports.updateProjectGitRemote = (req, res)=> {
	hasProject(req, res, {
		usr: req.session.act,
		proName: req.body.oldName
	}).then(
		(options)=> {
			console.log('Git:', options);

			if (options.status.isMaster) {
				Schemas.project_m.update(
					{
						usr: req.session.act,
						name: req.body.oldName
					},
					{$set: {
						url: req.body.proUrl
					}},
					(err, data)=> {
						if (err) {
							res.send({
								success: false,
								msg: '更新 Git Url 失败!请联系管理员!'
							});
							return;
						}

						res.send({
							success: true,
							msg: 'Git 更新成功!'
						})
					}
				)
			}
		},
		(failed)=> {
			console.log("Git :", failed);
			res.send(404)
		}
	)
}


/*
	查看源代码
	------------------------------------
	目前只有对 md 文件
*/
exports.vieworigincode = (req, res)=> {
	console.log(req.body);

	if (req.body.type === 'md') {
		server(req, res, {
			serverRootPath: process.cwd(), 
			path: req.body.file.replace('/viewmd', '') 
		});
	}
}


/*
	打开文件目录功能
	-----------------------------------
	为作为本地服务器时,可以通过
	Mac 上 command + 点击
	Win 上 Ctrl + 点击
	打开对应的文件夹
*/
exports.toOpenPath = (req, res) => {

	let platform = os.platform();
	let openPath = path.join(process.cwd(), req.body.url );
	let stat = fs.statSync( openPath );

	if ( stat.isFile() ) {
		openPath = path.dirname( openPath )
	}

	// 处理空格
	openPath = openPath.replace(/\s/g, '\\ ');

	if ( IP.getClientIP(req).isServer ) {
		if ( platform === 'darwin') {
			exec('open '+ openPath)
		} 
		else if ( platform === 'linux2' ) {
			exec('nautilus '+openPath)
		}
		else if ( platform === 'win32' ) {
			openPath = openPath.replace(/\//g, '\\');
			exec('explorer '+ openPath)
		}
	}

	res.send({
		success: true
	})
}

/*
	make
	-----------------------------------
	归属: tool
	说明: 用于生成页面
*/
exports.makeHTML = (req, res) => {

	fs.readFile( path.join(__dirname, '../server/make.ejs'), 'utf8', (err, data) => {
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}

		let html = ejs.render( data )

		res.send( html )
		
	} )

}

/*
	发送邮件测试
	sendMsg:
	{
		from: 'UED', 		// 发件地址
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

			if (data) {

				sendMsg.from = sendMsg.from +'<'+data.usr+'>';

				email(
					{
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


/*
	获取文件地物理地址
	-----------------------------------------------------
	/ektx/NX/f/iservers/
	=>
	/ektx/NX/iservers/
*/
function getPhysicalFilePath(url) {
	let _url = decodeURI(url).split('/')
	_url.shift();
	_url.splice(2,1);

	return _url;
}

/*
	网页头部统一返回内容
	--------------------------------
*/
function defaultHeader(req) {

	if (!req) {
		console.log('You Need give "req" ');
		req = {};
	}

	let session = req.session;

	return {
		usrInfo: { 
			usr: session.act,
			name: session.usr,
			ico: session.ico,
			pow: session.pow
		},
		host: (req.secure?'https://':'http://')+ req.headers.host,
	}
}

/*
	返回用户信息
	---------------------------------
*/
function getUserInfo(match, done, fail){
	Schemas.usrs_m.findOne(
		match,
		(err, data)=> {
			if (err) {
				console.log(err);
				if (fail) fail(err);
				return;
			}

			if (done) done(data)
		}
	)
}

