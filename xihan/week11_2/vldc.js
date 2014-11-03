if (!window.WebSocket)
{ 
	alert("WebSocket not supported by this browser!"); 
}

var _websocket_ = new WebSocket('ws://localhost:8080/', 'echo-protocol');

_websocket_.onopen = function (evt)
{
	console.log("ConnectedtoWebSocketserver.");		
}

_websocket_.onclose = function (evt)
{
	console.log("Disconnected");
}

_websocket_.onerror = function (evt)
{
	console.log('Erroroccured:' + evt.data);
}

_websocket_.onmessage = function (evt)
{
	console.log('Retrieveddatafromserver:' + evt.data);
	processData(evt.data);
}

var sendData = function (data)
{
	_websocket_.send(data);	
};

var processData = function (data)
{
	//TBI
	console.log("!!!");
};