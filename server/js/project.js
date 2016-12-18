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


	var contextmenuObj = '';
	
	// 右键自定义菜单
	document.addEventListener('contextmenu', function(e) {

		// 自定义菜单显示功能
		if (e.target.tagName !== 'HTML' && (e.target.parentNode.className === 'project-list' || e.target.parentNode.parentNode.className === 'project-list')) {

			var navmenu = document.getElementById('my-contextmenu-nav');
			var isGit   = document.getElementById('isgitpro');
			var _navHTML = '';

			if (e.target.tagName === 'A' && navmenu) {
				// $('#my-contextnav-open, #my-contextnav-del').removeClass('not-used')
				var _ = e.target;
				var _href = _.pathname;
				var _text = _.innerText;

				_navHTML += '<a href="'+_href+'">查看</a>';
				_navHTML += '<a id="my-contextnav-del">删除</a>';
			} else {
				// $('#my-contextnav-open, #my-contextnav-del').addClass('not-used')
			}

			if (isGit) {
				_navHTML += '<hr class="split-line">';
				_navHTML += '<a class="my-git-refresh">更新代码</a>';
			} else {
				_navHTML += '<hr class="split-line">';
				_navHTML += '<a id="my-contextnav-upload">上传文件</a>';
			}


			contextmenuObj = e;

			if (navmenu) {
				e.preventDefault();
				
				navmenu.innerHTML = _navHTML;
				
				navmenu.style.left = e.clientX + 'px';
				navmenu.style.top = e.clientY + 'px';
				navmenu.style.visibility = 'visible';			
			}

		} else {
			// 隐藏自定义菜单
			hideContextMenu()
		}

	});


		/*
		自定义菜单功能
		---------------------------------
	*/
	$('#my-contextmenu-nav').on('click', 'a', function(e) {
		switch (this.id) {
			// 打开新标签
			// case 'my-contextnav-open':
				// window.open(contextmenuObj.target.href);
				// break;

			// 删除文件或文件夹
			case 'my-contextnav-del':
				$.ajax({
					url: '/myPro/file',
					type: 'delete',
					data: { file: contextmenuObj.target.pathname },
					dataType: 'json'
				})
				.done(function(data) {
					if (data.success) {
						var SumEle = $('.pro-fileSize');
						var oldSum = parseInt(SumEle.text().match(/\d+/)[0]) -1;

						if (oldSum) {

							SumEle.text('共有 '+oldSum+' 个文件')

							$(contextmenuObj.target.parentNode).hide()
							
						} else {
							location.reload()
						}

					} else {
						alert(data.msg)
					}
				})
				.fail(function(err) {

				});

				break;

			// 上传文件功能
			case 'my-contextnav-upload':
				$('#toUploadProFiles').trigger('click');
				break;
		}
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
			type: 'post',
			dataType: 'json',
			data: {
				name: $('h1').text().trim()
			}
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