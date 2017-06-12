/*
	socketEvent 
	-----------------------------------
	归属: tool
	说明: 用于存放 socket 事件
*/
function socket (io) {

	io.on('connection', (socket) => {
		socket.emit('hello iserver', { msg: 'welcome use iServer!'});
	})

}

module.exports = socket;