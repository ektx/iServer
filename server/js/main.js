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

/*
	判断是否存在某个属性
	=====================================
	eg: 
		<div id="test" title="hi"></div>
		$('#test').hasAttr('title') //=> true
*/
$.fn.hasAttr = function(name) {
	var attr = this.attr(name)
	return typeof attr !== typeof undefined && attr !== false
}

/*
	表单验证
	=====================================
	options:
	@errBox: {class|id} 用于存放错误显示的地方,
			 使用这个标签将会从头验证表单,发现
			 错误就会停止,直到此错误解决才会验证下一个
	@show:   {class} 此属性用于指定错误时,对错误标签上加的显示样式
	@done:   {function} 请求成功时处理内容
	@fail:   {function} 请求失败或错误时
	@always: {function} 加载时
	--------------------------------------
	eg:

*/
$.fn.myVerification = function(options) {

	var _ = this;
	var data = {};
	var options = options || {};
	var url = _.attr('action');
	var type = _.attr('method');
	var hasErr = false;
	var errBox = options.errBox ? options.errBox : false;
	var intFileSize = _.find('input[type="file"]').length;

	console.log(event);

	var ajaxOption = {
		url: url,
		type: type,
		dataType: 'json'
	};

	var setError = function(it, ele, info) {
		if (options.show) {
			_.prev(ele).addClass(options.show).html(info)
		} else {
			_.prev(ele).html(info)
		}

		if (event.type === 'submit') {
			it.focus()
		}

		hasErr = true;
	}

	var removeErr = function(ele) {
		if (options.show) _.prev(ele).removeClass(options.show);
		else _.prev(ele).html('')
	}
	
	// 文件上传形式
	if (intFileSize > 0) {
		data = new FormData();
		ajaxOption.processData = false;
		ajaxOption.contentType = false;
	}

	_.find('input').each(function(e) {

		var _this = $(this);
		var _name = _this.attr('name');

		if (event.type === 'keyup' && event.target.name !== _name) {
			return true
		}

		var _val = $.trim(_this.val());
		var _placeholder = _this.hasAttr('placeholder') ? _this.attr('placeholder') : '';


		// 非空验证
		if (_this.hasAttr('required')) {

			// 当指定了显示错误的容器时,此时逐个验证信息
			if ( _val === '' ) {
				setError(_this, errBox, _placeholder + '不能为空')
				// 当指定了显示错误的容器时,此时逐个验证信息
				if (errBox) return false;
			} else {
				removeErr(_this)
			}

			// 邮箱验证
			if (_this.attr('type') === 'email' ) {
				if ( !/\w+@\w+\.\w+/.test(_val) ) {
					setError(_this, errBox, _placeholder + '格式不正确')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (errBox) return false;
				} else {
					removeErr(_this)
				}

			}

			// 密码验证
			if (_this.attr('type') === 'password' ) {
				if ( /\s/g.test(_val) ) {
					setError(_this, errBox, _placeholder + '不能出现空格')
					// 当指定了显示错误的容器时,此时逐个验证信息
					if (errBox) return false;
				} else {
					removeErr(_this)
				}

			}
		}

		// 数据取值
		if (_this.attr('type') === 'file') {

			console.log(_this[0].files[0])

			data.append(_this.attr('name'), _this[0].files[0]);
console.log(data)

		} else {
			if (intFileSize > 0) {
				data.append(_this.attr('name'), _val)
console.log(data)

			} else {
				data[_this.attr('name')] = _val;
			}
		}


	})
console.log(data)
	if (event.type === 'submit' && !hasErr) {

		ajaxOption.data = data;
		$.ajax(ajaxOption)
		.done(function(data) {
			if (options.done) options.done(data)
		})
		.fail(function(err){
			if (options.fail) options.fail(err)
		})
	}

}