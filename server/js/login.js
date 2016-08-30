/*
	登录js
	-------------------------------------
*/

$(function() {

	// 登录 注册 忘记密码切换功能
	$('.login-help a').click(function(e) {
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

		var user = $('.login-usr-name input').val();
		var pwd = $('.login-usr-pwd input').val();

		var _ = $(this);
		var data = {};

		_.find('input').each(function(e) {
			var _this = $(this);

			data.[_this.attr('name')] = _this.val();
		})

		console.log(data)

		// if (user && pwd) {
		// 	$.ajax({
		// 		url: '/loginIn',
		// 		type: 'POST',
		// 		dataType: 'json',
		// 		data: {
		// 			user: user,
		// 			passwd: pwd
		// 		}
		// 	})
		// 	.done(function(data) {
		// 		if (!data.success) {
		// 			$('.error-info').addClass('show').text(data.msg)
		// 		} else {
		// 			if (location.hash && location.hash.length > 9) {
		// 				location.href = location.hash.substr(9)
		// 			} else {
		// 				location.href = data.msg
		// 			}
		// 		}
		// 	})
		// 	.fail(function(err){
		// 		$('.error-info').show().text(err)
		// 	})
			
		// } else {
		// 	$('.error-info').addClass('show').text( '用户名或密码不能为空' )
		// }

	})

});