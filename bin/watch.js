const chokidar = require('chokidar')

// 标注监控完成
let isReady = false
let socket = null
let watcher = null
let timer = null
let initLevel = undefined

function watchDir (addr, depth = 99) {
  watcher = chokidar.watch(addr, {
    ignored: filePath => {
      if (
        ['.DS_Store', '.git', 'node_modules'].includes(filePath)
      ) {
        return true
      }
    },
    depth
  })

  // 监听变化
  watcher.on('all', (evt, path) => {
    if (timer) clearTimeout(timer)
    // 对首次加入监听的文件，不输出提示
    if (isReady) {
      // 输出变化
      console.log(evt.toUpperCase(), path)
      
      socket.emit('FileEvent', {
        type: evt,
        path
      })
    }

    // 如果文件加入监听后，对变化进行响应
    timer = setTimeout(() => {
      isReady = true
    }, 100)
  })

  watcher.on('ready', () => {
    console.log('Web Socket is Ready')
    isReady = true
    // console.log(watcher.getWatched())
  })
}
 
/**
 * 默认事件
 * @param {Socket} io 
 * @param {number} level 控制监听文件的层级
 */
exports.watchInit = function (io, level) {
  socket = io
  initLevel = level
  watchDir(process.cwd(), level)
}

exports.watchAdd = function (address) {
  // 如果用户开启的是监听访问目录时
  if (initLevel === 0) {
    isReady = false
    watcher.add(address)
  }
}
