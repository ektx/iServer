const fs = require('fs');
const path = require('path');
const rotuesPath = require('./rotuesPath');


module.exports = (app, type) => {

	app.get('/favicon.ico', function(req, res) {
		res.end();
		return
	});

	if (type == "os") {
		app.get('/', rotuesPath.root)
		app.get('/loginOut', rotuesPath.loginOut)
		app.get('/session', rotuesPath.session)
		app.get('/addproject', rotuesPath.addProject)
		app.get('/set/profile', rotuesPath.setProfile)
		app.get('/set/passwd', rotuesPath.getPasswdPage)
	}

	app.get('/server/*', rotuesPath.server)

	if (type == "os") {
		app.get('/:usr', rotuesPath.usrHome)
		app.get(['/:usr/:project', '/:usr/:project/*'], rotuesPath.usrProject)
	
		app.post('/loginIn', rotuesPath.loginIn)
		app.post('/signUp', rotuesPath.signUp)
		// app.post('/forgotPwd', rotuesPath.forgotPwd)
		app.post('/checkPwd', rotuesPath.checkPwd)
		app.post('/addproject', checkLoginUsr, rotuesPath.addProject_p)
		app.post('/set/passwd', rotuesPath.updatePwd)
		app.post('/set/profile', rotuesPath.PSetProfile)
	}

	app.get('*', rotuesPath.getAll)
	app.post('*', rotuesPath.postAll)
}


/*
	使用中间件的方式来验证用户是否登录过期问题
	----------------------------------------
*/
function checkLoginUsr(req, res, next) {
	let url = req.url;
	
	if ( !req.session.act ) {
		res.send({
			"success": false,
			msg: "登录过期",
			href: url ? '/#referer='+url : '/'
		});

	}
	else next()
}
