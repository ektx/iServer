$(function() {

	// 个人设置
	$('.project-set-mod > a').click(function(e){
		e.stopPropagation()

		$(this).next().find('ul').toggle().end().end()
		.parent('li').siblings().find('ul').hide()
	});


	// 点击页面时
	$('html').click(function( e ) {
		console.log(e.target);

		// 隐藏用户菜单
		$('.project-set-mod ul').hide()

	});


	$('html')
	.on('dragenter', function(e) {
		e.preventDefault();
		$('body').addClass('drag-files-enetr')
		console.log('xx00')
	})

	$('.drop-box')
	.on('dragover', function(e) {
		e.preventDefault();
	})
	.on('dragleave', function(e) {
		e.preventDefault();

		console.log('ee')
		$('body').removeClass('drag-files-enetr')

	})
	.on('drop', function(e) {
		e.preventDefault();
		$('body').removeClass('drag-files-enetr')

		console.log(e)
	})
})