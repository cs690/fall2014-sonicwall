if (!window.WebSocket)
{ 
	alert("WebSocket not supported by this browser!"); 
}

var _websocket_ = {};

function createServer()
{
	_websocket_ = new WebSocket('ws://localhost:8080/');//, 'rawdata-input-protocol'

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
}

createServer();

function sendData(data)
{
	//JSON.stringify(data)
	_websocket_.send(data);
}

function processData(data)
{
	//TBI
	var data = JSON.parse(data);
	addData(data);
};

function connect()
{
	createServer();
}

function disconnect()
{
	_websocket_.close();
}