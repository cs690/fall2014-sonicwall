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
	return sparkchart;
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
				.datum(datafunc)
				.attr("d", line);

	}
	
	ret.x = function(fx){
		if (arguments.length==0) return xfunc;
		xfunc = fx;
		if (typeof(xfunc)=="function")
			line.x(function(d,i){return ret.scale.x()(xfunc(d,i));})
		else
			line.x(ret.scale.x()(xfunc))
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = fy;
		if (typeof(yfunc)=="function")
			line.y(function(d,i){return ret.scale.y()(yfunc(d,i));})
		else
			line.y(ret.scale.y()(yfunc))
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
	}
	
	return sparkchart(ret).x(xfunc).y(yfunc);
}

function sparkarea(){
	var xfunc = function(d,i){return i;}, 
		yfunc = function(d){return d;}, 
		datafunc = function(d){return d;};
	var area = d3.svg.area();
	var ret = function(selection){
		area.y0(ret.scale.y()(0));
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
		xfunc = fx;
		if (typeof(xfunc)=="function")
			area.x(function(d,i){return ret.scale.x()(xfunc(d,i));})
		else
			area.x(ret.scale.x()(xfunc))
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = fy;
		if (typeof(yfunc)=="function")
			area.y1(function(d,i){return ret.scale.y()(yfunc(d,i));})
		else
			area.y1(ret.scale.y()(yfunc))
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
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
	return sparkchart(ret)
}