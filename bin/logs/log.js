/*
	log 格式化console
	-----------------------------------
	ektx <530675800@qq.com>
*/
function Log(obj) {
	// console.log(obj)
	// console.log(obj.title)

	this.title = obj.title;
	this.subTitle = obj.subTitle;
	this.len = obj.len || 16;
	this.list = obj.list;

	if (!obj.title) {
		this.title = {
			str:'log', 
			align: 'center', 
			decoration: 'inset', 
			sign: '='
		}
	} else {
		this.title.str = obj.title.str || 'Log';
		this.title.align = obj.title.align || 'center';
		this.title.sign = obj.title.sign || '=';
		this.title.decoration = obj.title.decoration || 'inset';
	}


	let logs = '';

}

Log.prototype.output = function(type) {
	let html = '';
	let repeatStr = '';
	let endPlaceHolder = '';
	let startPlaceholder = '';
	let obj = this[type];
	let titleLen = obj.str.length;
	let sign = obj.sign;

	if (sign.length > 1) {
		sign = sign.substr(0, 1)
	}

	// -------------- title -------------
	// - subtitle 
	// 
	if (obj.decoration === 'above') {


		// 如果长度大于 0 则输出时添加优化效果
		if (this.len > titleLen) {

			let toRepeatCount = Math.floor( (this.len - titleLen -2) /2);

			if (toRepeatCount > 0) {
				startPlaceholder = endPlaceHolder = ' ';
				if ( (this.len - titleLen - 2) % 2 == 1 ) {
					endPlaceHolder += sign;
				}

				repeatStr = sign.repeat(toRepeatCount);
				startPlaceholder += obj.str;
			}
		} else {

		}

	}

	// type inset
	else {
		repeatStr = sign.repeat(this.len);

		// 一级标题
		startPlaceholder = positionStr(obj.str, obj.align, this.len)

		
		endPlaceHolder += '\n';
		startPlaceholder = '\n'+startPlaceholder;

		if (type === 'title') {
			if (!!this.subTitle) {
				endPlaceHolder = '\n' + positionStr(this.subTitle.str, this.subTitle.align, this.len) + '\n';
			}
		}

	}

	html += repeatStr + startPlaceholder + endPlaceHolder +repeatStr;
	

	return html;
}


// 获取头部
Log.prototype.getHead = function() {
	return this.output('title')
}

Log.prototype.getBody = function() {
	let html = '';
	let align = this.list.align;

	// 过滤 align
	align = /^(left|center|right)$/.test(align) ? align : 'left';


	if (this.list) {
		let lsitWidth = 0;
		// 标题
		if (this.list.title) {
			let titleStr  = '';
			lsitWidth = this.len / this.list.title.length;

			for (let val of this.list.title ) {
				titleStr += positionStr(val, align, lsitWidth)
			}

			html += '\n'+titleStr+'\n';
		}

		// 内容
		if (this.list.inner) {
			let listHtml = '';

			for (let l of this.list.inner) {
				for (let index in l) {

					// 只打印出标题的个数
					if (index < this.list.title.length) {
						let val = !l[index] ? '' : l[index];
						
						listHtml += positionStr(val, align, lsitWidth);
					}
				}
				listHtml += '\n';
			}

			html += listHtml;
		}
	}
	else {
		console.log('No List to Make!')
	}

	return html;
}

Log.prototype.init = function() {
	let html = '';
	html += this.getHead();
	html += this.getBody();

	console.log(html)
}



function positionStr(str, align, len, sign) {
	const strLen = getStrLen(str);
	let html = '';
	let _s = 0;
	sign = sign || ' ';

	switch (align) {
		/*
		=====================
		title
		=====================
		*/
		case "left":
			_s = Math.floor((len - strLen));
			html += str + sign.repeat( _s > 0 ? _s : 0 );
			break;

		/*
		=====================
		        title
		=====================
		*/
		case "center":
			_s = Math.floor((len - strLen)/2);
			let _r = sign.repeat( _s > 0 ? _s : 0 );
			html = _r + str + _r;
			break;

		/*
		====================
		               title
		====================
		*/	
		case "right":
			_s = len - strLen;
			html = ' '.repeat( _s > 0 ? _s : 0 ) + str;	
	}

	return html;
}

// 可以过滤出中文字符长度
function getStrLen(str) {
	return str.replace(/[^\x00-\xff]/g, '__').length;
}

// 文字溢出
function textOverflow(str, len) {
	// 文字过长隐藏
	if (getStrLen(str.length) > lsitWidth) {
		val = val.substring(0, lsitWidth - 4) + '...';
	}

	return str;
}

// log test
let a = new Log({
	title: {
		str: "hello world",
		align: "left",
		decoration: "inset"
	},
	len: 30
})
// a.init()


a = new Log({
	len: 60,
	title: {
		str: 'iServer 3.0',
		align: 'center',
		decoration: 'inset',
		sign: '-'
	},
	subTitle: {
		str: "lalalala...lalalala.....",
		align: "center",
	},
	list: {
		'inner': [ 
			[ "name", "logs"  ],
			[ "versionversionversionversion", "0.0.1", 'OK', 'xxxooo' ],
			[ "version", , 'OK' ]
		],
		'title': ['标题', '内容', '备注'],
		'align': 'left'
	}
})
a.init()


a = new Log({
	len: 60,
	title: {
		str: 'iServer 3.0',
		align: 'center',
		decoration: 'above',
		sign: '*-'
	},
	subTitle: {
		str: "lalalala...lalalala.....",
		align: "center",
	}
})

// a.init()