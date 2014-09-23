var center = [100, 500];

var axisV = new Axis(center, 450, -5);
axisV.rotation = -Math.PI/2;
axisV.setMark(25);
//axisV.showAxis = false;
axisV.showFirstMark = true;

var axisH = new Axis(center, 600, 5);
axisH.setMark(6);
axisH.showMark = false;

//
var bar1 = new Bar(local2GlobalPoint(center, axisH.rotation, axisH.markSlot[1]), 20, 200);
bar1.rotation = axisV.rotation;
bar1.color = [255,215,0];

var bar2 = new Bar(local2GlobalPoint(bar1.startPoint, bar1.rotation, bar1.topPoint), 20, 100);
bar2.rotation = axisV.rotation;
bar2.color = [192,192,192];

var bar3 = new Bar(local2GlobalPoint(bar2.startPoint, bar2.rotation, bar2.topPoint), 20, 50);
bar3.rotation = axisV.rotation;
bar3.color = [205,127,50];

var tag = new Tag([100, 500], 60, 80);
tag.rotation = -Math.PI/2;
tag.startPoint = local2GlobalPoint(bar3.startPoint, bar3.rotation, bar3.topPoint);


function setup()
{
	angleMode(RADIANS);
	background(250);
	createCanvas(800, 600);
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
	
	
	axisV.draw();
	axisH.draw();
	
	bar1.draw();
	bar2.draw();
	bar3.draw();
	
	
	tag.draw();
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
	this.showAxis = true;
	this.showMark = true;
	this.showFirstMark = false;
	
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
			if(this.showAxis)line(0, 0, this.length, 0);
		};
		
		//
		Axis.prototype._drawMark = function ()
		{
			if(this.showMark)
			{
				for( var i = 0; i < this.markSlot.length; i++)
				{
					if(i == 0 && !this.showFirstMark)
					{
						continue;
					}
					else
					{
						push();
						translate(this.markSlot[i][0], this.markSlot[i][1]);
						line(0, 0, 0, this.markLength);
						pop();
					}
				}
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
			fill(this.color[0], this.color[1], this.color[2]);
			rect(0, -this.width/2, this.height, this.width);
			pop();
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height);
}

function Tag(startPoint, width, height)
{
	//Attributes
	this.startPoint = [0, 0];
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.color = [127, 127, 127];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint, width, height)
	{
		this.startPoint = startPoint;
		this.width = width;
		this.height = height;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Tag.prototype.draw = function ()
		{
			push();
			translate(this.startPoint[0], this.startPoint[1]);
			rotate(this.rotation);
			noStroke();
			fill(this.color[0], this.color[1], this.color[2]);
			//[2, 0]
			triangle(6, 0, 12, 5, 12, -5);
			//[6, 0]
			rect(12, -this.width/2, this.height, this.width);
			pop();
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height);
}