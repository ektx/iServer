/*
	个人中心
	------------------------------------
*/

$(function() {

	// 提交个人信息
	var btnTxt = '';
	$('#profile, #passwd, #renamePro, #delPro').myVerification({
		show: 'err',
		always: function(postData) {
			btnTxt = postData.btn.text();

			btnSattus(postData.btn, 'loading', '提交中...')
		},
		done: function(data, postData) {
			console.log(postData)

			switch (postData.url) {
				// 更新项目名称或隐私
				case '/updateProSettings':
					var newName = postData.data.proName;
					$('.os-header h1 a').text(newName).attr('href', '../'+newName+'/');
					$('input[name="oldName"]').val(newName)

					break;

				// 删除当前项目
				case '/deleteMyPro':
					setTimeout(function() {
						location.href = '/'
					}, 1000)

					break;

				default:


					var ico = $('.set-usr-ico img').attr('src');
					var oldIco = $('.hd-usr-ico img').attr('src');
					var oldName = $('.hd-usr-name');
					
					if (ico !== oldIco) {
						$('.hd-usr-ico img').attr('src', ico)
					}

					if (oldName.text() !== postData.postData.name) {
						oldName.text(postData.postData.name).attr('title', postData.postData.name)
					}
			}

			btnSattus( postData.btn, 'done', btnTxt)
				
		},
		// 失去焦点时
		verDone: function(data, ele, name){
			if (name === 'pwd') {

				if (!data.success) {

					var appendRemind = '';
					// 提示要重新登录时
					if (data.msg.href) {
						appendRemind = '<a href="'+data.msg.href+'">登录</a>'
					}

					ele.parent().addClass(this.show).end().next().text(data.msg.txt+appendRemind)
				} else {
					ele.parent().removeClass(this.show)
				}
			}
		}
	})


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


	// 密码修改提交功能
	$('#passwd2').submit(function(e) {
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
		var _name    = $('[name="name"]');
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

	$('#add-project [name="name"]').blur(function() {
		checkProName('blur')
	})

	/*
		添加项目 提交时验证
		--------------------------------
	*/
	$('#add-project').myVerification({
		// 
		show: 'err',
		always: function(postData) {
			btnTxt = postData.btn.text();
			btnSattus(postData.btn, 'loading', '加载中..') 
		},
		done: function(json, postData) {
			if (json.success) {
				btnSattus(postData.btn, 'done', btnTxt)
				setTimeout(function() {
					location.href = json.msg;
				}, 2000)
			} else {
				setErr($('[name="name"]'), json.msg);
				btnSattus(postData.btn, 'normal', btnTxt)
			}
		},
		fail: function(err) {
			console.log(err)
		}
	})


	$('#mySMTP').myVerification({
		// 错误显示 
		show: 'err',
		always: function(postData) {
			btnTxt = postData.btn.text();

			btnSattus(postData.btn, 'loading', '提交中...')
		},
		done: function(data, postData) {

			btnSattus( postData.btn, 'done', btnTxt)
				
		},
		fail: function(err) {
			console.log(err)
		}
	});


});


/*
	设置显示错误
	-----------------------------------
*/
function setErr(ele, info) {
	ele.focus().next().text(info).parent().addClass('err');
}

