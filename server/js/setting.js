/*
	个人中心
	------------------------------------
*/

$(function() {

	// 提交个人信息
	$('#profile').submit(function(e) {
		e.preventDefault();

		var _ico = $('[name="usrIco"]');
		var _name = $('[name="name"]');
		var _email = $('[name="email"]');
		var _subtn = $('[type="submit"]');

		if (!_name.val()) {
			_name.addClass('err').focus().next().text('用户名不能为空');
			return;
		}

		var formData = new FormData();
		formData.append('ico', $('[name="usrIco"]')[0].files[0])
		formData.append('name', _name.val())
		formData.append('email', _email.val())

		_subtn.attr('disabled', 'disabled')
		.find('span').text('提交中...')

		$.ajax({
			url: '/set/profile',
			type: 'post',
			data: formData,
			processData: false,
			contentType: false,
			dataType: 'json'
		})
		.done(function(data) {
			console.log(data)
			if (data.success) {
				_subtn.removeAttr('disabled')
				.find('span').text('保存修改')
			} else {
				location.href = data.msg.href
			}
		})
		.fail(function(err) {
			console.log(err)
		})
	});

	// 时时预览个人头像
	$('[type="file"]').change(function(e) {

		var reader = new FileReader();
		var file = e.target.files[0];

		reader.onload = function(file) {
			$('.set-usr-ico img').attr('src', reader.result)
		}

		if ( file ) {
			reader.readAsDataURL( file )
		}
	});

	// 当用户在输入时,移除错误信息提示
	$('input').keydown(function() {
		$(this).removeClass()
	});

	// 确认旧密码是否正确
	$('[name="oldpwd"]').blur(function() {
		var _ = $(this);
		var _val = _.val();

		if (_val) {
			$.ajax({
				url: '/checkPwd',
				type: 'post',
				data: {pwd: _val},
				dataType: 'json'
			})
			.done(function(json) {
				if (!json.success) {
					var appendRemind = '';
					// 提示要重新登录时
					if (json.msg.href) {
						appendRemind = '<a href="'+json.msg.href+'">登录</a>'
					}
					_.addClass('err').next().html(json.msg.txt+appendRemind)
				}
			})
			.fail(function(err) {
				_.addClass('err').next().text('500!')
			})
		}
	})

	// 密码修改提交功能
	$('#passwd').submit(function(e) {
		e.preventDefault();

		var _old = $('[name="oldpwd"]');
		var _new = $('[name="newpwd"]');
		var _new2 = $('[name="newpwd2"]');
		var _subtn = $('[type="submit"]');

		var setErr = function(ele, info) {
			ele.addClass('err').focus().next().text(info);
		}

		if ( $('.err').length > 0 ) {
			$('.err:first').focus();
			return;
		}

		if ( !_old.val() ) {
			setErr(_old, '旧密码不能为空!')
			return;
		}

		if (!_new.val() || !_new2.val() ) {
			if ( !_new.val() ) {
				setErr(_new, '密码不能为空!')
				return;
			} else {
				setErr(_new2, '确认密码不能为空!')
				return;
			}
		}

		if (_new.val() !== _new2.val()) {
			setErr(_new2, '密码不一致!')
			return;
		};

		_subtn.attr('disabled', 'disabled')
		.find('span').text('提交中...')

		$.ajax({
			url: '/set/passwd',
			type: 'post',
			data: {pwd: _new.val() },
			dataType: 'json'
		})
		.done(function(json) {
			if (json.success) {
				_subtn.removeAttr('disabled')
				.find('span').text('保存修改')
			} else {
				location.href = json.msg.href
			}
		})
		.fail(function(err) {
			console.log(err)
		})
	})
})