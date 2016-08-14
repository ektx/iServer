$(function() {

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