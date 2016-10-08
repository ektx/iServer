var express = require('express')
var multer = require('multer')
const fs = require('fs')


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

app.post('/profile', upload.single('avatar'), (req, res, next)=> {
	console.log(req.file, req.body);
	res.end('Success!')
});

app.post('/profiles', upload.array('avatar', 5), (req, res, next)=> {
	console.log(req.files, req.body);
	res.end('Success!')
});


app.listen(3000)