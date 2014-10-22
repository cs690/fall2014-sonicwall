var origin1 = [100, 550];

var time = 0;

var a = new Axis(origin1, 600);

var b = new Axis(origin1, 400);

var c = new Axis(origin1, 300);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	
	a.markWidth = 5;//30,5,0,1500
	a.markContinuousValues(30, 5, 0, 1500);
	a.setLabelStyle([0, a.markWidth * 4], 0, constants.CENTER);
	a.showAxis = true;
	a.showFirstMark = false;
	a.showFirstLabel = false;
	
	b.rotation = -Math.PI / 3;
	b.markWidth = -5;
	b.markDiscreteValues(20, 2, ["","a","b","c","d","e","f","g","h","i"]);
	b.setLabelStyle([-6, b.markWidth * 2], Math.PI / 2, constants.RIGHT);
	b.showAxis = true;
	b.showFirstMark = false;
	b.showFirstLabel = false;
	
	/*
	c.rotation = Math.PI *4 / 3;
	c.setMarkCount(12);
	c.markWidth = -5;
	c.setLabel(valueInterpolate(0, 240, c.getMarkSlotsCount()), 1);
	c.setValueRange(0, 240);
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
	if (mouseIsPressed)
	{
		//fill(0);
		console.log(a._projectValue);
		console.log(b._projectValue);
	}
	else
	{
		//fill(255);
	}

	a.draw();
	b.draw();
	
	//c.draw();
	//*/
}