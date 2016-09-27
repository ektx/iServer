const iconv = require('iconv-lite');

// IE 8 下出现乱码时检测方法:
// 1. 查看请求路径是否有中文
// 2.如果是中文,看看地址栏有没有被自动解析成了 GBK 编码,
//   如果是,那就改成未解析的中文请求


function parseURL (req, res, next) {
	let decodeURL = '';
	
	try {
		decodeURL = decodeURIComponent(req.originalUrl)
	} catch(e) {
		
		let convertUrl = (url)=> {
			// 匹配 GBK 编码内容
			let reg = /(\%\S\S)+/gi;

			let decodeStr = (str)=> {
				let arr = str.split('%');
				arr.shift();
				// 生成 Buffer 点位
				let buf = new Buffer(arr.length);
				// 为 Buffer 赋值
				arr.forEach((hex, i) => {
					let v = parseInt(hex, 16);
					buf[i] = v;
				});

				// 解析
				return iconv.decode(buf, 'gbk');
			};

			// 匹配出 GBK 内容
			let result = url.match(reg).sort().reverse();

			result.forEach(function(str){
				url = url.replace(str, decodeStr(str));
			});

			return url
		}

		decodeURL = convertUrl(req.originalUrl, 'gbk');
	}

	req.url= req.originalUrl = decodeURL;

	next()
}

module.exports = parseURL;