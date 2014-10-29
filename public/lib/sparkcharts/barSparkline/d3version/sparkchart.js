// Reference: KaiMing Yang's sparkcharts.js

function sparkchart(sparkchart){
	var scale = {x:d3.scale.linear(), y:d3.scale.linear()}
	sparkchart.width = function(w){
		if (arguments.length==0) return Math.max.apply(null, scale.x.range()) - Math.min.apply(null,scale.x.range());
		if (w > 0) {
			scale.x.range([0,w]); }
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
function sparkbar() {
	//default data function.
	var datafunc = function(d){ return d;} 

	var ret = function(selection) {
		selection.select(".sparkbar");
	//each svg has a bar.
	selection.append("svg")
		.attr("class","sparkbar")
		.attr("width", 100)
		.attr("height", 20)
		.append("rect")
		.attr("x", function(d) {
			return ret.scale.x()(0);
		})
		.attr("y",0)
		.attr("width", function(d) {return Math.abs(ret.scale.x()(0)-ret.scale.x()(datafunc(d))); })
		.attr("height",20)
		.style("fill",function(d) {
			if(d>0) 
				return "#00ff00";
			else 
				return "red";
			});
	}
	//rewrite datafunc of ret.
	ret.data = function(d) {
		//if argument d is empty, then use datafunc by default.
		if(arguments.length == 0) return barfunc;
		//rewrite the datafunc according to the argument(function or value)
		if(typeof(d) == "function")
			datafunc = d;
		else 
			datafunc = function() {return d;}
		return ret;
	}
	return sparkchart(ret);
} 
