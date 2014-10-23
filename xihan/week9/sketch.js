var origin = [100, 550];

var time = 0;

var a = new Axis(origin, 600);
var b = new Axis(origin, 400);
//var c = new Axis(origin, 300);
var l = new Label([0,0], "");

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	
	a.markWidth = 5;//30,5,0,1500
	a.setMarkCount(30);
	a.setContinuousLabels(5, 0, 1500);
	a.setLabelStyle([0, a.markWidth * 4], 0, constants.CENTER);
	a.showAxis = true;
	a.showFirstMark = false;
	a.showFirstLabel = false;
	
	b.rotation = -Math.PI / 3;
	b.markWidth = -5;
	b.setMarkCount(20);
	b.setDiscreteLabels(2, ["","a","b","c","d","e","f","g","h","i"]);
	b.setLabelStyle([-6, b.markWidth * 2], Math.PI / 2, constants.RIGHT);
	b.showAxis = true;
	b.showFirstMark = false;
	b.showFirstLabel = false;
	
	textSize(20);
	
	/*
	c.rotation = Math.PI *4 / 3;
	c.markWidth = -5;
	c.setMarkCount(12);
	c.setContinuousLabels(1, 0, 240);
	c.setLabelStyle([-6, c.markWidth * 2], Math.PI / 2, constants.RIGHT);
	c.showAxis = true;
	c.showFirstMark = false;
	c.showFirstLabel = false;
	*/
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
	//c.draw();
	noStroke();
	text(a._projectValue + " , " + b._projectValue, mouseX, mouseY);
}

function mouseClicked()
{
	console.log(a._mouseValue);
	console.log(b._mouseValue);	
}