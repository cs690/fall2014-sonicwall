var origin = [100, 550];

var Data_1 = [[10,10], [20, 30], [25, 15], [35, 45], [50, 50], [65, 40], [80, 75], [95, 5]];
var Data_2 = [[10,15], [17, 24], [30, 66], [45, 78], [49, 45], [60, 40], [75, 75], [80, 5]];

var lg = new Line_Graph(origin, 400, 400);

var vdo_1 = new Data_Organizer();
var vdo_2 = new Data_Organizer();

function preload()
{
	var cnv = createCanvas(800, 600);
	cnv.parent("myContainer");
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
	
	lg._axises[1].setRotation(-Math.PI / 2);
	lg._axises[1].scaleFactor = -1;
	lg._axises[1].markWidth = -5;
	lg._axises[1].setMarkCount(20);
	lg._axises[1].setContinuousLabels(5, 0, 100);
	lg._axises[1].setLabelStyle([-6, lg._axises[1].markWidth * 2], Math.PI / 2, constants.RIGHT);
	lg._axises[1].showAxis = true;
	lg._axises[1].showFirstMark = false;
	lg._axises[1].showFirstLabel = false;
	
	///////////////////////////////////////////
	
	vdo_1.bindGraph(lg);
	vdo_2.bindGraph(lg);
	
	vdo_1.setData(Data_1);
	vdo_2.setData(Data_2);
	
	lg.addLine(vdo_1.getData(), [239, 138, 98]);/**/
	
	lg.addLine(vdo_2.getData(), [103, 169, 207]);/**/
}

function setup()
{
	//stroke(0);
}

function draw()
{
	background(250);
	
	lg.draw();
	
	vdo_1.draw();
	//vdo_2.draw();
}

function mouseClicked()
{
	//console.log(lg._axises[0]._mouseValue);
	//console.log(lg._axises[1]._mouseValue);	

	//vdo._value_drawers[0].setValue(5);
	
	vdo_1.selectData(mouseX - 100, mouseY - 550);
	//vdo_2.selectData(mouseX - 100, mouseY - 550);
}