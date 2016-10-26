const express = require('express')
const multer = require('multer')
const fs = require('fs')
const unpack  = require('tar-pack').unpack;


var storage = multer.diskStorage({
	destination: (req, file, cb)=> {
		cb(null, 'img/')
	},
	filename: (req, file, cb)=> {
		cb(null, file.originalname)
	}
})
var upload = multer({storage: storage})

var app = express();

app.get('/', (req, res)=> {
	res.sendFile(__dirname +'/jqProgress.html')
})

app.get('*', (req, res)=> {
	let stream = fs.createReadStream(__dirname + '/' + req.path);
	stream.pipe(res)
})

app.post('/profiles', upload.array('avatar', 5), (req, res, next)=> {
	console.log(req.files, req.body);

	const rd = fs.createReadStream(__dirname + '/img/'+req.files[0].originalname);

	rd.pipe(unpack(__dirname+'/package/Dev/', (err)=>{
		if (err) console.log(err.stack);
		else console.log('Done')
	}))
	res.end('Success!')
});


app.listen(3000)