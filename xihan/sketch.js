var origin = [100, 500];
var time = 0;

var p = new Scatter([400, 400]);
p.size = 15;

var tableData;

var bargraph = new Bar_Graph(origin);

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

function print(info)
{
	console.log(info);
}

//Local coordinate always starts from [0, 0]
function local2GlobalPoint(globalStartPoint, rotation, localPoint)
{
	result = [];
	result[0] = globalStartPoint[0] + localPoint[0] * Math.cos(rotation) - localPoint[1] * Math.sin(rotation);
    result[1] = globalStartPoint[1] + localPoint[0] * Math.sin(rotation) + localPoint[1] * Math.cos(rotation);
	return result;
}

//Get a list of values from valueStart to valueStop
function valueInterpolate(valueStart, valueStop, count)
{
	var result = [];
	for(var i = 0; i < count + 1; i++)
	{
		result[i] = valueStart + (valueStop - valueStart) / count * i;
	}
	return result;
}

//Class Axis
function Axis(startPoint, length)
{
	//Attributes
	this.startPoint = [0, 0];
	this.length = 0;
	this.rotation = 0;
	
	this.markValueRange = 0;
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
			this.markValueRange = valueStop - valueStart;
			this.markLabelStep = step;
			var values = valueInterpolate(valueStart, valueStop, this._markCount);
			for(var i = 0; i < this._markCount + 1; i++)
			{
				if(i % this.markLabelStep == 0)
				{
					this.markLabels[i / this.markLabelStep] = new Label([0, 0], values[i]);
				}
			}
			this._updateMarkLabel();
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
		
		Axis.prototype.scale = function (value)
		{
			return this.length / this.markValueRange * value;
		}
		
		this._initialized = true;
	}
	
	//Static method
	
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
			fill(color(this.color));
			rect(0, -this.width/2, this.height, this.width);
			pop();
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height);
}

function Tag(startPoint, width, height, info)
{
	//Attributes
	this.startPoint = [0, 0];
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.color = [127, 127, 127];
	this.centerPoint = [0, 0];
	this.show = true;
	this.showLabel = true;
	this._label = new Label([0,0], "");
	
	//Constructor
	this.construct = function (startPoint, width, height, info)
	{
		this.startPoint = startPoint;
		this.width = width;
		this.height = height;
		this._label.info = info;
		this._label.align = constants.CENTER;
		this._updateLabel();
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
		
		Tag.prototype.setStartPoint = function (startPoint)
		{
			this.startPoint = startPoint;
			this._updateLabel();
		}
	
		Tag.prototype.setRotation = function (rotation)
		{
			this.rotation = rotation;
			this._updateLabel();
		}
		
		Tag.prototype.setInfo = function (info)
		{
			this._label.info = info;
		}		
		
		Tag.prototype._updateLabel = function ()
		{
			this._label.startPoint = local2GlobalPoint(this.startPoint, this.rotation, [12 + this.height/2, 0]);
		}

		Tag.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this.startPoint[0], this.startPoint[1]);
				rotate(this.rotation);
				noStroke();
				fill(color(this.color));
				//[2, 0]
				triangle(6, 0, 12, 5, 12, -5);
				//[6, 0]
				rect(12, -this.width/2, this.height, this.width);
				pop();
				if(this.showLabel)
				{
					this._label.draw();
				}
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, width, height, info);
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
				fill(color(this.color));
				textAlign(this.align);
				text(this.info, 0, 0);
				pop();
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint, info);	
}

function Scatter(startPoint)
{
	//Attributes
	this.startPoint = [0, 0];
	this.size = 15;
	this.color = [127, 127, 127, 100];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint)
	{
		this.startPoint = startPoint;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Scatter.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this.startPoint[0], this.startPoint[1]);
				noStroke();
				fill(color(this.color));
				ellipse(0, 0, this.size, this.size);
				pop();
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint);	
}

function Bar_Graph(startPoint)
{
    //Attributes
    this.axisV = null;
    this.axisH = null;
    this.bar1 = null;
    this.bar2 = null;
    this.bar3 = null;
    this.bar4 = null;
    this.bar5 = null;
    this.bar6 = null;
	this.bar7 = null;
    this.bar8 = null;
    this.bar9 = null;
	
	this.tag1 = null;
	
	this._axises = [];
	this._bars = [];

    //Constructor
    this.construct = function (startPoint)
    {
		this._dataLoadCompleted = false;
		this._table = null;
	
        this.axisV = new Axis(startPoint, 450);
        this.axisV.rotation = -Math.PI / 2;
        this.axisV.setMark(50);
        this.axisV.markWidth = -5;
        this.axisV.initMarkLabel(0, 1500, 5);
        this.axisV.setMarkLabelStyle([-6, this.axisV.markWidth * 2], Math.PI / 2, constants.RIGHT);
        //this.axisV.showAxis = false;
        this.axisV.showFirstAndLastMark = true;

        this.axisH = new Axis(startPoint, 600);
        this.axisH.setMark(4);
        this.axisH.showMark = false;
        this.axisH.initMarkLabel(0, 60, 1);
        this.axisH.setMarkLabelStyle([0, this.axisH.markWidth * 4], 0, constants.CENTER);
        this.axisH.setMarkLabelInfo(["", "USA", "Russia", "Germany", "Thai", "Greece"]);
        this.axisH.showFirstAndLastMark = false;

		//USA
        this.bar1 = new Bar(local2GlobalPoint(startPoint, this.axisH.rotation, this.axisH.markSlots[1]), 20, this.axisV.scale(552));
        this.bar1.rotation = this.axisV.rotation;
        this.bar1.color = [255, 215, 0];

        this.bar2 = new Bar(local2GlobalPoint(this.bar1.startPoint, this.bar1.rotation, this.bar1.topPoint), 20, this.axisV.scale(440));
        this.bar2.rotation = this.axisV.rotation;
        this.bar2.color = [192, 192, 192];

        this.bar3 = new Bar(local2GlobalPoint(this.bar2.startPoint, this.bar2.rotation, this.bar2.topPoint), 20, this.axisV.scale(320));
        this.bar3.rotation = this.axisV.rotation;
        this.bar3.color = [205, 127, 50];
		
		//Russia
        this.bar4 = new Bar(local2GlobalPoint(startPoint, this.axisH.rotation, this.axisH.markSlots[2]), 20, this.axisV.scale(234));
        this.bar4.rotation = this.axisV.rotation;
        this.bar4.color = [255, 215, 0];

        this.bar5 = new Bar(local2GlobalPoint(this.bar4.startPoint, this.bar4.rotation, this.bar4.topPoint), 20, this.axisV.scale(221));
        this.bar5.rotation = this.axisV.rotation;
        this.bar5.color = [192, 192, 192];

        this.bar6 = new Bar(local2GlobalPoint(this.bar5.startPoint, this.bar5.rotation, this.bar5.topPoint), 20, this.axisV.scale(313));
        this.bar6.rotation = this.axisV.rotation;
        this.bar6.color = [205, 127, 50];

		//Germany
        this.bar7 = new Bar(local2GlobalPoint(startPoint, this.axisH.rotation, this.axisH.markSlots[3]), 20, this.axisV.scale(223));
        this.bar7.rotation = this.axisV.rotation;
        this.bar7.color = [255, 215, 0];

        this.bar8 = new Bar(local2GlobalPoint(this.bar7.startPoint, this.bar7.rotation, this.bar7.topPoint), 20, this.axisV.scale(183));
        this.bar8.rotation = this.axisV.rotation;
        this.bar8.color = [192, 192, 192];

        this.bar9 = new Bar(local2GlobalPoint(this.bar8.startPoint, this.bar8.rotation, this.bar8.topPoint), 20, this.axisV.scale(223));
        this.bar9.rotation = this.axisV.rotation;
        this.bar9.color = [205, 127, 50];		
		
		this.tag1 = new Tag(local2GlobalPoint(this.bar3.startPoint, this.bar3.rotation, this.bar3.topPoint), 100, 60, "Total: 1312");
		this.tag1.setRotation(this.bar3.rotation);
		
		this.tag2 = new Tag(local2GlobalPoint(this.bar1.startPoint, this.bar1.rotation, this.bar1.rightPoint), 40, 80, "Gold: 552");	
		
		this._axises = [this.axisV, this.axisH];
		this._bars = [this.bar1, this.bar2, this.bar3, this.bar4, this.bar5, this.bar6, this.bar7, this.bar8, this.bar9];
    };

    //Methods
    if (typeof this._initialized == "undefined")
	{
		
        Bar_Graph.prototype.load = function (table)
        {
			this._table = table;
			this._dataLoadCompleted = true;
			this._precessData(2);
        }
		
        Bar_Graph.prototype._precessData = function (index)
        {
			var colum = null;
			if(this._dataLoadCompleted)
			{
				colum = this._table.getColumn(index);
				console.log(this._table);
				console.log(colum);
			}
        }
		
        Bar_Graph.prototype.draw = function ()
        {	
			if(this._dataLoadCompleted)
			{
				for(var i = 0; i < this._axises.length; i++)
				{
					this._axises[i].draw();
				}
				for(var i = 0; i < this._bars.length; i++)
				{
					this._bars[i].draw();
				}
				this.tag1.draw();
				this.tag2.draw();
			}
        }

        this._initialized = true;
    }

    this.construct(startPoint);
}