var origin = [100, 500];

var axisV = new Axis(origin, 450);
axisV.rotation = -Math.PI/2;
axisV.setMark(50);
axisV.markWidth = -5;
axisV.initMarkLabel(0, 100, 5);
axisV.setMarkLabelStyle([-6, axisV.markWidth * 2], Math.PI/2, constants.RIGHT);
//axisV.showAxis = false;
axisV.showFirstAndLastMark = true;

var axisH = new Axis(origin, 600);
axisH.setMark(6);
axisH.showMark = true;
axisH.initMarkLabel(0, 60, 1);
axisH.setMarkLabelStyle([0, axisH.markWidth * 4], 0, constants.CENTER);
axisH.setMarkLabelInfo(["", "USA", "Japan", "China", "Thai", "Greece"]);
axisH.showFirstAndLastMark = false;

var bar1 = new Bar(local2GlobalPoint(origin, axisH.rotation, axisH.markSlots[1]), 20, 200);
bar1.rotation = axisV.rotation;
bar1.color = [255,215,0];

var bar2 = new Bar(local2GlobalPoint(bar1.startPoint, bar1.rotation, bar1.topPoint), 20, 100);
bar2.rotation = axisV.rotation;
bar2.color = [192,192,192];

var bar3 = new Bar(local2GlobalPoint(bar2.startPoint, bar2.rotation, bar2.topPoint), 20, 50);
bar3.rotation = axisV.rotation;
bar3.color = [205,127,50];

var tag1 = new Tag(local2GlobalPoint(bar1.startPoint, bar1.rotation, bar1.rightPoint), 60, 80);

var label1 = new Label(local2GlobalPoint(tag1.startPoint, tag1.rotation, [12 + tag1.height/2, 5]), "Gold: ??");
label1.align = constants.CENTER;

var tag2 = new Tag(local2GlobalPoint(bar3.startPoint, bar3.rotation, bar3.topPoint), 80, 40);
tag2.rotation = bar3.rotation;

var label2 = new Label(local2GlobalPoint(tag2.startPoint, tag2.rotation, tag2.centerPoint), "Total: ??");
label2.align = constants.CENTER;

var time = 0;

function setup()
{
	angleMode(RADIANS);
	background(250);
	createCanvas(800, 600);
}

function draw()
{
	//time += 0.01;
	//axisV.rotation -= Math.PI/50 * 0.01;
	//axisH.rotation -= Math.PI/50 * 0.01;
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
	
	tag1.draw();
	tag2.draw();
	
	label1.draw();
	label2.draw();
}

//Local coordinate always starts from [0, 0]
function local2GlobalPoint(globalStartPoint, rotation, localPoint)
{
	result = [];
	result[0] = globalStartPoint[0] + localPoint[0] * Math.cos(rotation) - localPoint[1] * Math.sin(rotation);
    result[1] = globalStartPoint[1] + localPoint[0] * Math.sin(rotation) + localPoint[1] * Math.cos(rotation);
	return result;
}

//
function valueInterpolate(valueStart, valueStop, count)
{
	var result = [];
	for(var i = 0; i < count + 1; i++)
	{
		result[i] = valueStart + (valueStop - valueStart) / count * i;
	}
	return result;
}

//To do:
//Change the setMarkLabel()
//
//Class Axis
function Axis(startPoint, length)
{
	//Attributes
	this.startPoint = [0, 0];
	this.length = 0;
	this.rotation = 0;
	
	this._markCount = 0;
	this._markStep = 0;
	this.markWidth = 5;
	this.markSlots = [];
	
	this.markLabelRotation = 0;
	this.markLabelOffset = [0, 0];
	this.markLabelAlign = constants.CENTER;
	this.markLabelStep = 0;
	this.markLabels = [];
	
	
	this.showAxis = true;
	this.showMark = true;
	this.showMarkLabel = true;
	this.showFirstAndLastMark = false;
	
	
	//Construction
	this.construct = function (startPoint, length)
	{
		this.startPoint = startPoint;
		this.length = length;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Axis.prototype.setMark = function (count)
		{
			this._markCount = count;
			this._markStep = Math.round(this.length / this._markCount);
			for(var i = 0; i < this._markCount; i++)
			{
				this.markSlots[i] = [i * this._markStep, 0];
			}
			this.markSlots[this._markCount] = [this._markCount * this._markStep, 0];
		}
		
		Axis.prototype.initMarkLabel = function (valueStart, valueStop, step)
		{
			this.markLabelStep = step;
			var values = valueInterpolate(valueStart, valueStop, this._markCount);
			console.log(values);
			for(var i = 0; i < this._markCount + 1; i++)
			{
				if(i % this.markLabelStep == 0)
				{
					this.markLabels[i / this.markLabelStep] = new Label([0, 0], values[i]);
				}
			}
			this._updateMarkLabel();
			//console.log(this.markLabels);
		}

		Axis.prototype.setMarkLabelStyle = function (offset, rotation, align)
		{
			this.markLabelAlign = align;
			this.markLabelRotation = rotation;
			this.markLabelOffset = offset;
			this._updateMarkLabel();
		}
		
		Axis.prototype.setMarkLabelInfo = function (infoList)
		{
			for(var i = 0; i < this.markLabels.length; i++)
			{
				if(i < infoList.length)
				{
					this.markLabels[i].info = infoList[i];
				}
				else
				{
					this.markLabels[i].info = "";
				}
			}
		}			
		
		Axis.prototype._updateMarkLabel = function ()
		{
			for(var i = 0; i < this.markLabels.length; i++)
			{
				this.markLabels[i].rotation = this.markLabelRotation;
				this.markLabels[i].align = this.markLabelAlign;
				this.markLabels[i].startPoint = [this.markSlots[i * this.markLabelStep][0] + this.markLabelOffset[0], this.markSlots[i * this.markLabelStep][1] + this.markLabelOffset[1]];
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
			this._drawMarkLabel();
			pop();
		}
		
		//
		Axis.prototype._drawAxis = function ()
		{
			if(this.showAxis)
			{
				//noStroke();
				line(0, 0, this.length, 0);
			}
		};
		
		//
		Axis.prototype._drawMark = function ()
		{
			if(this.showMark)
			{
				for( var i = 0; i < this.markSlots.length; i++)
				{
					if((i == 0 || i == this.markSlots.length - 1) && !this.showFirstAndLastMark)
					{
						continue;
					}
					else
					{
						push();
						translate(this.markSlots[i][0], this.markSlots[i][1]);
						line(0, 0, 0, this.markWidth);
						pop();
					}
				}
			}
		};
		
		Axis.prototype._drawMarkLabel = function ()
		{
			if(this.showMarkLabel)
			{
				for( var i = 0; i < this.markLabels.length; i++)
				{
					if((i == 0 || i == this.markLabels.length - 1) && !this.showFirstAndLastMark)
					{
						continue;
					}
					else
					{
						this.markLabels[i].draw();
					}
				}
			}			
		}
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, length);
}

//Class Bar
function Bar(startPoint, width, height)
{
	//Attributes
	this.startPoint = [0, 0];
	this.topPoint = [0, 0];
	this.leftPoint = [0, 0];
	this.rightPoint = [0, 0];
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
		this._updatePoints();
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
		Bar.prototype.setWidth = function (width)
		{
			this.width = width;
			this._updatePoints();
		}
		
		Bar.prototype.setHeight = function (height)
		{
			this.height = height;
			this._updatePoints();
		}
		
		Bar.prototype._updatePoints = function ()
		{
			this.topPoint = [this.height, 0];
			this.leftPoint = [this.height/2, -this.width/2];
			this.rightPoint = [this.height/2, this.width/2];
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
	this.centerPoint = [0, 0];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint, width, height)
	{
		this.startPoint = startPoint;
		this.width = width;
		this.height = height;
		this._updateCenterPoint();
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Tag.prototype._updateCenterPoint = function ()
		{
			this.centerPoint = [12 + this.height/2, 0]
		}
	
		Tag.prototype.draw = function ()
		{
			if(this.show)
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
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height);
}

function Label(startPoint, info)
{
	//Attributes
	this.startPoint = [0, 0];
	this.rotation = 0;
	this.info = "";
	this.size = 15;
	this.align = constants.LEFT;
	this.color = [0, 0, 0];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint, info)
	{
		this.startPoint = startPoint;
		this.info = info;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Label.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this.startPoint[0], this.startPoint[1]);
				rotate(this.rotation);
				noStroke();
				textSize(this.size);
				fill(this.color[0], this.color[1], this.color[2]);
				textAlign(this.align);
				text(this.info, 0, 0);
				//rect(0,0, 10, 10);
				pop();
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, info);	
}

