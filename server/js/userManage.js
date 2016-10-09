/*
	用户管理功能
	---------------------
*/

$(function() {

	// 添加用户
	$('form').myVerification({
		checkAll: false,
		done: function(data, option) {
			if (!data.success) {
				option.this.prev('.error-info').addClass('show').text(data.msg)
			} else {

				statusBar({
					ico: 'ok',
					title: '成功',
					msg: data.msg + ' 添加成功',
					btns: [
						{
							name: '好的'
						}
					]
				})
			}
		},
		fail: function(err) {
			$(this).prev('.error-info').show().text(err)
		},
		errBox: function(ele, info) {
			ele.parents('form').prev('.error-info').addClass('show').html(info)
		},
		errHide: function(ele) {
			ele.parents('form').prev('.error-info').removeClass('show')
		}		
	});

});

