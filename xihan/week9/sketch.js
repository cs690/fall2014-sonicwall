var origin1 = [100, 550];

var time = 0;

var a = new Axis(origin1, 500);

var b = new Axis(origin1, 500);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	
	
	a.setMarkSlotsCount(50);
	a.markWidth = 5;
	a.setLabel(valueInterpolate(0, 1500, a.getMarkSlotsCount()), 5);
	a.setValueRange(0, 1500);
	a.setLabelStyle([0, a.markWidth * 4], 0, constants.CENTER);
	a.showAxis = true;
	a.showFirstLabel = false;
	
	b.rotation = -Math.PI / 2;
	b.setMarkSlotsCount(12);
	b.markWidth = -5;
	b.setLabel(valueInterpolate(0, 240, b.getMarkSlotsCount()), 1);
	b.setValueRange(0, 240);
	b.setLabelStyle([-6, b.markWidth * 2], Math.PI / 2, constants.RIGHT);
	b.showAxis = true;
	
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
		
		//console.log(cx + " , " + cy);
	}
	else
	{
		//fill(255);
	}

	a.draw();
	b.draw();
}