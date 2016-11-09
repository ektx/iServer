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
		let name = path.basename( decodeURIComponent(projectName));
		let tarFile = process.cwd()+ '/' + name +'.tar.gz';
		let url = projectName.substr(0, projectName.lastIndexOf('/'));

		let ws = fs.createWriteStream( tarFile );

		/*
			克隆项目文件
			--------------------------------
			@url {string} 下载项目的地址
		*/
		let getStream = (url)=> {

			let stream = request.get( url )

			stream.pipe(ws);

			stream.on('response', (res)=>{

				if (!res.ok) {
					console.log(res.error);
					return;
				}

				let loadingIco = 0;
				let loadingIcoArr = ['-', '\\', '|', '/', '-', '\\', '|', '/']

				res
				.on('data', (chunk)=>{
					progressStatus(loadingIcoArr[loadingIco] + ' Downloading');
					loadingIco++;
					if (loadingIco == 8) loadingIco = 0;
				})
				.on('end',()=>{

					if (res.ok) {
						progressStatus('OK Download\n');
						progressStatus('Unpack Files...')
						
						// 解压完成之后,删除下载包
						unPackPro(tarFile, process.cwd() + '/' + name , ()=>{
							fs.unlink(tarFile)
						});
					} else {
						// 删除下载包
						fs.unlink(tarFile)
					}

				})

			})
		}

		// 请求项目,如果项目不要密码的则自动下载下来
		let getMyProject = (path)=> {
			
			let req = request
				.get( path )
				.end( (err, res)=> {
					if (!err && res.ok) {
						console.log(res.body);

						if (!res.body.success) return;

						// 需要密码的项目
						if (res.body.pwd) {

							// 输入用户名于密码
							inquirer.prompt([
								{
									type: 'input',
									name: 'name',
									message: '姓名:'
								},
								{
									type: 'password',
									name: 'pwd',
									message: '密码:'
								}
							]).then((answer)=>{
								
								let streamURL = url + '.igit?p='+ answer.pwd+'&u='+answer.name;

								// 添加密码后再次提交确认
								getMyProject( streamURL );

							})

						} 
						// 公开或认证过项目
						else {
							let _url = url + '.stream';
							if (res.body.stream) {
								_url += '?p='+res.body.stream;
							}
							getStream(_url)
						}

					}
				}) // end()

		};


		getMyProject(url + '.igit')


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


function unPackPro(readStr, savePath, callback) {
	let rd = fs.createReadStream(readStr);
	rd.pipe( unpack(savePath, (err)=>{
			if (err) console.log(err.stack);
			else {
				progressStatus('Unpacked!\n');
				if (callback) callback()
			}
		}) )
}


function progressStatus(outinput) {
	process.stdout.clearLine();
	process.stdout.cursorTo(0)
	process.stdout.write(outinput);
}