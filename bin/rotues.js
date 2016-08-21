const fs = require('fs');
const path = require('path');
const rotuesPath = require('./rotuesPath');


module.exports = (app, type) => {

	app.get('/favicon.ico', function(req, res) {
		res.end();
		return
	});

	if (type == "SERVER") {
		app.get('/', rotuesPath.root)
		app.get('/loginOut', rotuesPath.loginOut)
		app.get('/session', rotuesPath.session)
		app.get('/addproject', rotuesPath.addProject)
		app.get('/set/profile', rotuesPath.setProfile)
		app.get('/set/passwd', rotuesPath.getPasswdPage)
	}

	app.get('/server/*', rotuesPath.server)

	if (type == "SERVER") {
		app.get('/:usr', rotuesPath.usrHome)
		app.get('/:usr/:project', rotuesPath.usrProject)
	
		app.post('/loginIn', rotuesPath.loginIn)
		app.post('/checkPwd', rotuesPath.checkPwd)
		app.post('/addproject', rotuesPath.addProject_p)
		app.post('/set/passwd', rotuesPath.updatePwd)
		app.post('/set/profile', rotuesPath.PSetProfile)
	}

	app.get('*', rotuesPath.getAll)
	app.post('*', rotuesPath.postAll)
}

