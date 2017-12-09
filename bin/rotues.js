
const fs = require('fs')
const path = require('path')

const r = require('./rotuesPath')
const toOpenPath = require('./toOpenPath')


module.exports = function (app) {

	app.get('/favicon.ico', function(req, res) {
		res.end()
		return
	});

	// app.get('/@Workbench', r.makeHTMLPage )
	// app.get('/server/toMake', r.makeHTMLPage )
	app.get('/server/*', r.server)
	app.get('/@/*', r.getWeb)
	app.get('/iproxy-url=*', r.iproxy)

	app.post('/api/opendir', toOpenPath)
	app.post('/server/zipfile', r.tool_zipdownload )

	app.post('*', r.postAll)
	app.get('*', r.getAll)

}
