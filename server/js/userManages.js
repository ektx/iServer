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


	// 
	getUserList(0)
});


function getUserList(page) {
	$.ajax({
		url: '/getUserList',
		type: 'POST',
		dataType: 'json',
		data: { page: page, limit: 10 }
	})
	.done(function(data) {
		console.log(data);

		$('#usr-list-count').text(data.count);

		// 用户管理页面
		var page = $('#my-user-pages');
		if ( !page.hasClass('light-theme') ) {
			page.pagination({
				items: data.count, // 假定有10页
				itemsOnPage: 10,
				prevText: '上一页',
				nextText: '下一页',
				onPageClick: function(pageNumebr) {
					
					getUserList(pageNumebr -1)

				}
			});
		}

		var html = '';

		for (var i =0, l = data.msg.length; i < l; i++) {
			var _t = data.msg[i];
			html += '<li><div class="usr-icon-box">';
			html += 	'<a href="#" class="usr-photo-box border-radius-box">';
			html += 		'<img src="'+_t.ico+'" alt="'+_t.name+'">';
			html += 	'</a><p class="name">'+_t.act+'</p>';
			html += 	'</div><nav class="usr-manage-nav">';
			html +=	'<a href="/'+_t.act+'" target="_blank">访问其主页</a>'
			html +=	'<a href="/'+_t.act+'/set/passwd" target="_blank">密码重置</a>'
			html += '<a href="#" target="_blank">发送邮件</a>'
			html +=	'<a href="#">权限设置</a><hr class="split-line">'
			html +=	'<a href="#">删除用户</a></nav></li>'
		}

		$('#z-web-users').html( html )

	})
	.fail(function(err){
		console.error(err)
	})
}
