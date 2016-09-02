/*
	个人中心
	------------------------------------
*/

$(function() {

	// 提交个人信息
	$('#profile').submit(function(e) {
		e.preventDefault();

		$(this).myVerification({event: e})

// 		var _ico = $('[name="usrIco"]');
// 		var _name = $('[name="name"]');
// 		var _email = $('[name="email"]');
// 		var _subtn = $('.green-btn');

// 		if (!_name.val()) {
// 			_name.addClass('err').focus().next().text('用户名不能为空');
// 			return;
// 		}

// 		var formData = new FormData();
// 		formData.append('ico', $('[name="ico"]')[0].files[0])
// 		formData.append('name', _name.val())
// 		formData.append('email', _email.val())
// console.log(formData)
// 		_subtn.attr('disabled', 'disabled')
// 		.find('b i').hide().next().show().end()
// 		.find('span').text('提交中...')

// 		$.ajax({
// 			url: '/set/profile',
// 			type: 'post',
// 			data: formData,
// 			processData: false,
// 			contentType: false,
// 			dataType: 'json'
// 		})
// 		.done(function(data) {
// 			console.log(data)
// 			if (data.success) {
// 				_subtn.find('b i').hide().next().show();
// 				setTimeout(function() {
// 					_subtn.removeAttr('disabled')
// 					.find('span').text('保存修改')
// 				}, 5000)
// 			} else {
// 				location.href = data.msg.href
// 			}
// 		})
// 		.fail(function(err) {
// 			console.log(err)
// 		})
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

		// _subtn.attr('disabled', 'disabled')
		// .find('span').text('提交中...')
		btnSattus(_subtn, 'loading', '提交中...')

		$.ajax({
			url: '/set/passwd',
			type: 'post',
			data: {pwd: _new.val() },
			dataType: 'json'
		})
		.done(function(json) {
			if (json.success) {
				btnSattus(_subtn, 'done', '保存修改')
			} else {
				location.href = json.msg.href
			}
		})
		.fail(function(err) {
			console.log(err)
		})
	});


	// 添加项目
	function checkProName(type) {

		var reslut = true;
		var _name    = $('[name="pro-name"]');
		var _nameVal = $.trim(_name.val());
		var _private = $('[name="private"]:checked').val();

		if (!_nameVal) {
			if (type !== 'blur') {
				setErr(_name, '项目名称不可为空');
			}
			reslut = false;
		}
		else if ( !/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/g.test(_nameVal) ) {
			setErr(_name, '项目名称中只能使用 - 或 _')
			reslut = false;
		}

		if (reslut) {
			reslut = {
				name: _nameVal,
				private: _private
			}
		}

		return reslut;

	}

	$('[name="pro-name"]').blur(function() {
		checkProName('blur')
	})

	$('#add-project').submit(function(e){
		e.preventDefault();
		var _name = $('[name="pro-name"]');
		var _btn = $(this).find('.btn');
		var _btnTxt = _btn.find('.name').text();
		var getVal = checkProName();

		if (!getVal) return;

		btnSattus(_btn, 'loading', '加载中..') 

		$.ajax({
			url: '/addProject',
			type: 'POST',
			data: { name: getVal.name, private: getVal.private},
			dataType: 'json'
		})
		.done(function(json){
			if (json.success) {
				btnSattus(_btn, 'done', _btnTxt)
				setTimeout(function() {
					location.href = json.msg;
				}, 2000)
			} else {
				setErr(_name, json.msg);
				btnSattus(_btn, 'normal', _btnTxt)
			}

		})
		.fail(function(err) {
			setErr(_name, json.msg);
		})
	});



});


/*
	设置显示错误
	-----------------------------------
*/
function setErr(ele, info) {
	ele.addClass('err').focus().next().text(info);
}