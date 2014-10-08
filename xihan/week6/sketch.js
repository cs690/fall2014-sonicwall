var origin = [100, 550];

var tableData;
var bargraph = new Bar_Graph(origin, 600, 450);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	tableData = loadTable('OlympicAthletes_0.csv', 'header', 'csv');
	bargraph.load(tableData);
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

	bargraph.draw();
}