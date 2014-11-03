var origin = [50, 550];

var Data_0 = [0, 4, 9, 15, 50, 78, 90, 105];
var Data_1 = [[10,10], [20, 30], [25, 15], [35, 45], [50, 50], [65, 40], [80, 75]];
var Data_2 = [[8,15], [22, 42], [28, 15], [31, 48], [35, 35], [59, 40], [65, 48]];

var g = new Graph_Prototype();

function preload()
{
	var cnv = createCanvas(800, 600);
	cnv.parent("myContainer");
	angleMode(RADIANS);
	background(250);
	
	var axisX = new Axis(origin, 700);
	axisX.markWidth = 5;//30,5,0,1500
	axisX.setMarkCount(70);
	axisX.setContinuousLabels(10, 0, 140);
	axisX.setLabelStyle([0, axisX.markWidth * 4], 0, constants.CENTER);
	axisX.showAxis = true;
	axisX.showFirstMark = false;
	//axisX.showFirstLabel = false;	

	var axisY = new Axis(origin, 500);
	axisY.setRotation(-Math.PI / 2);
	axisY.scaleFactor = -1;
	axisY.markWidth = -5;
	axisY.setMarkCount(50);
	axisY.setContinuousLabels(10, 0, 100);
	axisY.setLabelStyle([-6, axisY.markWidth * 2], Math.PI / 2, constants.RIGHT);
	axisY.showAxis = true;
	axisY.showFirstMark = false;
	axisY.showFirstLabel = false;

	g.addAxis(axisX);
	g.addAxis(axisY);
}

function addData(data)
{
	var d = new Data_Source("dynamic");
	d.setRawData(data);
	g.addDataSource(d);
}

function clearData()
{
	g.clearDataSources();
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);
	
	g.draw();
}

function mouseClicked()
{
	if(mouseX >= 0 && mouseX <= 800 && mouseY >= 0 && mouseY <= 600)
		g.getDataSources()[0].selectEntry(mouseX - origin[0], mouseY - origin[1]);
}