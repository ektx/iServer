/*
	iMkdirs 4
	-----------------------------
	Copyright(c) 2017 ektx
	增加对地址数组功能的支持

 */

const fs = require('fs')
const path = require('path')

/*
	@pathArr [array] 地址目录，例如：['a/b/c', 'a/d']
	@parentPath [string] 父级目录，例如： '/' 根目录 
	@doneCallback 【function】完成后回调方法
	@mkCallback [function] 每生成文件目录时回调方法
*/
async function mkdirs(pathArr, parentPath, doneCallback, mkCallback) {

	let mkPathObj = array2tree(pathArr)

	let needMKDirArr = tree2array(mkPathObj)

	await loopEvt(needMKDirArr, parentPath, mkCallback)

	if (doneCallback) doneCallback()

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