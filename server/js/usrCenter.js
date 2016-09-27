$(function() {

	var dropIsPage = false;

	// $('html')
	// .on('dragstart', function(e) {
	// 	console.log(e)
	// })
	// .on('dragenter', function(e) {
	// 	e.preventDefault();

	// 	console.log('xx00', e)
	// 	if (dropIsPage) return;

	// 	$('body').addClass('drag-files-enetr')
	// })
	// .on('drop', function(e) {
	// 	dropIsPage = false;
	// 	console.log(dropIsPage)
	// })

	var html = document.querySelector('html');
	html.addEventListener('dragstart', function(e) {

		dropIsPage = true;
		console.log(dropIsPage, e)

	}, false);
	html.addEventListener('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = 'move';

	}, false);
	html.addEventListener('dragenter', function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (dropIsPage) return;
		$('body').addClass('drag-files-enetr')
		dropIsPage = false;

	}, false);
	html.addEventListener('drop', function(e) {
		e.preventDefault();
		e.stopPropagation();

		dropIsPage = false;
		console.log(dropIsPage, e)

	}, false);

	$('.drop-box')
	.on('dragover', function(e) {
		e.preventDefault();
	})
	.on('dragleave', function(e) {
		e.preventDefault();

		console.log('ee')
		$('body').removeClass('drag-files-enetr')
		dropIsPage = false;

	})
	.on('drop', function(e) {
		e.preventDefault();
		$('body').removeClass('drag-files-enetr');

		dropIsPage = false;

		console.log(e)
	});


	// 格式化时间
	$('.project-list-mod time').each(function(e) {
		$(this).text( moment($(this).attr('title')).fromNow() )
	})
})