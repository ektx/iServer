var express = require('express')
var multer = require('multer')


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
	res.sendFile(__dirname +'/multer.html')
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