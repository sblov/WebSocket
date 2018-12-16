const ws = require('nodejs-websocket');

// 基础的webSocket
// 可扩展使用socket.io

var server = ws.createServer(function(conn){

	console.log('New Connection');

	//对指定事件监听，当有文本发送时触发
	conn.on('text',function(str){
		console.log(str);
		// conn.sendText(str);
		// boardcast(str);
		// 解析json数据
		var data = JSON.parse(str);
		
		// 对当前数据的type判断
		switch(data.type){
			// 登录
			case 'login':
				conn.nickname = data.name;
				boardcast(JSON.stringify({
					name: 'Server',
					text: data.name + ' log in'
				}));
				break;
			// 发消息
			case 'chat':
				boardcast(JSON.stringify({
					name: conn.nickname,
					text: data.text					
				}));
				break;
			// 默认触发
			default:
				break;
		}
	});

	// 当有断开连接时触发
	conn.on('close',function(){
		boardcast(JSON.stringify({
			name: 'Server',
			text: conn.nickname + ' log out'
		}));
	});

	// 当有error时触发
	conn.on('error',function(err){
		console.log(err);
	});

	/*setTimeout(function(){
		conn.sendText('Server response Message');
	},3000);*/

}).listen(8088);

// 全局广播，对所有连接的用户进行广播
function boardcast(str){
	// 对每个连接
	server.connections.forEach(function(conn){
		conn.sendText(str);
	});
}