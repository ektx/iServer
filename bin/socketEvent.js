/*
	socketEvent 
	-----------------------------------
	归属: tool
	说明: 用于存放 socket 事件
*/

module.exports = function (io) {
	io.on('connection', (socket) => {
		socket.emit('HELLO_WORLD', { msg: 'Welcome Use iServer!'})
	})
}