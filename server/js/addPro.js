/*
	个人中心
	------------------------------------
*/

$(function() {

	// 提交个人信息
	var btnTxt = '';
	
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
		// checkProName('blur')
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

});


/*
	设置显示错误
	-----------------------------------
*/
function setErr(ele, info) {
	ele.focus().next().text(info).parent().addClass('err');
}

