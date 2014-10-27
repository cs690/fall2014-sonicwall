var SESSION = 0;

function print(info)
{
	console.log(info);
}

function idGenerator()
{
	return hash(((new Date()).getMilliseconds()*(++SESSION)).toString())
}

//Generate hash from string
function hash(str) {
  var hash = 0, i, chr, len;
  if (str.length == 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

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
	this._startPoint = [0, 0];
	this._length = 0;
	this._rotation = 0;
	
	this._valueStart = 0;
	this._valueStop = 0;
	this.scaleFactor = 1;

	this.marks = [];
	this._markCount = 0;
	this._markStep = 0;
	this.markWidth = 5;
	
	this._labelStep = 0;
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
	
	this._axisType = 'continuous';//'discrete'
	this._localX_ = 0;
	this._localY_ = 0;
	this._h_ = 0;
	this._alpha_ = 0;
	this._beta_ = 0;
	this._currentLength_ = 0;
	this._projectionLength = 0;
	this._projectionHeight = 0;
	this._mouseValue = "";
	this._mouseValueIndex = 0;
	
	//Construction
	this.construct = function (startPoint, length)
	{
		this._startPoint = startPoint;
		this._length = length;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Axis.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}
	
		Axis.prototype.setLength = function (length)
		{
			this._length = length;
			this._updateMark();
		}
		
		Axis.prototype.getLength = function ()
		{
			return this._length;
		}
		
		Axis.prototype.setRotation = function (rotation)
		{
			this._rotation = rotation;
		}
		
		Axis.prototype.getRotation = function ()
		{
			return this._rotation;
		}
		
		Axis.prototype.setMarkCount = function (count)
		{
			this._markCount = count;
			this._updateMark();
			//this._updateLabel();
		}
		
		Axis.prototype.getMarkCount = function ()
		{
			return this._markCount;
		}
		
		Axis.prototype._updateMark = function ()
		{
			this._markStep = Math.round(this._length / this._markCount);
			this.marks = [];
			for(var i = 0; i < this._markCount; i++)
			{
				this.marks[i] = [i * this._markStep, 0];
			}
			this.marks[this._markCount] = [this._markCount * this._markStep, 0];
		}
		
		Axis.prototype._setValueRange = function (valueStart, valueStop)
		{
			this._valueStart = valueStart;
			this._valueStop = valueStop;
		}
		
		//Continuous values
		Axis.prototype.setContinuousLabels = function (labelStep, valueStart, valueStop)
		{
			this._axisType = "continuous";
			this._setValueRange(valueStart, valueStop);
			this._createLabel(valueInterpolate(valueStart, valueStop, this._markCount / labelStep) ,labelStep);
		}
		
		Axis.prototype.setDiscreteLabels = function (labelStep, values)
		{
			this._axisType = "discrete";
			this._createLabel(values ,labelStep);
		}
		
		Axis.prototype._createLabel = function (values, step)
		{
			this._labelStep = step;
			this.labels = [];
			var index = 0;
			for(var i = 0; i < this._markCount + 1; i++)
			{
				if(i % this._labelStep == 0)
				{
					index = Math.floor(i / this._labelStep);
					if(index < values.length)
					{
						this.labels[index] = new Label([0, 0], values[index]);
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
				this.labels[i].setRotation(this.labelRotation);
				this.labels[i].align = this.labelAlign;
				this.labels[i].setStartPoint([this.marks[i * this._labelStep][0] + this.labelOffset[0], this.marks[i * this._labelStep][1] + this.labelOffset[1]]);
			}
		}
		
		Axis.prototype.getProjectionLength = function (globalX, globalY)
		{
			var localX = globalX - this._startPoint[0];
			var localY = globalY - this._startPoint[1];
			var h = Math.sqrt(localX*localX + localY*localY);
			var alpha = Math.acos(localX / h);
			if(localY < 0)
			{
				return Math.cos(alpha + this._rotation) * h;
			}
			else if(localY > 0)
			{
				return Math.cos(alpha - this._rotation) * h;
			}
			else
			{
				return Math.cos(this._rotation) * h;
			}
		}		
		
		Axis.prototype.draw = function ()
		{
			strokeWeight(1);
			push();
			translate(this._startPoint[0], this._startPoint[1]);
			rotate(this._rotation);
			this._drawAxis();
			this._drawMark();
			this._drawLabel();
			this._drawMouseValue();
			pop();
		}
		
		//
		Axis.prototype._drawAxis = function ()
		{
			if(this.showAxis)
			{
				stroke();
				line(0, 0, this._length, 0);
			}
		}
		
		//
		Axis.prototype._drawMark = function ()
		{
			if(this.showMark)
			{
				for( var i = 0; i < this.marks.length; i++)
				{
					if((i == 0 && !this.showFirstMark) || (i == this.marks.length - 1 && !this.showLastMark))
					{
						continue;
					}
					else
					{
						push();
						translate(this.marks[i][0], this.marks[i][1]);
						line(0, 0, 0, this.markWidth);
						pop();
					}
				}
			}
		}
		
		Axis.prototype._drawLabel = function ()
		{
			if(this.showLabel)
			{
				for( var i = 0; i < this.labels.length; i++)
				{
					if((i == 0 && !this.showFirstLabel) || (i == this.marks.length - 1 && !this.showLastLabel))
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
		
		Axis.prototype._drawMouseValue = function()
		{

			this._localX_ = mouseX - this._startPoint[0];
			this._localY_ = mouseY - this._startPoint[1];
			this._h_ = Math.sqrt(this._localX_*this._localX_ + this._localY_*this._localY_);
			this._alpha_ = Math.acos(this._localX_ / this._h_);
			if(this._localY_ < 0)
			{
				this._beta_ = this._alpha_ + this._rotation;
			}
			else if(this._localY_ > 0)
			{
				this._beta_ = this._alpha_ - this._rotation;
			}
			else
			{
				this._beta_ = this._rotation;
			}
			
			this._projectionLength = Math.cos(this._beta_) * this._h_;
			this._projectionHeight = Math.sin(this._beta_) * this._h_;			
			
			//this._projectionLength = this.getProjectionLength(mouseX, mouseY);
			
			if(this._projectionLength >= 0 && this._projectionLength <= this._length)
			{		
				if(this._axisType == "continuous")
				{
					this._mouseValue = this._valueStart + (this._valueStop - this._valueStart) * this._projectionLength / this._length;
					this._currentLength_ = this._projectionLength;
				}
				else if(this._axisType == "discrete")
				{
					this._mouseValueIndex = Math.round(this._projectionLength / (this._markStep * this._labelStep));
					if(this._mouseValueIndex >= 0 && this._mouseValueIndex < this.labels.length)
					{
						this._mouseValue = this.labels[this._mouseValueIndex].info;
						this._currentLength_ = this._mouseValueIndex * this._markStep * this._labelStep;
					}
					else this._mouseValue = "";
				}
				noStroke();
				fill([227, 119, 194, 100]);
				ellipse(this._currentLength_, 0, 10, 10);
			}
		}
		
		Axis.prototype.scale = function (value)
		{
			return this._length * (this.scaleFactor * value - this._valueStart) / (this._valueStop - this._valueStart);
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
	this._startPoint = [0, 0];
	this.topPoint = [0, 0];
	this.leftPoint = [0, 0];
	this.rightPoint = [0, 0];
	this.width = 0;
	this.height = 0;
	this._rotation = 0;
	this.color = [255, 255, 255];
	this.selected = true;
	
	//Constructor
	this.construct = function (startPoint, width, height)
	{
		this._startPoint = startPoint;
		this.width = width;
		this.height = height;
		this._updatePoints();
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
		Bar.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}
	
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
		
		Bar.prototype.setRotation = function (rotation)
		{
			this._rotation = rotation;
		}
		
		Bar.prototype.getRotation = function ()
		{
			return this._rotation;
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
			translate(this._startPoint[0], this._startPoint[1]);
			rotate(this._rotation);
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

//class Tag
function Tag(startPoint, width, height, info)
{
	//Attributes
	this._startPoint = [0, 0];
	this.width = 0;
	this.height = 0;
	this._rotation = 0;
	this.color = [210, 210, 210];
	this.centerPoint = [0, 0];
	this.show = true;
	this.showLabel = true;
	this._label = new Label([0,0], "");
	
	//Constructor
	this.construct = function (startPoint, width, height, info)
	{
		this._startPoint = startPoint;
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
			this._startPoint = startPoint;
			this._updateLabel();
		}
	
		Tag.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}	
	
		Tag.prototype.setRotation = function (rotation)
		{
			this._rotation = rotation;
			this._updateLabel();
		}
		
		Tag.prototype.getRotation = function ()
		{
			return this._rotation;
		}		
		
		Tag.prototype.setInfo = function (info)
		{
			this._label.info = info;
		}		
		
		Tag.prototype._updateLabel = function ()
		{
			this._label.setStartPoint(local2GlobalPoint(this._startPoint, this._rotation, [12 + this.height/2 - 7, 0]));
			//7 = CharHeight(this._label.info)//Not yet implemented by P5 dev
		}

		Tag.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this._startPoint[0], this._startPoint[1]);
				rotate(this._rotation);
				noStroke();
				fill(color(this.color));
				triangle(6, 0, 12, 5, 12, -5);
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
	this._startPoint = [0, 0];
	this._rotation = 0;
	this.info = "";
	this.size = 15;
	this.align = constants.LEFT;
	this.color = [0, 0, 0];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint, info)
	{
		this._startPoint = startPoint;
		this.info = info;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Label.prototype.setStartPoint = function (startPoint)
		{
			this._startPoint = startPoint;
		}		
	
		Label.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}		
	
		Label.prototype.setRotation = function (rotation)
		{
			this._rotation = rotation;
		}
		
		Label.prototype.getRotation = function ()
		{
			return this._rotation;
		}		
	
		Label.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this._startPoint[0], this._startPoint[1]);
				rotate(this._rotation);
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
	
		Bar_Graph.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}		
	
		Bar_Graph.prototype.addBars = function (labelAxis, valueAxis, values, color)
		{
			this._bars[this._bars.length] = [];
			if(this._bars.length < 2)
			{
				
				for(var i = 0; i < values.length; i++)
				{
					if(i < labelAxis.marks.length - 1)
					{
						var bar = new Bar(local2GlobalPoint(labelAxis.getStartPoint(), labelAxis.getRotation(), labelAxis.marks[i+1]), this.barWidth, valueAxis.scale(values[i]));
						bar.setRotation(valueAxis.getRotation());
						bar.color = color;
						this._bars[0][this._bars[0].length] = bar;
					}
				}
			}
			else
			{
				for(var i = 0; i < values.length; i++)
				{
					if(i < labelAxis.marks.length - 1)
					{
						var bar = new Bar(local2GlobalPoint(this._bars[this._bars.length - 2][i].getStartPoint(), this._bars[this._bars.length - 2][i].getRotation(), this._bars[this._bars.length - 2][i].topPoint), this.barWidth, valueAxis.scale(values[i]));
						bar.setRotation(valueAxis.getRotation());
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
	this._startPoint = [0, 0];
	this.size = 10;
	this.color = [127, 127, 127, 100];
	this.show = true;
	
	//Constructor
	this.construct = function (startPoint)
	{
		this._startPoint = startPoint;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{

		Scatter.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}	
	
		Scatter.prototype.draw = function ()
		{
			if(this.show)
			{
				push();
				translate(this._startPoint[0], this._startPoint[1]);
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
	
		Scatter_Graph.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}		
	
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

function Single_Line(startPoint)
{
	//Attributes
	this._startPoint = [0, 0];
	this.color = [127, 127, 127, 100];
	this._values = [];
	this.visable = true;
	
	//Constructor
	this.construct = function (startPoint)
	{
		this._startPoint = startPoint;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
	
		Single_Line.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}	
	
		Single_Line.prototype.load = function (labelAxis, valueAxis, values)
		{
			this._values = [];
			for(var i = 0; i < values.length; i++)
			{
				this._values[this._values.length] = [labelAxis.scale(values[i][0]), valueAxis.scale(values[i][1])];
			}
			
			console.log(this._values);
		}
	
		Single_Line.prototype.draw = function ()
		{
			if(this.visable)
			{
				push();
				translate(this._startPoint[0], this._startPoint[1]);				
				//Line
				stroke(this.color);
				beginShape(constants.LINES)
				for(var i = 0; i < this._values.length; i++)
				{
					vertex(this._values[i][0], this._values[i][1]);
				}
				endShape();
				
				//Area
				noStroke();
				beginShape();
				fill([this.color[0], this.color[1], this.color[2], 20]);
				vertex(this._values[0][0], 0);
				for(var i = 0; i < this._values.length; i++)
				{
					vertex(this._values[i][0], this._values[i][1]);
				}
				vertex(this._values[this._values.length-1][0], 0);
				endShape(constants.CLOSE);

				pop();
				
				
				
			}
		};
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(startPoint);	
}

function Line_Graph(startPoint, width, height)
{
	//Attributes
	this._startPoint = [0,0];
	this._width = 0;
	this._height = 0;
	this._axises = [];
	this._lines = [];
	
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
	
		Line_Graph.prototype.getStartPoint = function ()
		{
			return this._startPoint;
		}
		
		Line_Graph.prototype.addLine = function (values, color)
		{
			var l = new Single_Line(this._startPoint);
			l.load(this._axises[0], this._axises[1], values);
			l.color = color;
			this._lines[this._lines.length] = l;
		}
		
        Line_Graph.prototype.draw = function ()
        {
			for(var i = 0; i < this._axises.length; i++)
			{
				this._axises[i].draw();
			}

			for(var i = 0; i < this._lines.length; i++)
			{
				this._lines[i].draw();
			}
        }

        this._initialized = true;		
	}
	
	this.construct(startPoint, width, height);
}

function Data_Drawer(value)
{
	//Attributes
	this._value = 0;
	this._id = "";
	this._organizer = {};
	
	this._globalPoint = [0,0];
	this._representation = {};
	this.selected = false;
	
	//TBA
	this._tag = {};
	
	//Constructor
	this.construct = function (value)
	{
		this._id = idGenerator();
		this._value = value;
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{
		Data_Drawer.prototype.getID = function ()
		{
			return this._id;
		}
		
		Data_Drawer.prototype.getValue = function ()
		{
			return this._value;
		}

		Data_Drawer.prototype.setValue = function (value)
		{
			this._value = value;
			this.onValueChange(this._id);
		}
		
		Data_Drawer.prototype.onValueChange = function (id)
		{
			this._organizer.updateDrawer(id);
			this.setGlobalPoint();
		}
		
		Data_Drawer.prototype.setGlobalPoint = function()
		{
			this._globalPoint = this._organizer.project(this._value);
		}

		Data_Drawer.prototype.setTag = function()
		{
			this._tag = new Tag(this._globalPoint, 50, 40, this._value.toString());
			this._tag.setRotation(-Math.PI / 2);
		}		
		
		Data_Drawer.prototype.getTag = function()
		{
			return this._tag;
		}		
		
		Data_Drawer.prototype.bindOrganizer = function (organizer)
		{
			this._organizer = organizer;
		}
		
		Data_Drawer.prototype.getGlobalX = function ()
		{
			return this._globalPoint[0];
		}
		
		Data_Drawer.prototype.getGlobalY = function ()
		{
			return this._globalPoint[1];
		}
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct(value);
}

function Data_Organizer()
{
	//Attributes
	this._values = [];
	this._value_drawers = [];
	this._value_drawers_hashtable = {};
	this._type = "static";//"dynamic"
	
	this._currentDrawerID = -1;

	
	//Constructor
	this.construct = function ()
	{
	};
	
	//Methods
	if (typeof this._initialized == "undefined")
	{

		Data_Organizer.prototype.setData = function (values)
		{
			this._values = values;
			this._value_drawers = [];
			this._value_drawers_hashtable = {};
			for(var i = 0; i < values.length; i++)
			{
				var drawer = new Data_Drawer(values[i]);
				drawer.bindOrganizer(this);
				drawer.setGlobalPoint();
				drawer.setTag();
				this._value_drawers_hashtable[drawer.getID()] = drawer;
				this._value_drawers[this._value_drawers.length] = drawer;
			}
		}
		
		Data_Organizer.prototype.getData = function ()
		{
			if(this._type == "static")
			{
				return this._values;
			}
			else if(this._type == "dynamic")
			{
				this._values = [];
				for(var i = 0; i < this._value_drawers.length; i++)
				{
					this._values[this._values.length] = this._value_drawers[i];
				}
				return this._values;
			}
		}
		
		Data_Organizer.prototype.updateDrawer = function (id)
		{
			console.log(id);
			console.log(this);
			console.log(this._value_drawers_hashtable)
			console.log(this._value_drawers_hashtable[id]);
		}
		
		Data_Organizer.prototype.selectData = function (globalX, globalY)
		{
			//console.log(this._value_drawers_hashtable);
		
			var minDist = Number.MAX_VALUE;
			for(var id in this._value_drawers_hashtable)
			{
				//console.log(id);
				
				var xDiff = globalX - this._value_drawers_hashtable[id].getGlobalX();
				var yDiff = globalY - this._value_drawers_hashtable[id].getGlobalY();
				var currentDist = (xDiff * xDiff) + (yDiff * yDiff);
				
				/*
				console.log(globalX);
				console.log(globalY);
				console.log(this._value_drawers_hashtable[id].getGlobalX());
				console.log(this._value_drawers_hashtable[id].getGlobalY());
				console.log("-------");
				*/
				
				if(currentDist < minDist)
				{
					minDist = currentDist;
					this._currentDrawerID = id;
				}
			}
			if(this._currentDrawerID in this._value_drawers_hashtable)
			{
				this._value_drawers_hashtable[this._currentDrawerID].selected = !this._value_drawers_hashtable[this._currentDrawerID].selected;
				//console.log("Done!");
			}
			//console.log(this._currentDrawerID);
		}
		
		Data_Organizer.prototype.project = function (value)
		{
			return value;
		}

		Data_Organizer.prototype.draw = function ()
		{
			for(var id in this._value_drawers_hashtable)
			{
				var v = this._value_drawers_hashtable[id];
				var tx = v.getGlobalX();
				var ty = v.getGlobalY();
				push();
				translate(100, 550);
				noStroke();
				if(v.selected)
				{
					fill([255,0,0,100]);
					v.getTag().draw();
				}
				else
				{
					fill([0,0,0,100]);
				}
				ellipse(tx, ty, 8, 8);
				pop();
			}
		}
		
		this._initialized = true;
	}
	
	//Call construct
	this.construct();	
}

