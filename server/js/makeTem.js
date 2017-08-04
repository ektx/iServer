/*
	生成文件业务
	------------------------------
*/

// 文件列表
let filesBox = new Vue({
	el: '#my-app',
	components: {
		'file-li': {
			template: `<li :class="[ file.status ]"><i></i> {{file.name }} - {{file.path}}</li>`,
			props: ['file']
		}
	},
	data: {
		files: [],
		data: [],
		filter: 'all',
		projectPath: ''
	},
	watch: {
		files: function(newVal, oldVal){
			this.filterFiles()
		},
		filter: function(newVal, oldVal) {
			this.filterFiles()
		}
	},
	methods: {
		// 发送项目
		sendProject: v_sendProject,

		btnClick: function(e) {
			let text = e.target.innerText;
			this.filter = text.toLocaleLowerCase();
			// add hover class
			let lis = e.target.parentElement.querySelectorAll('li');

			lis.forEach(n=>{
				if (n.innerText === text) {
					n.classList.add('current')
				} else {
					n.classList.remove('current')
				}
			})
		},

		// 过虑显示功能
		filterFiles: function() {
			if (['html', 'js', 'css'].includes(this.filter)) {
				this.data = this.files.filter((val)=>{
					return val.outPath.endsWith(`.${this.filter}`)
				})
			} else {
				this.data = this.files;
			}

		}
	}
});


let socket = io.connect( location.origin );
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

	filesBox.files[ filesIndex[data.file.path] ].status = 'done'
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
