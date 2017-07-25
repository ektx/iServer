/*
	生成文件业务
	------------------------------
*/

var listArr = document.querySelectorAll('.make-list li');
// 添加样式 
for (var i = 0, len = listArr.length; i < len; i++) {
	var className = listArr[i].innerHTML.replace(/.+\.(?=.+)/gi, '').replace(/\n/g, '');

	className = className.toLocaleLowerCase();
	switch (className) {
		case 'html':
		case 'jade':
		case 'ejs':
		case 'htm':
			className = 'html';
			break;

		case 'css':
		case 'js':
			break;

		default:
			className = 'other';
	}

	listArr[i].setAttribute('class', className)
}

// 切换事件
document.querySelector('.make-type-btns').addEventListener('click',function(e){
	// alert(this.innerHTML)
	if (!e.target.classList.contains('make-type-btns')) {
		// 除去之前的状态
		document.querySelector('.current').classList.remove('current');
		// 添加当前点击元素状态
		e.target.classList.add('current');

		var className = e.target.innerHTML.toLocaleLowerCase();

		NodeList.prototype.forEach = Array.prototype.forEach;
		document.querySelectorAll('.make-list li').forEach(function(e){

			if (className == 'all') {
				e.style.display = 'block';
				return;
			}

			if (!e.classList.contains(className)) {
				e.style.display = 'none';
			} else {
				e.style.display = 'block'
			}
		})
	}
})

// 文件列表
let filesBox = new Vue({
	el: '#my-app',
	components: {
		'file-li': {
			template: `<li :class="[ file.status ]">{{file.status}} {{file.name }} - {{file.path}}</li>`,
			props: ['file']
		}
	},
	data: {
		files: [],
		projectPath: '/iServerDemo/ejs/'
	},
	methods: {
		// 发送项目
		sendProject: v_sendProject
	}
});


let socket = io.connect('//localhost:9000');
let filesIndex = {};

socket.on('hello iserver', data => {
	console.warn(data)
});

// socket.on('generate info', data => {
// 	filesBox.files = data.msg;
// 	// console.warn(data)
// 	for (let i = 0, l = data.msg.length; i < l; i++) {

// 		filesIndex[data.msg[i].name] = i;
// 	}
// });

socket.on('generate_dir_event', data => {
	if (data.success) {
		console.log(data)
	}
})

socket.on('WILL_GENERATE_FILE', data => {
	console.log(data);

	filesIndex[data.file.path] = filesBox.files.length;
	filesBox.files.push( data.file );
})

socket.on('GENERATE_MAKE_FILE', data => {
	console.log(data);

	filesBox.files[ filesIndex[data.file.path] ].status = 'DONE'
})



/*
	发送生成项目路径
*/
function v_sendProject () {

	let getOutPath = (path) => {
		let _l = path.length;

		// 验证结尾是不是 / 结尾
		if (path.endsWith('/')) {
			path = `${path.substr(0, _l -1)}`
		}

		// 验证开头
		if (!path.startsWith('/')) {
			path = `/${path}`;
		}

		path = `${path}_HTML2/`;


		return path
	}

	this.files = [];

	socket.emit('start make project', {
		path: this.projectPath,
		out: getOutPath(this.projectPath)
	})
}
