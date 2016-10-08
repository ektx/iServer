/*
	用户管理功能
	---------------------
*/

$(function() {
	// 用户管理页面
	$('#my-user-pages').pagination({
		pages: 109, // 假定有10页
		prevText: '上一页',
		nextText: '下一页',
		onPageClick: function(pageNumebr) {
			
			console.log(pageNumebr);

		}
	});
})