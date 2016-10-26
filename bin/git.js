#! /usr/bin/env node

const fs      = require('fs');
const path	  = require('path');
const url 	  = require('url');
const pack    = require('tar-pack').pack;
const unpack  = require('tar-pack').unpack;
const request = require('superagent');
const inquirer = require('inquirer');
const progressBar = require('progress');
const args = process.argv.splice(2);

let projectName = args[1];

let userInfo = 	[
	{
		type: 'input',
		message: '帐号:',
		name: 'UserName'
	},
	{
		type: 'password',
		message: '密码:',
		name: 'Password'
	}
]

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
				.post('http://localhost:8000/igit/push')
				.attach('avatar', fileStream)
				.end((err, res)=>{
					if (!err && res.ok) {
						fs.unlink(tarPath)
					}
				})
		});

		break;

	case 'clone':

		projectName = projectName.substr(0, projectName.lastIndexOf('/')) + '.igit';

		request
			.get(projectName)
			.end((err, res)=>{
				console.log(res.ok)
			})



		// inquirer.prompt(userInfo).then((answer)=>{
		// 	console.log(JSON.stringify(answer, null, ' '))
		// 	console.log('clone!');
		// })
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