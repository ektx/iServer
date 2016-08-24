const inquirer = require('inquirer');

function getServerSet(type) {

	let questions = [
		{
			type: 'list',
			name: 'setting',
			message: '是否自定义设置?',
			choices: ['否', '是']
		}
	];

	let settingQuestions = [
		{
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
			type: 'confirm',
			name: 'sourceMap',
			message: '是否使用JavaScript Source Map?',
			default: ()=>{
				return false
			}
		}
	];

	// 如果是使用系统
	// 需要输入数据名和地址
	if (type === 'os') {
		questions.splice(0,0, {
			type: 'input',
			name: 'db',
			message: 'Mongodb数据库:',
			default: ()=> {
				return 'iserver'
			}
		}, {
			type: 'input',
			name: 'dbURL',
			message: 'Mongodb数据库地址:',
			default: ()=> {
				return 'mongodb://localhost/'
			}
		});
	}

	inquirer.prompt(questions).then((answer)=> {
		if (answer.setting === '是') {

			inquirer.prompt(settingQuestions).then((answer)=> {

				console.log(JSON.stringify(answer, null, ' '))
			})
		}

				console.log(JSON.stringify(answer, null, ' '))

	})
}

module.exports = getServerSet