#! /usr/bin/env node

'use strict';

const inquirer = require('inquirer');

let questions = [
	{
		type: 'list',
		name: 'type',
		message: '你想让服务器来处理什么?',
		choices: ['本地开发工具', '系统服务器']
	}
];

inquirer.prompt(questions).then((answer)=> {
	console.log(JSON.stringify(answer, null, ' '))
})
