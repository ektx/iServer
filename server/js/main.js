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

/*
	点击按钮效果
	==========================================
	@status {String} [loading|done|normal]
	@ele
	@txt 提示内容
*/
function btnSattus (ele, status, txt) {
	var load_svg = '<svg width="16" height="16" viewBox="0 0 230 230"><g class="circle-box"><circle class="circle-z loading" cx="117.351" cy="111.769" r="90"/></g></svg>';

	var Ok_svg = '<svg version="1.1" class="OK_SVG" width="16" height="16" viewBox="0 0 200 200"><polyline points="29.186,107.663 76.279,150.105 177.151,45 "/><animate attributeName="stroke-dasharray" begin="0s" dur="400ms" values="0,230; 230,0" repeatCount="1"></animate></svg>';

	if (status == 'loading') {
		if (!ele.hasClass('show')) {
			ele.addClass('show').attr('disabled', 'disabled')
			.find('.name').text(txt).end()
			.find('.ico').html(load_svg)
		}
	}
	else if (status == 'done') {

		ele.find('.ico').html(Ok_svg).next().html('完成');


		setTimeout(function() {
			ele.removeClass('show').find('.name').text(txt)
		}, 1000)
	}
	else if (status == 'normal') {
		ele.removeClass('show').find('.name').text(txt)
	}
}