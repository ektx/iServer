const inquirer = require('inquirer');

const main = require('./main');
const osInfo = require('../os.config');

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
			type: 'input',
			name: 'port',
			message: 'Server port:',
			default: ()=> {
				return 8000
			},
			validate: val => {
				let pass = /^[0-9]*$/.test(val);

				if (pass) return true;

				return 'Please type number'
			}
		},
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
			type: 'list',
			name: 'sourceMap',
			message: 'Use JavaScript Source Map ?',
			choices: ['Yes', 'No']
		}
	];


	if (options.type === 'os') {
		osInfo.type = 'os';
		osInfo.version = options.version

		main(osInfo)
	} else {

		inquirer.prompt(defaultQuestions).then((answer)=> {

			if (answer.defSet === 'No') {

				inquirer.prompt(toolSettingQuestions).then((answer)=> {

					// 翻译js map
					if (answer.sourceMap === 'Yes') {
						answer.sourceMap = true;
					} else {
						answer.sourceMap = false;
					}

					// 设置新端口
					options.port = parseInt(answer.port);

					main(options)
				})

			} else {
				options.compression = ['Css', 'JavaScript'];
				options.sourceMap = false;
				main(options)
			}

		})
	}

}


module.exports = getServerSet