const fs = require('fs');
const url = require('url');
const path = require('path');

const colors  = require('colors');
const server  = require('./server');

const Schemas = require('./schemas');

module.exports = (app) => {


	app.get('/favicon.ico', function(req, res) {
		res.end();
		return
	});


	app.get('/', (req, res, next) => {
		res.render('login')
	});

	app.get('/demo', (req, res)=> {

		checkLoginForURL(req, res, () => {
			res.render('demo', {
				usrInfo: {
					usr: req.session.usr,
					ico: req.session.ico
				}
			})
		})
	})

	// test session
	app.get('/session', (req, res, next) => {
		let sess = req.session;

		if (sess.views) {
			sess.views++

			res.setHeader('Content-Type', 'text/html; charset="utf-8" ')
			res.write('<p>Views: ' + sess.views + '</p>');
			res.write('<p>Exprirs in: ' + (sess.cookie.maxAge / 1000)+ 's</p>')
			res.end()
		} else {
			sess.views = 1;
			res.end('Welcomw to the session test! refresh!')
		}
	} );

	app.post('/loginIn', (req, res) => {
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
						"msg": '/demo'
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
	})


	app.get('/loginOut', (req, res) => {
		req.session.destroy((err)=>{
			if (err) throw err;
			res.redirect('/')
		})
	})



	app.get('*', (req, res) => {
		console.log('%s - %s', req.method.bgGreen.white, decodeURI(req.url) );

		if (checkLoginForStatic(req, res) )
			server(req, res, {serverRootPath: __dirname.replace('/bin', '/server') });
	});


	app.post('*', (req, res) => {
		console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) )

	})
}


function checkLoginForStatic(req, res) {
	let result = true;
	// 如果没有 session 同时还不是来自服务器自己的请求
	// 往回登录页面
	if ( !req.session.usr) {
		if (req.headers.referer && url.parse(req.headers.referer).host === req.headers.host) {
			console.log('Welcome :' , !req.session.usr )
		} else {
			res.redirect('/');
			result = false;
		}
	}

	return result;
}

function checkLoginForURL(req, res, callback) {
	// 如果没有 session 同时还不是来自服务器自己的请求
	// 往回登录页面
	if ( !req.session.usr ) {
		res.redirect('/');
		result = false;
	} else {
		console.log('Welcome :' , req.session.usr )

		callback()
	}

}