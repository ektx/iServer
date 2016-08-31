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
