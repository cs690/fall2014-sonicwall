function TEST1()
{
	//Attributes
	this.self = {};
	
    //Constructor
    this.construct = function ()
    {
		this.self = this;
	};

    //Methods
    if (typeof this._initialized == "undefined")
	{
	
		TEST1.prototype.bind = function (func)
		{
			console.log("2");
			console.log(func())
		}
		
        this._initialized = true;
	}
	
	this.construct();
}

function TEST2()
{
	//Attributes
	this.self = {};
	this.d = "2";
	
    //Constructor
    this.construct = function ()
    {
		this.self = this;
	};

    //Methods
    if (typeof this._initialized == "undefined")
	{
	
		TEST2.prototype.func_o = function ()
		{
			console.log("1");
			console.log(this.d);
		}
		
        this._initialized = true;
	}
	
	this.construct();
}

var t1 = new TEST1();
var t2 = new TEST2();

t1.bind(t2.func_o);