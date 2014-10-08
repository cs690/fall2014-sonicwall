var origin1 = [100, 550];
var origin2 = [50, 1150];
var time = 0;

var scattergraph = new Scatter_Graph(origin1, 450, 450);

var bargraph = new Bar_Graph(origin2, 720, 450);

function preload()
{
	createCanvas(800, 1200);
	angleMode(RADIANS);
	background(250);
	
	scattergraph._axises[0].setMarkSlotsCount(50);
	scattergraph._axises[0].markWidth = 5;
	scattergraph._axises[0].setLabel(valueInterpolate(0, 1500, scattergraph._axises[0].getMarkSlotsCount()), 5);
	scattergraph._axises[0].setValueRange(0, 1500);
	scattergraph._axises[0].setLabelStyle([0, scattergraph._axises[0].markWidth * 4], 0, constants.CENTER);
	scattergraph._axises[0].showAxis = true;
	scattergraph._axises[0].showFirstLabel = false;
	
	scattergraph._axises[1].rotation = -Math.PI / 2;
	scattergraph._axises[1].setMarkSlotsCount(50);
	scattergraph._axises[1].markWidth = -5;
	scattergraph._axises[1].scaleFactor = -1;
	scattergraph._axises[1].setLabel(valueInterpolate(0, 1500, scattergraph._axises[1].getMarkSlotsCount()), 5);
	scattergraph._axises[1].setValueRange(0, 1500);
	scattergraph._axises[1].setLabelStyle([-6, scattergraph._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	scattergraph._axises[1].showAxis = true;
	
	scattergraph.AddScatter([100, 100]);
	scattergraph.AddScatter([150, 150]);
	scattergraph.AddScatter([300, 400]);
	scattergraph.AddScatter([500, 670]);
	scattergraph.AddScatter([760, 980]);
	scattergraph.AddScatter([990, 1200]);
	
	/////////////////////////////////////////////////////
	
	bargraph._axises[0].setMarkSlotsCount(30);
	bargraph._axises[0].showMark = false;
	bargraph._axises[0].setLabel(["",0, 1,2,3,4,5,6,7,8,9,10,11,14,19,26,34,42,43,51,68,69,72,73,74,75,76,77,78,""], 1);
	bargraph._axises[0].setLabelStyle([0, bargraph._axises[0].markWidth * 4], 0, constants.CENTER);
	bargraph._axises[0].showFirstMark = false;
	bargraph._axises[0].showLastMark = false;
	
	bargraph._axises[1].rotation = -Math.PI / 2;
	bargraph._axises[1].setMarkSlotsCount(12);
	bargraph._axises[1].markWidth = -5;
	bargraph._axises[1].setLabel(valueInterpolate(0, 240, bargraph._axises[1].getMarkSlotsCount()), 1);
	bargraph._axises[1].setValueRange(0, 240);
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
	if (mouseIsPressed)
	{
		//fill(0);
	}
	else
	{
		//fill(255);
	}
	
	scattergraph.draw();
	
	bargraph.draw();
	
	noStroke();
	textSize(14);
	textAlign(LEFT);
	fill([31, 119, 180]);
	rect(600,700,15,15);
	text("DNS",622,712);
	fill([255, 127, 14]);
	rect(600,725,15,15);
	text("HTTP",622,737);
	fill([44, 160, 44]);
	rect(600,750,15,15);
	text("HTTP/XML",622,762);
	fill([214, 39, 40]);
	rect(600,775,15,15);
	text("OCSP",622,787);
	fill([148, 103, 189]);
	rect(600,800,15,15);
	text("RTMP",622,812);
	fill([227, 119, 194]);
	rect(600,825,15,15);
	text("TLSv1",622,837);
	

}