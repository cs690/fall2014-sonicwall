var origin = [100, 550];

var a = new Axis(origin, 400);
var b = new Axis(origin, 400);

var l = new Single_Line(origin);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);

	////////////////////////////////////////
	
	a.markWidth = 5;//30,5,0,1500
	a.setMarkCount(20);
	a.setContinuousLabels(5, 0, 100);
	a.setLabelStyle([0, a.markWidth * 4], 0, constants.CENTER);
	a.showAxis = true;
	a.showFirstMark = false;
	a.showFirstLabel = false;
	
	b.rotation = -Math.PI / 2;
	b.scaleFactor = -1;
	b.markWidth = -5;
	b.setMarkCount(20);
	b.setContinuousLabels(5, 0, 80);
	b.setLabelStyle([-6, b.markWidth * 2], Math.PI / 2, constants.RIGHT);
	b.showAxis = true;
	b.showFirstMark = false;
	b.showFirstLabel = false;	
	
	///////////////////////////////////////////
	
	l.load(a, b, [[10,10], [20, 30], [25, 15], [35, 45], [50, 50], [65, 40], [80, 75], [95, 5]]);
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);
	a.draw();
	b.draw();
	l.draw();
}

function mouseClicked()
{
	console.log(a._mouseValue);
	console.log(b._mouseValue);	
}