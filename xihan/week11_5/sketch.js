var origin = [160, 750];

var Data_0 = [0, 4, 9, 15, 50, 78, 90, 105];
var Data_1 = [[10,10], [20, 30], [25, 15], [35, 45], [50, 50], [65, 40], [80, 75]];
var Data_2 = [[8,15], [22, 42], [28, 15], [31, 48], [35, 35], [59, 40], [65, 48]];

var g = new Graph_Prototype();
var t = {};
var dc = [];
var dc_m = [];
var ip = [];
var combine = [];

function preload()
{
	var cnv = createCanvas(800, 800);
	cnv.parent("myContainer");
	angleMode(RADIANS);
	background(250);
	
	t = loadTable("20141101-102407-1.csv", 'header');
	var c = t.getColumn("Time");
	
	ip = loadTable("individualip.csv", 'header');
	var ipl = ip.getColumn(0);
	
	var ts = new Date("UTC 11/01/2014 07:00:00").getTime();
	
	for(var i = 0; i < c.length; i++)
	{
		dc[dc.length] = new Date(c[i]);
	}
	
	for(var i = 0; i < dc.length; i++)
	{
		dc_m[dc_m.length] = (dc[i].getTime() - ts) / 60000;
	}
	
	//console.log(ipl);
	
	var te = new Date("UTC 11/01/2014 07:40:00").getTime();
	//console.log(ts - te);
	//console.log(te);
	//1414851141048
	//1414875494288
	
	var src = t.getColumn("Source");
	var des = t.getColumn("Destination");
	
	console.log(src);
	console.log(des);
	
	for(var i = 0; i < dc_m.length; i++)
	{
		combine[combine.length] = [dc_m[i], dc_m[i]];
	}
	
	var axisX = new Axis(origin, 600);
	axisX.markWidth = 5;//30,5,0,1500
	axisX.setMarkCount(40);
	axisX.setContinuousLabels(2, 0, 40);
	axisX.setLabelStyle([0, axisX.markWidth * 4], 0, constants.CENTER);
	axisX.showAxis = true;
	axisX.showFirstMark = false;
	//axisX.showFirstLabel = false;	
	
	var axisY = new Axis(origin, 700);
	axisY.setRotation(-Math.PI / 2);
	axisY.scaleFactor = -1;
	axisY.markWidth = -5;
	axisY.setMarkCount(50);
	axisY.setDiscreteLabels(1, ipl);
	axisY.setLabelStyle([-6, axisY.markWidth * 2], Math.PI / 2, constants.RIGHT);
	axisY.showMark = false;
	axisY.showAxis = true;
	axisY.showFirstMark = false;
	axisY.showFirstLabel = false;
	
	g.addAxis(axisX);
	g.addAxis(axisY);
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
	g.getDataSources()[0].selectEntry(mouseX - origin[0], mouseY - origin[1]);
}