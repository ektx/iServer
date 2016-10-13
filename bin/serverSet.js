const inquirer = require('inquirer');

const main = require('./main');

function getServerSet(options) {

	let defaultQuestions = [
		{
			type: 'list',
			message: '是否使用系统默认设置?',
			name: 'defSet',
			choices: [ 'Yes', 'No']
		}
	];

	let toolSettingQuestions = [
		{
			type: 'checkbox',
			name: 'compression',
			message: '压缩以下那些格式文件:',
			choices: [
				{
					name: 'Css'
				},
				{
					name: 'JavaScript'
				}
			]
		},
		{
			type: 'confirm',
			name: 'sourceMap',
			message: '是否使用JavaScript Source Map?',
			default: ()=>{
				return false
			}
		}
	];

	let OSSettingQuestions = [
		{
			type: 'input',
			name: 'db',
			message: 'Mongodb数据库:',
			default: ()=> {
				return 'iserver'
			}
		}, 
		{
			type: 'input',
			name: 'dbURL',
			message: 'Mongodb数据库地址:',
			default: ()=> {
				return 'mongodb://localhost/'
			}
		}
	];

	inquirer.prompt(defaultQuestions).then((answer)=> {

		if (answer.defSet === 'Yes') {

			if (options.type === 'os') {
				options.db = 'iserver';
				options.dbURL = 'mongodb://localhost/';
			} else {
				options.compression = ['Css', 'JavaScript'];
				options.sourceMap = false;
			}

			main(options)

		} else {

			// 如果是服务器时,使用服务器的设置
			if (options.type === 'os') {
				toolSettingQuestions = OSSettingQuestions;	
			};

			toolSettingQuestions.unshift({
				type: 'input',
				name: 'port',
				message: '端口号:',
				default: ()=>{
					return 8000
				},
				validate: (val)=> {
					let pass = /^[0-9]*$/.test(val);

					if (pass) return true;

					return '请输入数字!'
				}
			})

			inquirer.prompt(toolSettingQuestions).then((answer)=> {
				options.port = answer.port;

				if (options.type === 'os') {
					options.db = answer.db;
					options.dbURL = answer.dbURL;
				} else {
					options.compression = answer.compression;
					options.sourceMap = answer.sourceMap;
				}

				main(options)
			})
		}

	})
}


module.exports = getServerSet