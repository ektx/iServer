/*
	设置 HTML 根文字大小
	@ektx <530675800@qq.com>
	@v0.0.1
	------------------------------------
	用于解决移动端大小屏的问题
*/

(function () {
	var resizeRem = function() {
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        html.style.fontSize = windowWidth / 720*100 + 'px';
	}
    document.addEventListener('DOMContentLoaded', resizeRem, false);

    window.onresize = resizeRem;
})();