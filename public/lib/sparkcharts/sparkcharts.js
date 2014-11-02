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
	return sparkchart.domain(0,0);
}

function sparkline(){
	var xfunc = function(d,i){return i;}, 
		yfunc = function(d){return d;}, 
		datafunc = function(d){return d;};
	var ret = function(selection){
		var domain = ret.domain();
		var ax = domain[0][0] == 0 && domain[0][1] == 0
		var ay = domain[1][0] == 0 && domain[1][1] == 0
		console.log([ax,ay])
		var line = (ax || ay)?
			function(d){
				var scalex = ax?ret.scale.x().copy().domain([Math.min.apply(null,d.map(xfunc)), Math.max.apply(null,d.map(xfunc))]):ret.scale.x()
				var scaley = ay?ret.scale.y().copy().domain([Math.min.apply(null,d.map(yfunc).concat([0])), Math.max.apply(null,d.map(yfunc).concat([0]))]):ret.scale.y()
				return d3.svg.line().x(function(d,i){return scalex(xfunc(d,i))}).y(function(d,i){return scaley(yfunc(d,i))})(d)
			}:
			d3.svg.line().x(function(d,i){return ret.scale.x()(xfunc(d,i))}).y(function(d,i){return ret.scale.y()(yfunc(d,i))})
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
		xfunc = typeof(fx) == "function"?fx:function(){return fx;};
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = typeof(fy) == "function"?fy:function(){return fy;};
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
	}
	
	return sparkchart(ret);
}

function sparkarea(){
	var xfunc = function(d,i){return i;}, 
		yfunc = function(d){return d;}, 
		datafunc = function(d){return d;};
	var ret = function(selection){
		var domain = ret.domain();
		var ax = domain[0][0] == 0 && domain[0][1] == 0
		var ay = domain[1][0] == 0 && domain[1][1] == 0
		var area = (ax || ay)?
			function(d){
				var scalex = ax?ret.scale.x().copy().domain([Math.min.apply(null,d.map(xfunc)), Math.max.apply(null,d.map(xfunc))]):ret.scale.x()
				var scaley = ay?ret.scale.y().copy().domain([Math.min.apply(null,d.map(yfunc).concat([0])), Math.max.apply(null,d.map(yfunc).concat([0]))]):ret.scale.y()
				return d3.svg.area().x(function(d,i){return scalex(xfunc(d,i))}).y1(function(d,i){return scaley(yfunc(d,i))}).y0(scaley(0))(d)
			}:
			d3.svg.area().x(function(d,i){return ret.scale.x()(xfunc(d,i))}).y1(function(d,i){return ret.scale.y()(yfunc(d,i))}).y0(ret.scale.y()(0))
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
		return ret;
	}
	
	ret.y = function(fy){
		if (arguments.length==0) return yfunc;
		yfunc = typeof(fy) == "function"?fy:function(){return fy};
		return ret;
	}
	
	ret.data = function(d){
		if (arguments.length==0) return datafunc;
		datafunc = d;
		return ret;
	}
	
	return sparkchart(ret);
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