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
	});

	
	// 上传项目文件功能
	$('#toUploadProFiles').change(function() {
		console.log(this.files.length)
		var _form = $(this).parents('form');
		var _files = '';

		if (this.files.length > 20) {
			alert('最多上传文件数为 20');
			return;
		}

		_files = this.files;
		
		_form.myVerification({
			done: function(data) {
				console.log(data, _files)

				for (var i = 0, l= _files.length; i < l; i++) {
					console.log(_files[i].name)
				}

				// 刷新当前页面
				setTimeout(function() {
					location.reload()
				}, 1100)
			},
			fail: function(err) {
				console.error(err)
			},
			progress: function(per) {
				var progressBar = $('.files-progress-bar-mod');

				progressBar.css({
					width: per * 100 + '%'
				});
				if (per === 1) {
					progressBar.addClass('hide')
				}
			}
		})
		_form.submit()
	});


	// 更新代码功能
	$('.my-git-refresh').click(function() {
		$.ajax({
			url: '/pro/refreshgit',
			type: 'get'
		})
		.done(function(data){
			if (data.success) {
				location.reload()
			} else {
				if (data.href) {
					location.href = '/'
				}

					statusBar({
						ico: 'warn',
						title: 'Git 更新失败!',
						msg: data.msg
					})
			}
		})
		.fail(function(err) {
			console.log(err)
		})
	})

	
})