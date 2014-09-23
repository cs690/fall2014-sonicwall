var center = [100, 500];

var axisV = new Axis(center, 600, -5);
axisV.rotation = -Math.PI/2;
axisV.setMark(120);

var axisH = new Axis(center, 400, 5);
axisH.setMark(6);

//
var bar1 = new Bar(local2GlobalPoint(center, axisH.rotation, axisH.markSlot[1]), 20, 200);
bar1.rotation = axisV.rotation;

var bar2 = new Bar(local2GlobalPoint(bar1.startPoint, bar1.rotation, bar1.topPoint), 20, 100);
bar2.rotation = axisV.rotation;

function setup()
{
	angleMode(RADIANS);
	createCanvas(800, 600);
}

function draw()
{
	background(255);
	if (mouseIsPressed)
	{
		//fill(0);
	}
	else
	{
		//fill(255);
	}
	
	axisV.draw();
	axisH.draw();
	
	bar1.draw();
	bar2.draw();
}

//Center means global center
//Local center always starts from [0, 0]
function local2GlobalPoint(center, rotation, localPoint)
{
	result = [];
	result[0] = center[0] + localPoint[0] * Math.cos(rotation) - localPoint[1] * Math.sin(rotation);
    result[1] = center[1] + localPoint[0] * Math.sin(rotation) + localPoint[1] * Math.cos(rotation);
	return result;
}

//Class Axis
function Axis(startPoint, length, markLength)
{
	//Attributes
	this.startPoint = [0, 0];
	this.length = 0;
	this.rotation = 0;
	this.markSide = "left";//"left", "right", "both"
	this.markSlot = [];
	this.markLength = 0;
	
	//Construction
	this.construct = function (startPoint, length, markLength)
	{
		this.startPoint = startPoint;
		this.length = length;
		this.startPoint = startPoint;
		this.markLength = markLength;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Axis.prototype.setMark = function (step)
		{
			var s = Math.round(this.length / step);
			var tx = 0;
			for(var i = 0; i < step; i++)
			{
				this.markSlot[i] = [i * s, 0];
			}
		}
		
		Axis.prototype.draw = function ()
		{
			strokeWeight(1);
			push();
			translate(this.startPoint[0], this.startPoint[1]);
			rotate(this.rotation);
			this._drawAxis();
			this._drawMark();
			pop();			
		}
		
		//
		Axis.prototype._drawAxis = function ()
		{
			line(0, 0, this.length, 0);
		};
		
		//
		Axis.prototype._drawMark = function ()
		{
			for( var i = 0; i < this.markSlot.length; i++)
			{
				push();
				translate(this.markSlot[i][0], this.markSlot[i][1]);
				line(0, 0, 0, this.markLength);
				pop();
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, length, markLength);
}

//Class Bar
function Bar(startPoint, width, height)
{
	//Attributes
	this.startPoint = [0, 0];
	this.topPoint = [0, 0];
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.color = [255, 255, 255];
	this.selected = true;
	
	//Constructor
	this.construct = function (startPoint, width, height)
	{
		this.startPoint = startPoint;
		this.width = width;
		this.height = height;
		this._updateTopPoint();
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
		
		Bar.prototype.setstartPoint = function (startPoint)
		{
			this.startPoint = startPoint;
		}
		
		Bar.prototype.setHeight = function (height)
		{
			this.height = height;
			this._updateTopPoint();
		}
		
		Bar.prototype._updateTopPoint = function ()
		{
			this.topPoint = [this.height, 0];
		}
		
		/*
		Bar.prototype._mouseInside = function ()
		{
			if(mouseX > this.startX && mouseX < this.startX + this._width && (mouseY > this.startY && mouseY < this.startY + this._height && this._height > 0 || mouseY < this.startY && mouseY > this.startY + this._height && this._height < 0)) return true;
			else return false;
		}
		*/
		
		Bar.prototype.draw = function ()
		{
			/*
			if(this._mouseInside()) fill(127);
			else fill(this.color[0], this.color[1], this.color[2]);
			rect(this.startX, this.startY, this._width, this._height);
			*/
			push();
			translate(this.startPoint[0], this.startPoint[1]);
			rotate(this.rotation);
			fill(127);
			rect(0, -this.width/2, this.height, this.width);
			pop();
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height);
}
