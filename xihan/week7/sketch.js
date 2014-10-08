var origin = [100, 550];
var time = 0;

var scattergraph = new Scatter_Graph(origin, 450, 450);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
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
}