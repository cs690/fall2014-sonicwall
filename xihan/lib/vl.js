ClientArea = [800, 600];

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

//Local coordinate always starts from [0, 0]
function global2LocalPoint(localStartPoint, rotation, globalPoint)
{
	result = [];
	result[0] = (globalPoint[0] - localStartPoint[0]) * Math.cos(rotation) - (globalPoint[1] - localStartPoint[1]) * Math.sin(rotation);
	result[1] = (globalPoint[0] - localStartPoint[0]) * Math.sin(rotation) + (globalPoint[1] - localStartPoint[1]) * Math.cos(rotation);
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
	
	this._valueStart = 0;
	this._valueStop = 0;
	this.scaleFactor = 1;
	
	this.valueType = 'continuous';//'discrete'
	this.currentValue = 0;
	
	this._markStep = 0;
	this.markWidth = 5;
	
	this.markSlots = [];
	this._markSlotsCount = 0;
	this._markSlotStep = 0;

	this.labelRotation = 0;
	this.labelOffset = [0, 0];
	this.labelAlign = constants.CENTER;
	this.labels = [];
	
	this.showAxis = true;
	this.showMark = true;
	this.showLabel = true;
	this.showFirstMark = true;
	this.showLastMark = true;
	this.showFirstLabel = true;
	this.showLastLabel = true;
	
	//Construction
	this.construct = function (startPoint, length)
	{
		this.startPoint = startPoint;
		this.length = length;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Axis.prototype.setLength = function (length)
		{
			this.length = length;
			this._updateMarkSlots();
		}
	
		Axis.prototype.setMarkSlotsCount = function (count)
		{
			this._markSlotsCount = count;
			this._updateMarkSlots();
			//this._updateLabel();
		}
		
		Axis.prototype.getMarkSlotsCount = function ()
		{
			return this._markSlotsCount;
		}
		
		Axis.prototype._updateMarkSlots = function ()
		{
			this._markStep = Math.round(this.length / this._markSlotsCount);
			this.markSlots = [];
			for(var i = 0; i < this._markSlotsCount; i++)
			{
				this.markSlots[i] = [i * this._markStep, 0];
			}
			this.markSlots[this._markSlotsCount] = [this._markSlotsCount * this._markStep, 0];
		}
		
		Axis.prototype.setLabel = function (values, slotStep)
		{
			this._markSlotStep = slotStep;
			this.labels = [];
			for(var i = 0; i < this._markSlotsCount + 1; i++)
			{
				if(i % this._markSlotStep == 0)
				{
					if(i < values.length)
					{
						this.labels[i / this._markSlotStep] = new Label([0, 0], values[i]);
					}
				}
			}
			this._updateLabel();
		}

		Axis.prototype.setLabelStyle = function (offset, rotation, align)
		{
			this.labelAlign = align;
			this.labelRotation = rotation;
			this.labelOffset = offset;
			this._updateLabel();
		}
		
		Axis.prototype._updateLabel = function ()
		{
			for(var i = 0; i < this.labels.length; i++)
			{
				this.labels[i].rotation = this.labelRotation;
				this.labels[i].align = this.labelAlign;
				this.labels[i].startPoint = [this.markSlots[i * this._markSlotStep][0] + this.labelOffset[0], this.markSlots[i * this._markSlotStep][1] + this.labelOffset[1]];
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
			this._drawCurrentValue(mouseX, mouseY);
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
					if((i == 0 && !this.showFirstMark) || (i == this.markSlots.length - 1 && !this.showLastMark))
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
			if(this.showLabel)
			{
				for( var i = 0; i < this.labels.length; i++)
				{
					if((i == 0 && !this.showFirstLabel) || (i == this.markSlots.length - 1 && !this.showLastLabel))
					{
						continue;
					}
					else
					{
						this.labels[i].draw();
					}
				}
			}			
		}
		
		Axis.prototype._drawCurrentValue = function(currentX, currentY)
		{
		console.log(currentX + ',' + currentY);
			if(this.valueType == "continuous")
			{
				//this.currentValue = global2LocalPoint(this.startPoint, this.rotation, [currentX, currentY])[0];
				this.currentValue = (currentX - this.startPoint[0]) * Math.cos(this.rotation) - (Math.abs(currentY - this.startPoint[1])) * Math.sin(this.rotation);
			}
			else if(this.valueType == "discrete")
			{
				//this.currentValue = 
			}
			
			if(this.currentValue >= 0 && this.currentValue <= this.length)
			{
				//console.log(currentValue);
				push();
				noStroke();
				fill(0);
				ellipse(this.currentValue, 0, 15, 15);
				pop();
			}
		}
		
		Axis.prototype.setValueRange = function (valueStart, valueStop)
		{
			this._valueStart = valueStart;
			this._valueStop = valueStop;
		}
		
		Axis.prototype.scale = function (value)
		{
			return this.length * (this.scaleFactor * value - this._valueStart) / (this._valueStop - this._valueStart);
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
			noStroke();
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
	this.color = [210, 210, 210];
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
				rect(11, -this.width/2, this.height, this.width);
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

function Bar_Graph(startPoint, width, height)
{
    //Attributes
	this.tag1 = null;
	
	this._axises = [];
	this._bars = [];
	this._width = 0;
	this._height = 0;
	this.barWidth = 20;
	
    //Constructor
    this.construct = function (startPoint, width, height)
    {
		this._dataLoadCompleted = false;
		this._table = null;
		
		this._width = width;
		this._height = height;
		
		this.barWidth = 20;
		
		this._axises = [new Axis(startPoint, this._width), new Axis(startPoint, this._height)];
    };

    //Methods
    if (typeof this._initialized == "undefined")
	{
	
		Bar_Graph.prototype.addBars = function (labelAxis, valueAxis, values, color)
		{
			this._bars[this._bars.length] = [];
			if(this._bars.length < 2)
			{
				
				for(var i = 0; i < values.length; i++)
				{
					if(i < labelAxis.markSlots.length - 1)
					{
						var bar = new Bar(local2GlobalPoint(labelAxis.startPoint, labelAxis.rotation, labelAxis.markSlots[i+1]), this.barWidth, valueAxis.scale(values[i]));
						bar.rotation = valueAxis.rotation;
						bar.color = color;
						this._bars[0][this._bars[0].length] = bar;
					}
				}
			}
			else
			{
				for(var i = 0; i < values.length; i++)
				{
					if(i < labelAxis.markSlots.length - 1)
					{
						var bar = new Bar(local2GlobalPoint(this._bars[this._bars.length - 2][i].startPoint, this._bars[this._bars.length - 2][i].rotation, this._bars[this._bars.length - 2][i].topPoint), this.barWidth, valueAxis.scale(values[i]));
						bar.rotation = valueAxis.rotation;
						bar.color = color;
						this._bars[this._bars.length - 1][this._bars[this._bars.length - 1].length] = bar;
					}
				}				
			}
		}
		
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
			}
        }
		
        Bar_Graph.prototype.draw = function ()
        {	
			if(this._dataLoadCompleted)
			{
				for(var level = 0; level < this._bars.length; level++)
				{
					for(var index = 0; index < this._bars[level].length; index++)
					{
						this._bars[level][index].draw();
					}
				}
				for(var i = 0; i < this._axises.length; i++)
				{
					this._axises[i].draw();
				}

			}
        }

        this._initialized = true;
    }

    this.construct(startPoint, width, height);
}

function Scatter(startPoint)
{
	//Attributes
	this.startPoint = [0, 0];
	this.size = 10;
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

function Scatter_Graph(startPoint, width, height)
{
	//Attributes
	this._startPoint = [0,0];
	this._width = 0;
	this._height = 0;
	this._axises = [];
	this._scatters = [];
	
    //Constructor
    this.construct = function (startPoint, width, height)
    {
		this._startPoint = startPoint;
		this._width = width;
		this._height = height;
		
		this._axises = [new Axis(startPoint, this._width), new Axis(startPoint, this._height)];
	}

    //Methods
    if (typeof this._initialized == "undefined")
	{
	
		Scatter_Graph.prototype.AddScatter = function (values)
		{
			var _startPoint_ = [];
			for(var i = 0; i < this._axises.length; i++)
			{
				_startPoint_[_startPoint_.length] = this._axises[i].scale(values[i]);
			}
			this._scatters[this._scatters.length] = new Scatter(local2GlobalPoint(_startPoint_, 0, this._startPoint));
		}
	
        Scatter_Graph.prototype.draw = function ()
        {
			for(var i = 0; i < this._axises.length; i++)
			{
				this._axises[i].draw();
			}

			for(var i = 0; i < this._scatters.length; i++)
			{
				this._scatters[i].draw();
			}
        }

        this._initialized = true;		
	}
	
	this.construct(startPoint, width, height);
}