$(function() {

	// 个人设置
	$('.project-set-mod > a').click(function(){
		$(this).next().find('ul').toggle()
	})
})