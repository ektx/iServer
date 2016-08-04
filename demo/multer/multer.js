var express = require('express')
var multer = require('multer')
var upload = multer({dest: 'img/'})

var app = express();

app.get('/', (req, res)=> {
	res.sendFile(__dirname +'/multer.html')
})

app.post('/profile', upload.single('avatar'), function(req, res, next) {
	console.log(req.file, req.body);
	res.end('Success!')
});


app.listen(3000)