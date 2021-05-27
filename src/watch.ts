import chokidar from 'chokidar'

let isReady = false

function watch(path: string) {
  const watcher = chokidar.watch(path, {
    ignored: (filePath: string) => ['.DS_Store', '.git', 'node_modules'].includes(filePath)
  })

  watcher.on('change', path => {
    console.log(path)
  })

  watcher.on('ready', () => {
    isReady = true
    console.log(new Date(), 'ready...')
  })
}

console.log(new Date(), isReady) 

export {
  watch
}