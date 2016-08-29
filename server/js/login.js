/*
	登录js
	-------------------------------------
*/

$(function() {

	$('#signIn-form form').submit(function( e ) {
		
		e.preventDefault();

		var user = $('.login-usr-name input').val();
		var pwd = $('.login-usr-pwd input').val();

		if (user && pwd) {
			$.ajax({
				url: '/loginIn',
				type: 'POST',
				dataType: 'json',
				data: {
					user: user,
					passwd: pwd
				}
			})
			.done(function(data) {
				if (!data.success) {
					$('.error-info').addClass('show').text(data.msg)
				} else {
					if (location.hash && location.hash.length > 9) {
						location.href = location.hash.substr(9)
					} else {
						location.href = data.msg
					}
				}
			})
			.fail(function(err){
				$('.error-info').show().text(err)
			})
			
		} else {
			$('.error-info').addClass('show').text( '用户名或密码不能为空' )
		}

	})

});