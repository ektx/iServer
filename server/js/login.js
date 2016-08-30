/*
	登录js
	-------------------------------------
*/

$(function() {

	// 登录 注册 忘记密码切换功能
	$('.login-help a').click(function(e) {
		e.preventDefault()

		var _ = $(this);
		var _p = _.parents('.login-mod');
		var _class = _.attr('class');
		var _showC = 'login-current-mod';
		var boxData = {
			'toLogin': 'signIn-form',
			'toSignUp': 'signUp-form',
			'toGetPwd': 'forgot-form'
		}

		_p.removeClass(_showC)
		.siblings('#'+ boxData[_class]).addClass(_showC);
	})

	$('form').submit(function( e ) {
		
		e.preventDefault();

		$(this).myVerification({
			errBox: '.error-info',
			show: 'show',
			done: function(data) {
				if (!data.success) {
					$('.error-info').addClass('show').text(data.msg)
				} else {
					if (location.hash && location.hash.length > 9) {
						location.href = location.hash.substr(9)
					} else {
						location.href = data.msg
					}
				}
			},
			fail: function(err) {
				$(this).prev('.error-info').show().text(err)
			}
		})

	}).keyup(function(e) {
		$(this).myVerification({
			errBox: '.error-info',
			show: 'show'
		})
	})

});

$.fn.hasAttr = function(name) {
	var attr = this.attr(name)
	return typeof attr !== typeof undefined && attr !== false
}

$.fn.myVerification = function(options) {

	var _ = this;
	var data = {};
	var url = _.attr('action');
	var type = _.attr('method');

	console.log(event)

	var setError = function(it, ele, info) {
		if (options.show) {
			_.prev(ele).addClass(options.show).html(info)
		} else {
			_.prev(ele).html(info)
		}

		if (event.type === 'submit') {
			it.focus()
		}
	}

	var removeErr = function(ele) {
		if (options.show) _.prev(ele).removeClass(options.show);
		else _.prev(ele).html('')
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
			// if (_this.attr('type') === 'text' ) {
				if ( _val === '' ) {
					setError(_this, options.errBox, _placeholder + '不能为空')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (options.errBox) return false;
				} else {
					removeErr(_this)
				}

			// }

			// 邮箱验证
			if (_this.attr('type') === 'email' ) {
				if ( !/\w+@\w+\.\w+/.test(_val) ) {
					setError(_this, options.errBox, _placeholder + '格式不正确')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (options.errBox) return false;
				} else {
					removeErr(_this)
				}

			}

			// 密码验证
			if (_this.attr('type') === 'password' ) {
				if ( /\s/g.test(_val) ) {
					setError(_this, options.errBox, _placeholder + '不能出现空格')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (options.errBox) return false;
				} else {
					removeErr(_this)
				}

			}
		}

		console.log(_this.hasAttr('required'))
		console.log()

		data[_this.attr('name')] = _val;

	})

	$.ajax({
		url: url,
		type: type,
		dataType: 'json',
		data: data
	})
	.done(function(data) {
		if (options.done) options.done(data)
	})
	.fail(function(err){
		if (options.fail) options.fail(err)
	})
	

	console.log(url)
	console.log(type)
	console.log(data)
}