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

						if (oldSum) {

							SumEle.text('共有 '+oldSum+' 个文件')

							$(contextmenuObj.target.parentNode).hide()
							
						} else {
							location.reload()
						}

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
	// 新项目添加上传文件 -- 上传代码
	$('#hd-toUploadProFile, .project-list button').click(function(e) {
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

	// 上传项目文件功能
	$('#toUploadProFiles').change(function() {
		console.log(this.files.length)
		var _form = $(this).parents('form');
		var _files = '';

		if (this.files.length > 20) {
			alert('最多上传文件数为 20');
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
				setTimeout(function() {
					location.reload()
				}, 1100)
			},
			fail: function(err) {
				console.error(err)
			},
			progress: function(per) {
				var progressBar = $('.files-progress-bar-mod');

				progressBar.css({
					width: per * 100 + '%'
				});
				if (per === 1) {
					progressBar.addClass('hide')
				}
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

	statusBar({
		ico: 'ok',
		title: 'Hello World!',
		msg: 'lalalalala.....',
		btns: [
			{
				name: '确认',
				fun: function() {
					console.log('xxxooo')
				}
			},
			{
				name: '取消',
				fun: function() {
					console.error('xxx---')
				}
			}
		]
	})

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

		option = extendObj(option, options);
		// 支持只要一个按钮功能
		if (options.btns.length === 1) option.btns.pop();

		options = option;

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
				var _isFun = statusBarFun[_id][_name]

				console.log(_H)
				_p.height(_H)

				if (typeof _isFun === 'function') _isFun()
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
				text: '谢谢,不了!',
				fun: function() { ... }
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
		}, 20)

		if (typeof this.event === 'function') this.event()

	}

}








