$(function() {

	// 个人设置
	$('.project-set-mod > a').click(function(e){
		e.stopPropagation()

		$(this).next().find('ul').toggle().end().end()
		.parent('li').siblings().find('ul').hide()
	});


	//
	$('html').click(function( e ) {
		console.log(e.target);

		$('.project-set-mod ul').hide()

	})
})