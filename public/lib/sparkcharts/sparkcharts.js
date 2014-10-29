function sparkchart(sparkchart){
	var scale = {x:d3.scale.linear(), y:d3.scale.linear()}
	sparkchart.width = function(w){
		if (arguments.length==0) return Math.max.apply(null, scale.x.range()) - Math.min.apply(null,scale.x.range());
		if (w > 0)
			scale.x.range([0,w]);
		else
			scale.x.range([-w,0]);
		return sparkchart;
	}
	sparkchart.height = function(h){
		if (arguments.length==0) return Math.max.apply(null, scale.y.range()) - Math.min.apply(null,scale.y.range());
		if (h > 0)
			scale.y.range([h,0]);
		else
			scale.y.range([0,-h]);
		return sparkchart;
	}
	sparkchart.size = function(sx, sy){
		if (arguments.length==0) return [sparkchart.width(), sparkchart.height()]
		sparkchart.width(sx);
		sparkchart.height(sy);
		return sparkchart;
	}
	sparkchart.domain = function(dx, dy){
		if (arguments.length==0) return [scale.x.domain(), scale.y.domain()];
		scale.x.domain(dx instanceof Array?dx:[0,dx]);
		scale.y.domain(dy instanceof Array?dy:[0,dy]);
		sparkchart.autosize(dx == 0, dy == 0);
		return sparkchart;
	}
	sparkchart.scale = {
		x: function(xscale){
			if (arguments.length==0) return scale.x;
			scale.x = xscale;
			scale.x.range([0, sparkchart.width()]);
			return sparkchart;
		},
		y: function(yscale){
			if (arguments.length==0) return scale.y;
			scale.y = yscale;
			scale.y.range([sparkchart.height(),0]);
			return sparkchart;
		}
	}
	return sparkchart.domain(0,0);
}

function sparkline(){
	var xfunc = function(d,i){return i;}, 
		yfunc = function(d){return d;}, 
		datafunc = function(d){return d;};
	var line = d3.svg.line();
	var ret = function(selection){
		selection.select(".sparkline").remove();
		selection
			.append("svg")
				.attr("class","sparkline")
				.attr("width", ret.width())
				.attr("height", ret.height())
			.append("path")
				.datum(datafunc);
				.attr("d", line)

	}
	
	function updateLine(){
		if (typeof(line) =="function")
	}
	ret.x = function(fx){
		if (arguments.length==0) return xfunc;
		xfunc = typeof(fx) == "function"?fx:function(){return fx;};
		if (typeof(line) != "function")
			line.x(function(d,i){return ret.scale.x()(xfunc(d,i));})
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = typeof(fy) == "function"?fy:function(){return fy;};
		if (typeof(line) != "function")
			line.y(function(d,i){return ret.scale.y()(yfunc(d,i));})
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
	}
	
	ret.autosize = function(ax, ay){
		if (ax || ay)
			line = function(d){
				var xscale, yscale;
				if (ax){
					var xval = d.map(xfunc)
					xscale = ret.scale.x().copy().domain([Math.min.apply(null,xval),Math.max.apply(null,xval)])
				}else
					xscale = ret.scale.x()
				if (ay){
					var yval = d.map(yfunc)
					yscale = ret.scale.y().copy().domain([Math.min.apply(null,yval),Math.max.apply(null,yval)])
				}else
					yscale = ret.scale.y()
				return d3.svg.line()
					.x(function(d,i){
						return xscale(xfunc(d,i));
					}).y(function(d,i){
						return yscale(yfunc(d,i));
					})
			}
		else{
			line = d3.svg.line()
			ret.x(xfunc).y(yfunc)
		}
	}
	
	return sparkchart(ret).x(xfunc).y(yfunc);
}

function sparkarea(){
	var xfunc = function(d,i){return i;}, 
		yfunc = function(d){return d;}, 
		datafunc = function(d){return d;};
	var area = d3.svg.area();
	var ret = function(selection){
		selection.select(".sparkarea").remove();
		selection
			.append("svg")
				.attr("class","sparkarea")
				.attr("width", ret.width())
				.attr("height", ret.height())
			.append("path")
				.datum(datafunc)
				.attr("d", area);

	}
	
	ret.x = function(fx){
		if (arguments.length==0) return xfunc;
		xfunc = typeof(fx) == "function"?fx:function(){return fx};
		if (typeof(area)!="function"")
			area.x(function(d,i){return ret.scale.x()(xfunc(d,i));})
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = typeof(fy) == "function":fy:function(){return fy};
		if (typeof(area)!="function")
			area.y1(function(d,i){return ret.scale.y()(yfunc(d,i));})
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
	}
	
	ret.autosize = function(ax, ay){
		if (ax || ay)
			area = function(d){
				var xscale, yscale;
				if (ax){
					var xval = d.map(xfunc)
					xscale = ret.scale.x().copy().domain([Math.min.apply(null,xval),Math.max.apply(null,xval)])
				}else
					xscale = ret.scale.x()
				if (ay){
					var yval = d.map(yfunc)
					yscale = ret.scale.y().copy().domain([Math.min.apply(null,yval),Math.max.apply(null,yval)])
				}else
					yscale = ret.scale.y()
				return d3.svg.area()
					.x(function(d,i){return xscale(xfunc(d,i));})
					.y1(function(d,i){return yscale(yfunc(d,i));})
					.y0(yscale(0))
			}
		else{
			area = d3.svg.area().y0(yscale(0))
			ret.x(xfunc).y(yfunc)
		}
	}
	
	return sparkchart(ret).x(xfunc).y(yfunc);
}

function sparkbar(){
	var barfunc = function(d){return d;}
	var ret = function(selection){
		selection.select(".sparkbar").remove();
		selection
			.append("svg")
				.attr("class", "sparkbar")
				.attr("width", ret.width())
				.attr("height",ret.height())
			.append("rect")
				.attr("x",function(d){return Math.min(ret.scale.x()(0), ret.scale.x()(barfunc(d)));})
				.attr("y", 0)
				.attr("width", function(d){return Math.abs(ret.scale.x()(0) - ret.scale.x()(barfunc(d)));})
				.attr("height", ret.height())
	}
	
	ret.data = function(d){
		if (arguments.length==0)return barfunc;
		if (typeof(d)=="function")
			barfunc = d;
		else
			barfunc = function(){return d;}
		return ret;
	}
	ret.autosize = function(){}
	return sparkchart(ret)
}