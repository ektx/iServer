var logs = require('./logs');


// test head
// logs.head({
// 	title: {
// 		content: "hello world",
// 		align: "left",
// 		decoration: "above"
// 	},
// 	subTitle: {
// 		content: "This subTitle",
// 		align: "center"
// 	},
// 	width: 60,
// 	sign: '-'
// }).list({
// 	content: [ 
// 		[ "name", "logs"  ],
// 		[ "versionversionversionversion", "0.0.1", 'OK', 'xxxooo' ],
// 		[ "version", '---', 'OK' ]
// 	],
// 	align: 'center',
// 	width: 60,
// 	colspan: 3
// }).show()

// 测试
logs.head({
	title: {
		content: "LOGS 0.0.1",
		align: "center",
		decoration: "inset"
	},
	subTitle: {
		content: "ektx <530675800@qq.com>",
		align: "center"
	},
	width: 60,
	sign: '='
}).list({
	content: [ 
		[ "content", "列表内容，数组形式"  ],
		[ "title", "标题" ],
		[ "algin", "对齐方式,可选 left,center,right,justify; 或使用数组" ],
		[ "width", "总列表宽度, number || array" ],
		[ "colspan", "分列数量" ]
	],
	title: ['List 说明'],
	align: 'justify',
	width: 60
}).show()


logs.head({
	title: {
		content: "LOGS 0.0.1",
		align: "center",
		decoration: "inset"
	},
	subTitle: {
		content: "ektx <530675800@qq.com>",
		align: "center"
	},
	width: 60,
	sign: '='
}).list({
	content: [ 
		[ "content ", "列表内容，数组形式"  ],
		[ "title ", "标题" ],
		[ "algin ", "对齐方式,可选 left,center,right,justify; 或使用数组" ],
		[ "width ", "总列表宽度, number || array" ],
		[ "colspan ", "分列数量" ]
	],
	title: ['List 说明'],
	align: ['center', 'left'],
	width: [15, 45]
}).show()
