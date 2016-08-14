$(function() {

	// 个人设置
	$('.project-set-mod > a').click(function(e){
		e.stopPropagation()

		$(this).next().find('ul').toggle().end().end()
		.parent('li').siblings().find('ul').hide()
	});


	// 点击页面时
	$('html').click(function( e ) {
		// console.log(e.target);

		// 隐藏用户菜单
		$('.project-set-mod ul').hide()

	});


})