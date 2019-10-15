const chokidar = require('chokidar')
const path = require('path')

// 标注监控完成
let isReady = false

module.exports = function (socket) {
  const watcher = chokidar.watch('/Users/zhuwenlong/Sites', {
    ignored: filePath => {
      // 忽略 node_modules文件
      if (filePath.includes('node_modules')) {
        return true
      }
      // 忽略 .*** 开头的文件 如.git
      // 注意 要保留 . 当前文件夹
      if (
        path.basename(filePath).startsWith('.') 
        && filePath.length > 1
      ) {
        return true
      }
    },
  })

  // 监听变化
  watcher.on('all', (evt, path) => {
    if (isReady) {
      // 输出变化
      console.log(evt, path)
      
      socket.emit('FileEvent', {
        type: evt,
        path
      })
    }
  })

  watcher.on('ready', () => {
    isReady = true
  })
}