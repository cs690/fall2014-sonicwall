var origin2 = [50, 550];
var time = 0;

var bargraph = new Bar_Graph(origin2, 720, 450);

var l = new Legend([590, 90]);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	
	bargraph._axises[0].setMarkCount(30);
	bargraph._axises[0].setDiscreteLabels(1, ["",0, 1,2,3,4,5,6,7,8,9,10,11,14,19,26,34,42,43,51,68,69,72,73,74,75,76,77,78,""]);
	bargraph._axises[0].setLabelStyle([0, bargraph._axises[0].markWidth * 4], 0, constants.CENTER);
	bargraph._axises[0].showMark = false;
	bargraph._axises[0].showFirstMark = false;
	bargraph._axises[0].showLastMark = false;
	
	bargraph._axises[1].setRotation(-Math.PI / 2);
	bargraph._axises[1].markWidth = -5;
	bargraph._axises[1].setMarkCount(12);
	bargraph._axises[1].setContinuousLabels(1, 0, 240);
	bargraph._axises[1].setLabelStyle([-6, bargraph._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	bargraph._axises[1].showAxis = false;
	
	console.log("in");
	
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,24,0,6,0,0,0,3,12,3,1,0,1,0,0,0,0,0,0,0,2,0,5,0,0,0,0,1], [227, 119, 194]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,169,0,0,2,0,0,0,0,0,0,0], [148, 103, 189]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [214, 39, 40]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,0,0,0,4,3,6,2,9,2,0,0,0,0,0,0,0,0,0,0,0,0,1,2,5,4,6,3], [44, 160, 44]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [64,92,22,44,107,73,104,7,35,14,14,1,0,4,4,4,12,0,2,7,27,19,64,69,69,5,24,5], [255, 127, 14]);	
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [43, 115, 47,23,71,74,19,0,18,8,0,0,0,0,0,0,4,0,0,6,8,4,32,44,16,0,0,4], [31, 119, 180]);

	///////////////////////////////////////////////////////
	
	console.log("in!!!");
	
	bargraph._dataLoadCompleted = true;
	
	l.addLegend("DNS", [31, 119, 180]);
	l.addLegend("HTTP", [255, 127, 14]);
	l.addLegend("HTTP/XML", [44, 160, 44]);
	l.addLegend("OCSP", [214, 39, 40]);
	l.addLegend("RTMP", [148, 103, 189]);
	l.addLegend("TLSv1", [227, 119, 194]);
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);

	bargraph.draw();
	
	l.draw();
}