const fs = require('fs');
const path = require('path');
const r = require('./rotuesPath');
const api_v1 = require('./API/V1/api');


module.exports = (app, type) => {

	app.get('/favicon.ico', function(req, res) {
		res.end();
		return
	});

	if (type == "os") {

		app.get('/', r.root)
		app.get('/loginOut', r.loginOut)
		app.get('/addUser', redirectCheckLoginUsr, r.addUser)
		app.get('/session', r.session)
		app.get('/addproject', redirectCheckLoginUsr, r.addProject)
		app.get('/resetPWD', r.getResetPWD)
		app.get('/SMTP', redirectCheckLoginUsr, r.getSMTP)
		app.get('/set/profile', r.setProfile)
		app.get('/set/passwd', redirectCheckLoginUsr, r.getPasswdPage)
		app.get('/users', redirectCheckLoginUsr, r.getUsers)
	}

	app.get('/server/make', r.makeHTML )
	app.get('/server/*', r.server)
	app.get('/iproxy-url=*', r.iproxy)

	if (type == "os") {
		app.get('/api/v1/:usr', api_v1.API_usrHome)
		app.get('/:usr', r.usrHome)
		app.get('/:usr/__USER/*', r.__USER)
		app.get('/:usr/:project/settings', redirectCheckLoginUsr, r.proSettings)
		app.get(['/:usr/:project', '/:usr/:project/f/*'], r.usrProject)
	
		app.post('/loginIn', r.loginIn)
		app.post('/vieworigincode', r.vieworigincode)
		app.post('/signUp', r.signUp)
		app.post('/forgotPwd', r.forgotPwd)
		app.post('/addUser', checkLoginUsr, r.addUserPost)
		app.post('/getUserList', checkLoginUsr, r.getUserList)
		app.post('/checkPwd', r.checkPwd)
		app.post('/updateProSettings', checkLoginUsr, r.updateProSettings)
		app.post('/uploadProFiles', checkLoginUsr, r.uploadUsrProFile)
		app.post('/addproject', checkLoginUsr, r.addProject_p)
		app.post('/set/passwd', checkLoginUsr, r.updatePwd)
		app.post('/set/profile', r.PSetProfile)
		app.post('/set/SMTP', checkLoginUsr, r.setSMTP)
		app.post('/create/myProDir', checkLoginUsr, r.createUsrProjectDirs)
		app.post('/pro/refreshgit', checkLoginUsr, r.refreshGitProject)
		app.post('/updateProGitRemote', checkLoginUsr, r.updateProjectGitRemote)

		app.delete('/deleteMyPro', checkLoginUsr, r.delMyPro)
		app.delete('/myPro/file', checkLoginUsr, r.delMyProFile)
	} else {
		app.post('/toOpenFilePath', r.toOpenPath)

		app.post('*', r.postAll)
		app.get('*', r.getAll)
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