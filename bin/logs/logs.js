/*
	log 格式化console
	-----------------------------------
	ektx <530675800@qq.com>
*/

const logs = {
	outHTML : [],

	head : function(obj) {
		obj.width = obj.width || 20;
		obj.sign  = obj.sign || '=';
		let html  = '';

		// 过滤 text
		if (!obj.title) {
			obj.title = {
				content: "logs",
				align: "left",
				// inset || above
				decoration: "inset"
			}
		} else {
			obj.title.content = obj.title.content || "logs";
			obj.title.align = obj.title.align || "center";
			obj.title.decoration = obj.title.decoration || "inset";
		}

		// console.log(obj);
		this.outHTML.push( output (obj) )

		return this;

	},

	/*
	.list({
		content: [ 
			[ "content", "列表内容，数组形式"  ],
			[ "title", "标题" ],
			[ "algin", "对齐方式，可选 left, center, right" ],
			[ "width", "总列表宽度" ],
			[ "colspan", "分列数量" ]
		],
		title: ['List 说明'],
		align: 'center',
		width: 60,
		colspan: 2
	})
	*/
	list : function(obj) {
		let width = obj.width || 20;
		let align = obj.align;
		let html = '';
		// 行数
		let colspan = obj.colspan || 2;
		let listWidth = remainderVal = 0;

		let filterAlign = function(align) {
			return /^(left|center|right|justify)$/.test(align) ? align : 'left';
		}

		if (typeof width === 'number') {
			// 单元格宽度
			listWidth  = Math.floor(width / colspan);
			// 分栏余数; 12%2 = 2  _____+++++==
			remainderVal = Math.floor(width % colspan);			
		}
		
		// 过滤 align
		if (typeof align === 'string') align = filterAlign(align);

		if (obj.content) {

			// 标题
			if (obj.title) {
				let titleStr = '';
				let _align = align;

				for (let i = 0; i < colspan; i++) {
					if (i === colspan -1) {
						listWidth += remainderVal;
					}

					let val = !obj.title[i] ? '' : obj.title[i];

					// 两端对齐特殊效果
					if (obj.align === 'justify' || typeof obj.align === 'object') _align = 'left';

					titleStr += positionStr(textOverflow(val), _align, '', listWidth)
				}
				html += '\n' + titleStr;
			}

			// 列表
			if (obj.content) {
				let listHTML = '\n';

				for (let l of obj.content) {
					// 列数 = 标题的个数 或 自己的长度
					// let steps = !obj.title ? l.length : obj.title.length;
					for (let i = 0; i < colspan; i++) {
						// 过滤空值
						let val = !l[i] ? '' : l[i];
						let _align = align;

						// 两端对齐特殊效果
						if (obj.align === 'justify') {
							if (i == 0) _align = 'left' 
							else if (i == colspan -1)  _align = 'right'
							else _align = 'center'
						}

						// 自定义对齐
						if (typeof align === 'object') {
							_align = align[i]
						}

						// 自定义宽度
						if (typeof width === 'object') {
							listWidth = width[i]
						}

						listHTML += positionStr( textOverflow(val, listWidth), _align, '', listWidth);
					}
					listHTML += '\n';
				}

				html += listHTML;
			}
		}

		this.outHTML.push(html)
		return this;
	},

	show: function() {
		console.log(this.outHTML.join(''))
	}
}


// 格式化输出
function output (obj) {
	let repeatStr = '';
	let endPlaceholder = startPlaceHolder = '';
	let sign = obj.sign;
	let contLen = getStrLen(obj.title.content);

	if (sign.length > 1) {
		sign = sign.substr(0, 1)
	}

	if (obj.title.decoration === 'above') {

		if (obj.width > contLen) {
			// ----- text ------
			let repeatCount = Math.floor( (obj.width - contLen - 2) /2 );

			if (repeatCount > 0) {
				startPlaceHolder = endPlaceholder = ' ';

				// 对不是平分的内容，endPlaceHolder + sign
				if ( (obj.width - contLen -2) %2 == 1 ) {
					endPlaceholder += sign;
				}

				repeatStr = sign.repeat(repeatCount);
				startPlaceHolder += obj.title.content;
				// console.log(repeatStr, startPlaceHolder)
			}
		}
	}
	// decoration = inset
	else if (obj.title.decoration === 'inset') {
		repeatStr = sign.repeat(obj.width);

		startPlaceHolder = positionStr(obj.title.content, obj.title.align, ' ', obj.width);

		endPlaceholder += '\n';
		startPlaceHolder = '\n' + startPlaceHolder;

		// 输出二级标题
		if (!!obj.subTitle) {
			endPlaceholder = '\n' + positionStr(obj.subTitle.content, obj.subTitle.align, ' ', obj.width) + '\n';
		}
	}

	return repeatStr + startPlaceHolder + endPlaceholder + repeatStr; 

}

// 可以过滤出中文字符长度
function getStrLen(str) {
	return str.replace(/[^\x00-\xff]/g, '__').length;
}


// 文字溢出
function textOverflow(str, len) {
	// 文字过长隐藏
	if (getStrLen(str) > len) {
		str = substrs(str, len - 4) + '...';
	}
	return str;
}


function substrs(str, len) {
	let result = '';
	let _len = 0;

	for (let val of str) {
		if (/[^x00-\xff]/.test(val)) {
			_len += 2;
		} else {
			_len += 1;
		}

		if (_len <= len) {
			result += val;
		}
		else {
			break
		}

	}
// console.log(result, len)
	return result;
}

/*
	输出效果
	-----------------------------------------
	@str [string] 内容
	@align [left | center | right] 对齐方式
	@sign  [string] 修饰符
	@width [Number] 宽度
*/
function positionStr(str, align, sign, width) {
	let html = '';
	let _s = 0;
	const strLen = getStrLen(str);
	sign = sign || ' ';
	switch (align || 'left') {
		/*
		=====================
		title
		=====================
		*/
		case "left":
			_s = Math.floor((width - strLen));
			html += str + sign.repeat( _s > 0 ? _s : 0 );
			break;

		/*
		=====================
		        title
		=====================
		*/
		case "center":
			_s = Math.floor((width - strLen)/2);
			let _r = sign.repeat( _s > 0 ? _s : 0 );
			let _remainder = (width - strLen) %2;
			html = _r + str + _r + sign.repeat(_remainder);
			break;

		/*
		====================
		               title
		====================
		*/	
		case "right":
			_s = width - strLen;
			html = ' '.repeat( _s > 0 ? _s : 0 ) + str;	
	}

	return html;
}



module.exports = logs;
