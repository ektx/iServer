$(function() {

	// 个人设置
	$('.project-set-mod > a').click(function(e){
		e.stopPropagation()

		$(this).next().find('ul').toggle().end().end()
		.parent('li').siblings().find('ul').hide()
	});


	// 点击页面时
	$('html').click(function( e ) {
		// console.log(e.target);

		// 隐藏用户菜单
		$('.project-set-mod ul').hide()

	});


	var contextmenuObj = '';
	
	// 右键自定义菜单
	document.addEventListener('contextmenu', function(e) {

		// 自定义菜单显示功能
		if (e.target.tagName !== 'HTML' && (e.target.parentNode.className === 'project-list' || e.target.parentNode.parentNode.className === 'project-list')) {

			var navmenu = document.getElementById('my-contextmenu-nav');

			if (e.target.tagName === 'A' && navmenu) {
				$('#my-contextnav-open, #my-contextnav-del').removeClass('not-used')
			} else {
				$('#my-contextnav-open, #my-contextnav-del').addClass('not-used')
			}

			contextmenuObj = e;

			if (navmenu) {
				e.preventDefault();
				navmenu.style.left = e.clientX + 'px';
				navmenu.style.top = e.clientY + 'px';
				navmenu.style.visibility = 'visible';			
			}

		} else {
			// 隐藏自定义菜单
			hideContextMenu()
		}

	})

	// DOM click事件
	document.documentElement.addEventListener('click', function() {
		// 隐藏自定义菜单
		hideContextMenu();
	});

	/*
		自定义菜单功能
		---------------------------------
	*/
	$('#my-contextmenu-nav').on('click', 'a', function(e) {
		switch (this.id) {
			// 打开新标签
			case 'my-contextnav-open':
				window.open(contextmenuObj.target.href);
				break;

			// 删除文件或文件夹
			case 'my-contextnav-del':
				$.ajax({
					url: '/myPro/file',
					type: 'delete',
					data: { file: contextmenuObj.target.pathname },
					dataType: 'json'
				})
				.done(function(data) {
					if (data.success) {
						var SumEle = $('.pro-fileSize');
						var oldSum = parseInt(SumEle.text().match(/\d+/)[0]) -1;

						SumEle.text('共有 '+oldSum+' 个文件')

						$(contextmenuObj.target.parentNode).hide()
					} else {
						alert(data.msg)
					}
				})
				.fail(function(err) {

				});

				break;

			// 上传文件功能
			case 'my-contextnav-upload':
				$('#toUploadProFiles').trigger('click');
				break;
		}
	});

	// 头部菜单 -- 上传代码
	$('#hd-toUploadProFile').click(function(e) {
		e.preventDefault();
		$('#toUploadProFiles').trigger('click');
	});


	// 创建文件夹功能
	$('#hd-toCreateDir').click(function(e) {
		e.preventDefault();

		var okEvent = function(e) {
			var int = $('#my-prompt-int');
			var val = int.val();

			console.log(val);

			if (!val) {
				myPrompt.error('不可以为空!');
				int.focus();
				return;
			}

			myPrompt.loading()

			$.ajax({
				url: '/create/myProDir',
				type: 'POST',
				data: {
					path: location.pathname,
					dirs: val
				},
				dataType: 'json'
			})
			.done(function(data){
				console.log(data)

				if (data.success) {
					myPrompt.cancel(function() {
						location.reload()
					})
				}
			})
			.fail(function(err) {
				myPrompt.error('创建错误!')
			})
			.always(function() {
				myPrompt.loading()
			})
		}

		myPrompt.init({
			msg: '输入文件夹名称:',
			input: ['text', '例如: root'],
			btns: [
				{
					text: '取消'
				},
				{
					text: '确认',
					fun: okEvent
				}
			]
		})

	})


	$('#toUploadProFiles').change(function() {
		console.log(this.files.length)
		var _form = $(this).parents('form');
		var _files = '';

		if (this.files.length > 5) {
			alert('最多上传文件数为 5');
			return;
		}

		_files = this.files;
		
		_form.myVerification({
			done: function(data) {
				console.log(data, _files)

				for (var i = 0, l= _files.length; i < l; i++) {
					console.log(_files[i].name)
				}

				// 刷新当前页面
				location.reload()
			},
			fail: function(err) {
				console.error(err)
			}
		})
		_form.submit()
	})


})

/*
	点击按钮效果
	==========================================
	@status {String} [loading|done|normal]
	@ele
	@txt 提示内容
*/
function btnSattus (ele, status, txt) {
	var load_svg = '<svg viewBox="0 0 230 230"><g class="circle-box"><circle class="circle-z loading" cx="117.351" cy="111.769" r="90"/></g></svg>';

	var Ok_svg = '<svg version="1.1" class="OK_SVG" viewBox="0 0 200 200"><polyline points="29.186,107.663 76.279,150.105 177.151,45 "/><animate attributeName="stroke-dasharray" begin="0s" dur="400ms" values="0,230; 230,0" repeatCount="1"></animate></svg>';

	if (status == 'loading') {
		if (!ele.hasClass('show')) {
			ele.addClass('show').attr('disabled', 'disabled')
			.find('.name').text(txt).end()
			.find('.ico').html(load_svg)
		}
	}
	else if (status == 'done') {

		ele.find('.ico').html(Ok_svg).next().html('完成');


		setTimeout(function() {
			ele.removeClass('show').removeAttr('disabled').find('.name').text(txt)
		}, 1000)
	}
	else if (status == 'normal') {
		ele.removeClass('show').find('.name').text(txt)
	}
}

/*
	判断是否存在某个属性
	=====================================
	eg: 
		<div id="test" title="hi"></div>
		$('#test').hasAttr('title') //=> true
*/
$.fn.hasAttr = function(name) {
	var attr = this.attr(name)
	return typeof attr !== typeof undefined && attr !== false
}

/*
	表单验证
	=====================================
	options:
	@checkAll: {true|false} 验证方式,默认为全部验证-[true]
	@errHide: {function} 当你使用了errBox功能为function时
	@errBox: {class|id|function} 用于存放错误显示的地方,
			 使用这个标签将会从头验证表单,发现
			 错误就会停止,直到此错误解决才会验证下一个
	@show:   {class} 此属性用于指定错误时,对错误标签上加的显示样式
	@done:   {function} 请求成功时处理内容
	@fail:   {function} 请求失败或错误时
	@always: {function} 加载时
	--------------------------------------
	eg:

*/
$.fn.extend({
	myVerification : function(options) {

	// var _ = $(this);
		var hasErr = false;

		var ajaxFun = function(option) {
			if (options.always) options.always(option);

			$.ajax(option)
			.done(function(data) {
				/*
					data:
					option: {
						data: {object} ajax提交数据
						dataType: {string} 字符串
						postData: {object} 提交数据
						this: {jq obj} 当前表单
						type: {string} ajax类型
						url:  {string} ajax地址
					}
				*/
				if (options.done) options.done(data, option)
			})
			.fail(function(err){
				console.error(err)
				if (options.fail) options.fail(err)
			})
		}

		// 查看是否相同
		var sameAs = function(ele) {
			var _val = ele.val();
			var result = false;

			var _name = ele.attr('sameAs');
			var _brothers = $('input[name="'+_name+'"]');
			if ( _val !== _brothers.val() ) {
				setError(ele, ' 请确认输入内容!')
				setError(_brothers, ' 请确认输入内容!')
				result = true;
			} else {
				removeErr(ele)
				removeErr(_brothers)
			}
			

			return result;
		}
	

		/*
		@it 当前错误元素
		@info 错误信息
		*/
		var setError = function(it, info) {

			var errType = typeof options.errBox;

			if (errType === 'function') {
				options.errBox(it, info)
			} 
			else if (errType === 'undefined') {
				if (options.show) {
					it.parent().addClass(options.show);
					if ( it.next().length > 0 ) {
						it.next().text(info)
					} else {
						it.after('<span class="err-info">'+info+'</span>')
					}
				} else {
					if ( it.next().length > 0 ) {
						it.next().show().text(info)
					} else {
						it.after('<span class="err-info">'+info+'</span>').show()
					}
				}
			}

			hasErr = true
		}

		var removeErr = function(it) {
			hasErr = false;

			var errType = typeof options.errHide;
			if (errType === 'function') {
				options.errHide(it)
			}
			else if (errType === 'undefined') {
				if (options.show) {
					it.parent().removeClass(options.show)
				} else {
					it.next().hide()
				}
			}
		}


	var checkedVal = function(options, event, _) {
		var data = {};
		var postData = {};
		var options = options || {};
		var url = _.attr('action');
		var type = _.attr('method');
		var checkAll = options.checkAll || true;
		var intFileSize = _.find('input[type="file"]').length;

		var ajaxOption = {
			url: url,
			type: type,
			dataType: 'json'
		};
		
		// 文件上传形式
		if (intFileSize > 0) {
			data = new FormData();
			ajaxOption.processData = false;
			ajaxOption.contentType = false;
		}

		_.find('input').each(function(e) {

			var _this = $(this);
			var _name = _this.attr('name');

			if (event.type === 'keyup' && event.target.name !== _name) {
				return true
			}

			var _val = $.trim(_this.val());
			var _placeholder = _this.hasAttr('placeholder') ? _this.attr('placeholder') : '';


			// 非空验证
			if (_this.hasAttr('required')) {

				// 当指定了显示错误的容器时,此时逐个验证信息
				if ( _val === '' ) {
					setError(_this, _placeholder + '不能为空')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (checkAll) return false;
				} else {
					removeErr(_this)
				}


				// 密码验证
				if (_this.attr('type') === 'password' ) {
					if ( /\s/g.test(_val) ) {
						setError(_this, _placeholder + '不能出现空格')
						// 当指定了显示错误的容器时,此时逐个验证信息
						if (checkAll) return false;
					} else {
						removeErr(_this)
					}

				}
			}

			// pattern 验证
			if (_this.hasAttr('pattern')) {
				if (_val.length> 0 || _this.hasAttr('required')) {
					var newReg = new RegExp(this.pattern);
					if ( !newReg.test(this.value) ) {
						setError(_this, this.title);
					}
				} else {
					removeErr(_this)
				}
			}


			// 邮箱验证
			if (_this.attr('type') === 'email' ) {
				if ( _val.length > 0 || _this.hasAttr('required') ) {
					if ( !/\w+@\w+\.\w+/.test(_val) ) {
						setError(_this, _placeholder + '格式不正确')
						// 当指定了显示错误的容器时,此时逐个验证信息
						if (checkAll) return false;
					} else {
						removeErr(_this)
					}
					
				} else if (_val.length == 0 && !_this.hasAttr('required')) {
					removeErr(_this)
				}
			}

			// 数据取值
			if (_this.attr('type') === 'file') {
				if(this.hasAttribute('multiple')) {
					for(var i = 0, l= this.files.length; i < l; i++){
						data.append(_this.attr('name'), this.files[i]);
					}
				} else {
					data.append(_this.attr('name'), this.files[0]);
				}

			} else {
				if (intFileSize > 0) {
					data.append(_this.attr('name'), _val)

				} else {
					// 单选取值
					if (_this.attr('type') === 'radio') {
						if (!_this.is(':checked')) return true;
					}
				
					data[_this.attr('name')] = _val;

				}
			}

			postData[_this.attr('name')] = _val;

			if (event.type === 'submit' && _this.hasAttr('sameAs')) {
				hasErr = hasErr ? hasErr : sameAs(_this)
			}

		}) // End each


		if (event.type === 'submit' && !hasErr) {
			ajaxOption.data = data;
			ajaxOption.postData = postData;
			ajaxOption.this = _;

			ajaxFun(ajaxOption)
		}

	};


	// Add novalidate tag if HTML5.
	this.attr( "novalidate", "novalidate" );

	// 事件绑定
	this.on('submit', function(e) {
		e.preventDefault();

		checkedVal(options, e, $(this))
	}).on('keyup', function(e) {
		e.preventDefault();
		
		checkedVal(options, e, $(this))
	}).on('blur', 'input', function(e){
		e.preventDefault();
		
		var _t = $(this);
		var _val = _t.val();

		if (_t.hasAttr('ver-url')) {
			var _url = _t.attr('ver-url');
			var _type = _t.attr('ver-type');
			var _name = _t.attr('ver-name');

			if (_url && _type && _name) {

				var toDate = {};
				toDate[_name] = _val

				$.ajax({
					url: _url,
					type: _type,
					data: toDate
				})
				.done(function(data) {
					if (options.verDone) options.verDone(data, _t, _name)
				})
				.fail(function(err){
					console.log(err)
				})
				
			} else {
				console.log('您丢失部分参数:')
				console.log('ver-url:  请求地址')
				console.log('ver-type: 请求类型')
				console.log('ver-name: 请求名称')
			}
			
		} 

		if (_t.hasAttr('sameAs')) sameAs(_t);
	})

}});

/*
	隐藏自定义右键菜单
	==============================================
*/
function hideContextMenu() {
	var navmenu = document.getElementById('my-contextmenu-nav');

	if (navmenu && navmenu.style.visibility == 'visible') {
		navmenu.style.visibility = 'hidden'
	}
}


/*
	合并对象
	-----------------------------------------
	@obj 要输出的对象
	@obj2 用来添加的对象
*/
function extendObj(obj, obj2) {

	var findObj = function(_obj, _obj2) {

		for (var key in _obj2) {

			if (typeof _obj2[key] == 'object') {
				if ( !_obj.hasOwnProperty(key) ) {

					_obj[key] = _obj2[key]
				} else {
					// get 组合过的
					_obj[key] = findObj(_obj[key], _obj2[key])
				}
				
			}
			else {
				_obj[key] = _obj2[key]
			}

		}

		return _obj
	}


	return findObj(obj, obj2)
}


/*
	statusBar
	===============================================
	状态信息
*/
function statusBar(options) {

	var createIcon = function(status) {
		var icon = {
			ok: '<svg class="success-status-icon" viewBox="0 0 80 80" ><circle cx="40" cy="40" r="30"/><path d="M22.511,43.532c0,0,9.096,9.311,13.554,9.361 c5.386,0.06,13.85-24.511,21.93-29.195"/>',
			warn: '<svg class="warning-status-icon" viewBox="0 0 80 80"><path d="M21.736,63.836c-5.5,0-7.75-3.897-5-8.66l20.257-35.086 c2.75-4.763,7.25-4.763,10,0l20.257,35.086c2.75,4.763,0.5,8.66-5,8.66H21.736z"/><path d="M42.813,46.792c0,0.453-0.367,0.82-0.82,0.82l0,0 c-0.453,0-0.82-0.367-0.82-0.82V27.354c0-0.453,0.367-0.82,0.82-0.82l0,0c0.453,0,0.82,0.367,0.82,0.82V46.792z"/><circle cx="41.993" cy="54.52" r="1.054"/>',
			err: '<svg class="error-status-icon" viewBox="0 0 80 80" style="display: block"><path d="M67.419,55.492c0,6.627-5.373,12-12,12H25.087 c-6.627,0-12-5.373-12-12V24.222c0-6.627,5.373-12,12-12h30.333c6.627,0,12,5.373,12,12V55.492z"/><line x1="23.773" y1="24.166" x2="58.902" y2="58.124"/><line x1="23.773" y1="58.124" x2="58.902" y2="24.166"/>'
		};
		
		return '<div class="status-icon">' + icon[status] + '</svg></div>'
	}

	var createBody = function(title, msg) {
		var _html = '<div class="status-info">' +
						'<h3>'+ title +'</h3>'  +
						'<p>' + msg   + '</p>'  +
					'</div>';

		return _html
	}

	var createBtns = function(id, btnArr) {
		var _html = '<div class="status-btns">';
		var _fun = {};
		for (var i = 0, l = btnArr.length; i < l; i++) {
			_html += '<button>' + btnArr[i].name + '</button>'

			_fun[btnArr[i].name] = btnArr[i].fun;
		}

		statusBarFun['statusBarNo'+id] = _fun
		_html += '</div>'

		return _html;
	}

	var init = function() {
		var option = {
			ico: 'ok',
			title: '',
			msg: '',
			btns: [
				{
					name: 'OK'
				},
				{
					name: 'Cancel'
				}
			]
		};
		var id = +new Date(); 

		options = extendObj(option, options)

		if (!window.statusBarFun) {
			window.statusBarFun = {};
		}

		var HTML = '<div id="statusBarNo'+id+'" class="status-bar-box"><div class="status-bar-inner show-status-bar">';
		var mainBox = $('#status-bar-mod');

		HTML += createIcon(options.ico);
		HTML += createBody(options.title, options.msg);
		HTML += createBtns(id, options.btns);
		HTML += '</div></div>'

		if ( mainBox.length === 1) {
			mainBox.append(HTML)
		} else {
			$('body').append('<aside id="status-bar-mod" class="status-bar-mod">' + HTML + '</div>');

			// 绑定事件
			$('#status-bar-mod').on('click', 'button', function(e) {
				var _ = $(this);
				var _p = _.parents('.status-bar-box')
				var _id = _p.attr('id');
				var _name = this.innerText;
				var _H =  _p.height();

				console.log(_H)
				_p.height(_H)

				statusBarFun[_id][_name]()
				_p.addClass('hide-status-bar')

				setTimeout(function() {
					_p.css({
						height: 0,
						padding: 0
					})
				}, 300)

				setTimeout(function() {
					_p.remove()
				}, 800)
			})
		}
	}

	init()
}

// statusBar({
// 	ico: 'ok',
// 	title: 'Hello World!',
// 	msg: 'lalalalala.....',
// 	btns: [
// 		{
// 			name: '确认',
// 			fun: function() {
// 				console.log('xxxooo')
// 			}
// 		},
// 		{
// 			name: '取消',
// 			fun: function() {
// 				console.error('xxx---')
// 			}
// 		}
// 	]
// })



/*
	提示功能
	===========================================================
	HTML结构:
	<div class="prompt-box" >
		<form class="prompt-body">
			<div class="prompt-body-header">
				<p>你要添加的文件夹名?</p>
			</div>
			<div class="prompt-form">
				<input type="text" placeholder="文件夹名">
			</div>
			<div class="prompt-footer">
				<div class="prompt-btns">
					<button class="err">Cancel</button>
					<button type="submit">OK</button>
				</div>
			</div>
		</form>
	</div>
	-----------------------------------------------------------
	示例:

	myPrompt.init({
		msg: '你好!你叫什么呀?',
		input: ['text', '在这里输入你的名字!'],
		btns: [
			{
				text: '谢谢,不了!'
			},
			{
				text: '好的!'
			}
		]
	})

	myPrompt.init({
		msg: '你好!请输入密码:',
		input: ['password', '密码!'],
		btns: [
			{
				text: '取消'
			},
			{
				text: '确认'
			}
		]
	})
	-----------------------------------------------------------
*/
var myPrompt = {
	options : {},

	// close windows || cancal windows
	cancel : function(callback) {
		$('.prompt-box').removeClass('show');

		if (callback && typeof callback === 'function') {
			setTimeout(function() {
				callback()
			}, 600)	
		}
	},

	ok : function() {
		console.log('OK')
	},

	loading: function() {

		var header = $('.prompt-body-header');

		if (header.hasClass('pdleft') ) {
			header.siblings('.prompt-footer').find('button').removeAttr('disabled')
		} else {
			header.siblings('.prompt-footer').find('button').attr('disabled', 'disabled')
		}

		header.toggleClass('pdleft')
	},

	error: function(errInfo) {
		var _hed = $('.prompt-body-header');
		var _err = _hed.find('.err');
		if (_err.length === 0) {
			_hed.append('<p class="err">'+errInfo+'</p>')
		} else {
			_err.text(errInfo)
		}
	},

	createHeader : function(msg) {
		return '<div class="prompt-body-header"><i></i><p>' + msg + '</p></div>'
	},

	createInt : function(type, placeholder) {

		if (!(type === 'text' || type === 'password')) {
			type = 'text'
		}

		return '<div class="prompt-form"><input id="my-prompt-int" type="'+type+'" placeholder="'+placeholder+'" autofocus></div>'
	},

	createFooter : function(cancel, ok) {
		var _html = '<div class="prompt-footer"><div class="prompt-btns">';
		_html += '<button class="err">'+cancel+'</button>'
		_html += '<button type="submit">'+ok+'</button>'

		_html += '</div></div>';

		return _html;
	},

	event: function() {

		var __ = this;

		$('body').on('click', '.prompt-btns button', function(e) {
			e.preventDefault();
			var _ = $(this);
			var _i = _.index();

			__.options.btns[_i].fun()
		})

		$('#my-prompt-int').keyup(function(e){
			e.preventDefault();

			if (e.which === 13) __.options.btns[1].fun()
			
		})

		__.event = null
			
	},

	init : function(options) {
		
		var html = '<div class="prompt-body">';
		var promptBox = $('.prompt-box');

		this.options = extendObj({
			msg: '',
			input: ['text', '在此输入内容'],
			btns: [
				{
					text: 'Cancel',
					fun: this.cancel
				},
				{
					text: 'OK',
					fun: this.ok
				}
			]
		}, options);

		var options = this.options;

		html += this.createHeader(options.msg);
		html += this.createInt(options.input[0], options.input[1]);
		html += this.createFooter(options.btns[0].text, options.btns[1].text);
		html += '</div>';

		if (!promptBox.length) {
			$('body').append('<div class="prompt-box" >'+html+'</div>');
		} else {
			promptBox.innerHTML = html
		}

		// show 
		setTimeout(function() {
			$('.prompt-box').addClass('show').find('input').focus()
		}, 0)

		if (typeof this.event === 'function') this.event()

	}

}








