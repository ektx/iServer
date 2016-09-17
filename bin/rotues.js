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
		app.get('/:usr/__USER/*', rotuesPath.__USER)
		app.get('/:usr/:project/settings', redirectCheckLoginUsr, rotuesPath.proSettings)
		app.get(['/:usr/:project', '/:usr/:project/f/*'], rotuesPath.usrProject)
	
		app.post('/loginIn', rotuesPath.loginIn)
		app.post('/signUp', rotuesPath.signUp)
		// app.post('/forgotPwd', rotuesPath.forgotPwd)
		app.post('/checkPwd', rotuesPath.checkPwd)
		app.post('/updateProSettings', checkLoginUsr, rotuesPath.updateProSettings)
		app.post('/uploadProFiles', checkLoginUsr, rotuesPath.uploadUsrProFile)
		app.post('/addproject', checkLoginUsr, rotuesPath.addProject_p)
		app.post('/set/passwd', checkLoginUsr, rotuesPath.updatePwd)
		app.post('/set/profile', rotuesPath.PSetProfile)

		app.delete('/deleteMyPro', checkLoginUsr, rotuesPath.delMyPro)
		app.delete('/myPro/file', checkLoginUsr, rotuesPath.delMyProFile)
	} else {
		app.get('*', rotuesPath.getAll)
		app.post('*', rotuesPath.postAll)
	}

}


/*
	使用中间件的方式来验证用户是否登录过期问题
	----------------------------------------
	JSON版
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

/*
	使用中间件的方式来验证用户是否登录过期问题
	----------------------------------------
	自动重定向版
*/
function redirectCheckLoginUsr(req, res, next) {
	if (!req.session.act) {
		res.redirect(req.url ? '/#referer='+req.url: '/')
	} else next()
}