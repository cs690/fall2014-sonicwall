var origin = [100, 550];

var lg = new Line_Graph(origin, 400, 400);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);

	////////////////////////////////////////
	
	lg._axises[0].markWidth = 5;//30,5,0,1500
	lg._axises[0].setMarkCount(20);
	lg._axises[0].setContinuousLabels(5, 0, 100);
	lg._axises[0].setLabelStyle([0, lg._axises[0].markWidth * 4], 0, constants.CENTER);
	lg._axises[0].showAxis = true;
	lg._axises[0].showFirstMark = false;
	lg._axises[0].showFirstLabel = false;
	
	lg._axises[1].rotation = -Math.PI / 2;
	lg._axises[1].scaleFactor = -1;
	lg._axises[1].markWidth = -5;
	lg._axises[1].setMarkCount(20);
	lg._axises[1].setContinuousLabels(5, 0, 100);
	lg._axises[1].setLabelStyle([-6, lg._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	lg._axises[1].showAxis = true;
	lg._axises[1].showFirstMark = false;
	lg._axises[1].showFirstLabel = false;	
	
	///////////////////////////////////////////
	
	lg.addLine([[10,10], [20, 30], [25, 15], [35, 45], [50, 50], [65, 40], [80, 75], [95, 5]]);
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);
	lg.draw();
}

function mouseClicked()
{
	console.log(lg._axises[0]._mouseValue);
	console.log(lg._axises[1]._mouseValue);	
}