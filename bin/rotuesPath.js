// 路径对应请求
const fs = require('fs');
const url = require('url');
const path = require('path');
const colors  = require('colors');
const multer = require('multer');
const server  = require('./server');
const Schemas = require('./schemas');


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
	console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) )

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

	if (req.params.usr !== req.session.act) {
		fields.project = {
			$elemMatch: {private: false}
		};
	}

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

	findAskUsr.then( 
		// 存在用户时,查找此用户的项目
		(usrData)=> {
			Schemas.myproject_m.findOne(
				{usr : req.params.usr}, 
				fields, 
				(err, data)=> {
					let proData = null;

					if (data) proData = data;

					console.log(data)
						
					res.render('demo', {
						usrInfo: { 
							usr: req.session.usr,
							ico: req.session.ico
						},
						host: 'http://'+ req.headers.host,
						askUsr: usrData,
						project: proData
					});
				}
			);
		},
		// 不存在此用户时, 404
		(reject)=> {
			res.send(reject)
		}
	)
};


// 访问用户
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
			console.log(req.file)
			console.log(saveDir)
			console.log(req.body)
			// Everything went fine
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










