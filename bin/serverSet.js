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


	if (options.type === 'os') {
		osInfo.type = 'os';
		osInfo.version = options.version

		main(osInfo)
	} else {

		inquirer.prompt(defaultQuestions).then((answer)=> {

			if (answer.defSet === 'No') {

				inquirer.prompt(toolSettingQuestions).then((answer)=> {
					console.log(answer)
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