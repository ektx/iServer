#! /usr/bin/env node

const fs      = require('fs');
const path	  = require('path');
const pack    = require('tar-pack').pack;
const unpack  = require('tar-pack').unpack;
const request = require('superagent');
const progressBar = require('progress');
const args = process.argv.splice(2);

let projectName = args[1];

console.log(args)

switch (args[0]) {
	case 'pack':
		packPro();

		break;
	case 'pull':
		console.log('you will git fills');

		projectName = path.basename(process.cwd());

		break;

	case 'push':
		packPro(()=>{

			let tarPath = path.join(process.cwd(), 'dev.tar.gz');
			
			projectName = path.basename(process.cwd());

			let fileSize = fs.statSync( tarPath ).size;
			let fileStream = fs.createReadStream(tarPath);
			let barOpt = {
				complete: '=',
				incomplete: ' ',
				width: 20,
				total: fileSize,
				clear: false			
			};

			let bar = new progressBar(' Uploading [:bar] :total :percent :elapseds :etas', barOpt)

			fileStream.on('data', (chunk)=>{
				bar.tick(chunk.length)
			});

			request
				.post('http://localhost:3000/profiles')
				.attach('avatar', fileStream)
				.end((err, res)=>{
					console.log(res.status)
				})
		});

		break;

	case 'clone':
		console.log('clone');
		break;
}


function packPro(callback) {
	let ws = fs.createWriteStream;
	pack(path.join(process.cwd(), 'Dev'))
		.pipe( ws(path.join(process.cwd(), 'dev.tar.gz')) )
		.on('error', (err)=> {
			console.log(err.stack)
		})
		.on('close', ()=>{
			console.log('Done!');
			callback()
		})
}