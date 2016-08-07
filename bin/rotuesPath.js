// 路径对应请求
const url = require('url');
const colors  = require('colors');
const server  = require('./server');
const Schemas = require('./schemas');


// 访问 / [get]
exports.root = (req, res) => {
	// 默认访问根目录时,如果用户登录过则进入用户中心
	if (req.session.usr) {
		res.redirect('/'+req.session.usr)
	} 
	// 没有登录过则是进入登录页面
	else {
		res.render('login')
	}
}

// 所有get * 请求
exports.getAll = (req, res) => {
	console.log('%s - %s', req.method.bgGreen.white, decodeURI(req.url) );

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
	let fields = {_id:0, project: 1};

	if (req.params.usr !== req.session.usr) {
		fields.project = {
			$elemMatch: {private: false}
		};
	}

	// 查看是否有此用户信息
	let findAskUsr = new Promise((resolve, reject) => {
		Schemas.usrs_m.findOne(
			{'name': req.params.usr}, 
			{_id:0, pwd:0}, 
			(err, data)=> {
				if (data) {
					resolve(data)
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
				fields, (err, data)=> {
					let proData = null;

					if (data) proData = data;
						
					res.render('demo', {
						usrInfo: { 
							usr: req.session.usr,
							ico: req.session.ico
						},
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
					usr: req.session.usr,
					ico: req.session.ico
				}
			})
		// })
		
	} else {
		next()
	}
};

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

	Schemas.usrs_m.find({'name': req.body.user}, (err, character) => {

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

				console.log(character[0].name)
				console.log(character[0].pwd)
				console.log(character[0].ico)

			

				// 保存 session 信息
				req.session.usr = character[0].name;
				// req.session.pwd = req.body.passwd;
				req.session.ico = character[0].ico;

				console.log('登录后信息:',req.session)

				sendMsg = {
					"success": true,
					"msg": '/'+req.session.usr
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
	if ( !req.session.usr ) {
		res.redirect('/');
		result = false;
	} else {
		callback()
	}
}













