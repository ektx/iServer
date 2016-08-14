const fs = require('fs');
const path = require('path');
const rotuesPath = require('./rotuesPath');


module.exports = (app) => {

	app.get('/favicon.ico', function(req, res) {
		res.end();
		return
	});

	app.get('/', rotuesPath.root)
	app.get('/loginOut', rotuesPath.loginOut)
	app.get('/session', rotuesPath.session)
	app.get('/set/profile', rotuesPath.setProfile)

	app.get('/server/*', rotuesPath.server)
	app.get('/:usr', rotuesPath.usrHome)
	app.get('/:usr/:project', rotuesPath.usrProject)


	app.post('/loginIn', rotuesPath.loginIn)
	app.post('/set/profile', rotuesPath.PSetProfile)


	app.get('*', rotuesPath.getAll)
	app.post('*', rotuesPath.postAll)
}

