var origin = [100, 550];

var tableData;
var bargraph = new Bar_Graph(origin, 600, 450);

function preload()
{
	createCanvas(800, 600);
	angleMode(RADIANS);
	background(250);
	//tableData = loadTable('OlympicAthletes_0.csv', 'header', 'csv');
	//bargraph.load(tableData);
	
	bargraph._axises[0].setMarkSlotsCount(10);
	bargraph._axises[0].showMark = false;
	bargraph._axises[0].setLabel(["", "USA", "Russia", "Germany", "Thai", "Greece"], 1);
	bargraph._axises[0].setLabelStyle([0, bargraph._axises[0].markWidth * 4], 0, constants.CENTER);
	bargraph._axises[0].showFirstMark = false;
	bargraph._axises[0].showLastMark = false;
	
	bargraph._axises[1].rotation = -Math.PI / 2;
	bargraph._axises[1].setMarkSlotsCount(10);
	bargraph._axises[1].markWidth = -5;
	bargraph._axises[1].setLabel(valueInterpolate(0, 1500, bargraph._axises[1].getMarkSlotsCount()), 1);
	bargraph._axises[1].setValueRange(0, 1500);
	bargraph._axises[1].setLabelStyle([-6, bargraph._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	bargraph._axises[1].showAxis = false;

	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [552, 234, 223], [255, 215, 0]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [320, 313, 223], [205, 127, 50]);
	bargraph.addBars(bargraph._axises[0], bargraph._axises[1], [440, 221, 183], [192, 192, 192]);
	
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

	bargraph.draw();
}