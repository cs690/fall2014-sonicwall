var origin2 = [50, 550];
var time = 0;

var bargraph = new Bar_Graph(origin2, 720, 450);

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
	
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,24,0,6,0,0,0,3,12,3,1,0,1,0,0,0,0,0,0,0,2,0,5,0,0,0,0,1], [227, 119, 194]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,169,0,0,2,0,0,0,0,0,0,0], [148, 103, 189]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [214, 39, 40]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [0,0,0,0,4,3,6,2,9,2,0,0,0,0,0,0,0,0,0,0,0,0,1,2,5,4,6,3], [44, 160, 44]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [64,92,22,44,107,73,104,7,35,14,14,1,0,4,4,4,12,0,2,7,27,19,64,69,69,5,24,5], [255, 127, 14]);	
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [43, 115, 47,23,71,74,19,0,18,8,0,0,0,0,0,0,4,0,0,6,8,4,32,44,16,0,0,4], [31, 119, 180]);

	///////////////////////////////////////////////////////
	
	bargraph._dataLoadCompleted = true;
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);

	bargraph.draw();
	
	noStroke();
	textSize(14);
	textAlign(LEFT);
	fill([31, 119, 180]);
	rect(600,100,15,15);
	text("DNS",622,112);
	fill([255, 127, 14]);
	rect(600,125,15,15);
	text("HTTP",622,137);
	fill([44, 160, 44]);
	rect(600,150,15,15);
	text("HTTP/XML",622,162);
	fill([214, 39, 40]);
	rect(600,175,15,15);
	text("OCSP",622,187);
	fill([148, 103, 189]);
	rect(600,200,15,15);
	text("RTMP",622,212);
	fill([227, 119, 194]);
	rect(600,225,15,15);
	text("TLSv1",622,237);
	

}