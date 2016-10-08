/*
	用户管理功能
	---------------------
*/

$(function() {
	// 用户管理页面
	var pageEle = $('#my-user-pages');
	if (pageEle.length){
		pageEle.pagination({
			pages: 109, // 假定有10页
			prevText: '上一页',
			nextText: '下一页',
			onPageClick: function(pageNumebr) {
				
				console.log(pageNumebr);

			}
		});
	}


	// 
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
	})
})