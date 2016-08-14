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
			_name.addClass('err').focus();
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

	$('[type="file"]').change(function(e) {

		var reader = new FileReader();
		var file = e.target.files[0];

		reader.onload = function(file) {
			$('.set-usr-ico img').attr('src', reader.result)
		}

		if ( file ) {
			reader.readAsDataURL( file )
		}
	})
})