/*
	iMkdirs 3
	-----------------------------
	Copyright(c) 2017 ektx
	增加对地址数组功能的支持

 */

const fs = require('fs')
const path = require('path')


async function mkdirs(pathArr, parentPath, doneCallback, mkCallback) {
	console.log('iMkdirs')
	// delayPath = [];

	// let toPathArr = []

	// for (let i = 0, l = pathArr.length; i < l; i++) {
	// 	toPathArr.push(pathArr[i].to.replace(process.cwd(), ''))
	// }

	console.log('pathArr:',pathArr)

	let mkPathObj = array2tree(pathArr)

	console.log(JSON.stringify(mkPathObj, '', '\t'))

	let needMKDirArr = tree2array(mkPathObj)

	await loopEvt(needMKDirArr, parentPath, mkCallback)

	if (doneCallback) doneCallback()
	// console.log('Done!', x)
	// let todo = url => {
	// 	try {
	// 		let isMS = fs.mkdirSync(url)

	// 		if (!isMS) {
				
	// 			if(delayPath.length == 0) return;

	// 			// 反向调用地址列表
	// 			// 然后删除最初的那个
	// 			let _toPath = (delayPath.reverse())[0]
	// 			delayPath.shift()
	// 			todo(_toPath)
	// 		}
	// 	} catch(err) {

	// 		// 返回错误为无法生成时
	// 		if (err.code === 'ENOENT') {

	// 			delayPath.push(url);
	// 			let _path = path.dirname(url)
	// 			todo(_path)
	// 		}
	// 	}
		
	// }

	// for (let i = 0, l = pathArr.length; i < l; i++) {
	// 	todo(pathArr[i])
	// }

	// return true
}

module.exports = mkdirs;

/*
	将数组转换成对象
	['a/b/c', 'a/d']
	=>
	{
		a: {
			b: {
				c: {}
			},
			d: {}
		}
	}
*/
function array2tree (arr) {
	let obj = {}

	arr.forEach( (val,i) => {
		// console.log(typeof val, ' - ', val)
		let innerArr = val.split('/')
		let checkObj = obj

		innerArr.forEach((iVal, x, iarr) => {
			if (iVal !== '') {
				if (!(iVal in checkObj)) {
					checkObj[iVal] = {}
					checkObj[iVal].path = iarr.slice(0, x+1).join('/')
				}
				checkObj = checkObj[iVal]
			} 
		})
	})

	return obj
}

/*
	对象转数组
*/
function tree2array (obj) {
	let arr = []
	let loopObj = function(_o) {
		for (let [key, val] of Object.entries(_o)) {

			if (val.path)
				arr.push(val.path)

			if (typeof val === 'object') {
				loopObj(val)
			}
		}
	}
	
	loopObj(obj)

	return arr
}

/*
	循环事件
*/
async function loopEvt (arr, parent, mkCallback) {
	for (let val of arr) {
		await mkdirEvt(val, parent)
		if (mkCallback) mkCallback(val)
	}
}

/*
	@to 生成的目录
	@parent 父级目录
*/
function mkdirEvt (to, parent = process.cwd()) {
	return new Promise( (resolve, reject) => {
		// console.log('进程当前工作的目录:',process.cwd())
		let mkPath = path.join(parent, to)
		
		fs.mkdir(mkPath, err => {
			if (err) {
				reject(err)
				return
			}

			resolve()
		})
		
	}).catch(err => {
		return err
	})
}