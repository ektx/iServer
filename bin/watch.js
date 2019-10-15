const chokidar = require('chokidar')
const path = require('path')

// 标注监控完成
let isReady = false
let watchFiles = []
let socket = null
let watcher = null
let timer = null

function watchDir (addr, depth) {
  watcher = chokidar.watch(addr, {
    ignored: filePath => {
      if (
        ['.DS_Store', '.git', 'node_modules'].includes(filePath)
      ) {
        // console.log(filePath)
        return true
      }
    },
    depth
  })

  // 监听变化
  watcher.on('all', (evt, path) => {
    if (timer) clearTimeout(timer)
    // console.log(isReady)
    if (isReady) {
      // 输出变化
      console.log(evt.toUpperCase(), path)
      
      socket.emit('FileEvent', {
        type: evt,
        path
      })
    }

    timer = setTimeout(() => {
      isReady = true
    }, 100)
  })

  watcher.on('ready', () => {
    console.log('Ready')
    isReady = true
    // console.log(watcher.getWatched())
  })
}
 
exports.watchInit = function (io, level) {
  socket = io
  watchDir(process.cwd(), level)
}

exports.watchAdd = function (address) {
  console.log('Address')
  isReady = false
  watcher.add(address)
}
