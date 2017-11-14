const fs = require('fs')
const path = require('path')
const r = require('./rotuesPath')


module.exports = (app, type) => {

	app.get('/favicon.ico', function(req, res) {
		res.end()
		return
	});

	app.get('/server/make', r.makeHTMLPage )
	app.get('/server/toMake', r.makeHTMLPage )
	app.get('/server/*', r.server)
	app.get('/@/*', r.getWeb)
	// app.get('/api/*', r.getAPI)
	app.get('/iproxy-url=*', r.iproxy)

	app.post('/toOpenFilePath', r.toOpenPath)
	app.post('/server/zipfile', r.tool_zipdownload )

	app.post('*', r.postAll)
	app.get('*', r.getAll)

}
