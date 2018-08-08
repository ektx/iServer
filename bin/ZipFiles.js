const JSZip   = require('jszip')
const fs = require('fs-extra')

/*
	压缩输出
	------------------------------
*/
module.exports = function (req, res) {

	let zipFilePathArr = [];
	let zipFolderPathArr = [];

	let dealWithPath = (_filePath) => {

		let statsData = fs.statSync(_filePath);
		let filter = ['.DS_Store'];
		
		if (statsData.isFile()) {
			if ( !/\.DS_Store/.test(_filePath) ){
				zipFilePathArr.push(_filePath);
			}
		} 
		else if (statsData.isDirectory()) {
			let files = fs.readdirSync(_filePath);

			zipFolderPathArr.push(_filePath);

			for(let i = 0, l = files.length; i < l; i++) {
				dealWithPath(path.join(_filePath, files[i]))
			}
		}

	}

	let addZipFile = () => {

		let zip = new JSZip();

		res.setHeader('Content-Type','application/zip');

		zipFilePathArr.forEach( file => {
			console.log(file)
			let stream = fs.createReadStream(file);
			file = file.replace(path.join(process.cwd(), req.body.filePath), '');
			zip.file(file, stream)
		})

		zipFolderPathArr.forEach( folder => {
			folder = folder.replace(path.join(process.cwd(), req.body.filePath), '');
			zip.folder(folder)
		})
	
		zip
		.generateNodeStream({type:'nodebuffer', streamFiles:true})
		.pipe(res)

	}

	// 取地址
	dealWithPath( path.join(process.cwd(), req.body.filePath) )
	// 压缩文件
	addZipFile();
	console.log( zipFilePathArr.length )
}