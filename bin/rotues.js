const fs = require('fs');
const url = require('url');
const path = require('path');

const colors  = require('colors');
const server  = require('./server');

const Schemas = require('./schemas');

module.exports = (app) => {

	app.get('/', (req, res, next) => {
		res.redirect('/server/login.ejs')
	});

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

	app.post('/loginweb', (req, res) => {
		console.log(req.body.usr, req.body.passwd);

		let sendMsg = {};

		Schemas.usrs_m.find({'name': 'kings'}, (err, character) => {

			if ( character.length == 0 ) {
				sendMsg = {
					'success': false,
					'msg': '不存在此用户'
				}
				res.json(sendMsg)

			} 
			else if ( character.length > 0) {
				if ( character[0].pwd === req.body.passwd ) {

					req.session.usr = req.body.usr;
					req.session.pwd = req.body.passwd;

					res.redirect('/server/demo.ejs')
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



	app.get('*', (req, res) => {

		let filterDir = ['/server'];

		if ()

		if (!req.session.usr && req.url !== '/server/login.ejs') {
			res.redirect('/server/login.ejs');
			return;
		}

		console.log('%s - %s', req.method.bgGreen.white, decodeURI(req.url) );

		server(req, res, {serverRootPath: __dirname.replace('/bin', '') });
	});


	app.post('*', (req, res) => {
		console.log('%s - %s', req.method.bgBlue.white, decodeURI(req.url) )

	})
}


function checkLogin(req, res, next) {
	console.log(req.session);

	if (!req.session.usr) {
		res.redirect('/server/login.ejs')
		res.end()
	} else {
		next()
	}
}