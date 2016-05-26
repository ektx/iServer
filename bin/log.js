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

	if (obj.decoration === 'above') {


		// 如果长度大于 0 则输出时添加优化效果
		if (this.len > titleLen) {

			let toRepeatCount = Math.floor( (this.len - titleLen -2) /2);

			if (toRepeatCount > 0) {
			console.log(toRepeatCount)
				startPlaceholder = endPlaceHolder = ' ';
				if ( (this.len - titleLen - 2) % 2 == 1 ) {
					endPlaceHolder += sign;
				}

				repeatStr = sign.repeat(toRepeatCount)
				console.log('s', repeatStr)
			}
		} else {

		}

	}

	// type inset
	else {
		repeatStr = sign.repeat(this.len);

		switch (obj.align) {
			/*
			=====================
			title
			=====================
			*/
			case "left":
				break;

			/*
			=====================
			        title
			=====================
			*/
			case "center":
				// startPlaceholder = Math.floor((this.len - titleLen)/2)
				// startPlaceholder = ' '.repeat( startPlaceholder > 0 ? startPlaceholder : 0 );
				startPlaceholder = positionStr(obj.str, 'center', this.len)
				break;

			/*
			====================
			               title
			====================
			*/
			case "right":
				startPlaceholder = this.len - titleLen;
				startPlaceholder = ' '.repeat( startPlaceholder > 0 ? startPlaceholder : 0 );

		}
		
		endPlaceHolder += '\n';
		startPlaceholder = '\n'+startPlaceholder;

		if (type === 'title') {
			console.log((!!this.subTitle))
			if (!!this.subTitle) {
				endPlaceHolder = '\n' + positionStr(this.subTitle.str, this.subTitle.align, this.len) + '\n';
			}
		}

	}

	html += repeatStr + startPlaceholder + obj.str + endPlaceHolder +repeatStr;
	

	return html;
}


// 获取头部
Log.prototype.getHead = function() {
	return this.output('title')
}


function positionStr(str, align, len, sign) {
	const strLen = str.length;
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
			html += str;
			break;

		/*
		=====================
		        title
		=====================
		*/
		case "center":
			_s = Math.floor((len - strLen)/2);
			html = ' '.repeat( _s > 0 ? _s : 0 ) + str;
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

// log test
// let a = new Log({
// 	title: {
// 		str: "hello world",
// 		align: "left",
// 		decoration: "inset"
// 	},
// 	len: 30
// })
let a = new Log({
	len: 60,
	title: {
		str: 'iServer 3.0',
		align: 'center',
		decoration: 'inset',
		sign: '*-'
	},
	subTitle: {
		str: "lalalala...lalalala.....",
		align: "center",
	}
})
// let a = new Log({
// 	subTitle: "+++",
// 	type: "above",
// 	sign: "=",
// 	len: 30
// })

console.log(a.getHead())