var scattergraph = new Scatter_Graph([100, 550], 450, 450);

function preload()
{
	createCanvas(800, 1200);
	angleMode(RADIANS);
	background(250);
	
	scattergraph._axises[0].setMarkCount(50);
	scattergraph._axises[0].markWidth = 5;
	scattergraph._axises[0].setContinuousLabels(5, 0, 1500);
	scattergraph._axises[0].setLabelStyle([0, scattergraph._axises[0].markWidth * 4], 0, constants.CENTER);
	scattergraph._axises[0].showAxis = true;
	scattergraph._axises[0].showFirstLabel = false;
	
	scattergraph._axises[1].setRotation(-Math.PI / 2);
	scattergraph._axises[1].setMarkCount(50);
	scattergraph._axises[1].markWidth = -5;
	scattergraph._axises[1].scaleFactor = -1;
	scattergraph._axises[1].setContinuousLabels(5, 0, 1500);
	scattergraph._axises[1].setLabelStyle([-6, scattergraph._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	scattergraph._axises[1].showAxis = true;
	
	scattergraph.AddScatter([100, 100]);
	scattergraph.AddScatter([150, 150]);
	scattergraph.AddScatter([300, 400]);
	scattergraph.AddScatter([500, 670]);
	scattergraph.AddScatter([760, 980]);
	scattergraph.AddScatter([990, 1200]);
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);
	scattergraph.draw();
}

function mouseClicked()
{
	console.log(scattergraph._axises[0]._mouseValue);
	console.log(scattergraph._axises[1]._mouseValue);	
}