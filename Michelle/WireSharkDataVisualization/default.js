
//  Reference: render function from wsheng.  stacked area chart:  http://bl.ocks.org/mbostock/3885211
function render_axises(svg, x, y, height) {
	var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
 	 var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
	
	 svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

     svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

function render_legends(svg, protocol_names, color, width)  {
	    var legend = svg.selectAll(".legend")
	  			.data(protocol_names).enter()
	  			.append("g")
		        .attr("class", "legend")
        		.attr("x", width-65)
		        .attr("y", 25)
		        .attr("height", 300)
        		.attr("width", 300);

        legend.append("text")
		      .attr("x", width-65)
      		  .attr("y", function(target_protocol) {
				  //console.log(15*protocol_names.indexOf(target_protocol));
				  return 15*protocol_names.indexOf(target_protocol);})
			  .text(function(target_protocol) {return target_protocol;});
		
		legend.append("rect")
			  .attr("x", width-35)
			  .attr("y",function(target_protocol) {return (15*protocol_names.indexOf(target_protocol)-10);})
			  .attr("width",12)
			  .attr("height",12)
			  .style("fill",function(target_protocol) {
				  //console.log(target_protocol+","+color(target_protocol));
				  return color(target_protocol);});
}

/*Stacked Area Chart.*/
$(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  var x = d3.scale.linear()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);
    
  var color = d3.scale.category20();
  var area = d3.svg.area()
      .x(function(d) { return x(d.TIME_SPAN); })
      .y0(function(d) {return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
	  .values(function(d) {
		  return d.values; });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("MultipleProtocol.tsv", function(error, data) {
	data.forEach(function(d) {
		d.TIME_SPAN = parseInt(d.TIME_SPAN);
	});  
	var protocol_names = d3.keys(data[0]).filter(function(key) {return key != "TIME_SPAN"; });
	color.domain(protocol_names);

	 
	var protocols = stack(color.domain().map(function(name) {
		  return {
			  name : name,
		      values : data.map(function(d) {
				  return {TIME_SPAN: d.TIME_SPAN, y:d[name]/2900000};
			  })
		  };
	  }));
    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
	
	var browsers = svg.selectAll(".browser")
			.data(protocols)
			.enter().append("g")
			.attr("class","browser");
	
	browsers.append("path")
			.attr("class", "area")
			.attr("d", function(d) {return area(d.values); })
			.style("fill", function(d) {return color(d.name); });


	 render_legends(svg, protocol_names, color,width);
  	 render_axises(svg,x,y,height);
	});
  });


// DNS protocol 
$(function() {
  var target_protocol = "DNS";
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  var x = d3.scale.linear()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);
  var color = d3.scale.category20();
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
  d3.tsv("MultipleProtocol.tsv", function(error, data) {
    data = data.map(function(d) {
      d.TIME_SPAN = parseInt(d.TIME_SPAN);
      d.DNS = parseInt(d.DNS);
      return d;
    });

	var area = d3.svg.area()
      .x(function(d) { return x(d.TIME_SPAN); })
      .y0(height)
      .y1(function(d) { return y(d.DNS); });

    var protocol_names = d3.keys(data[0]).filter(function(key) {return key != "TIME_SPAN"; });
    	x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
    	y.domain([0, d3.max(data.map(function(d) { return d.DNS; })) * 1.1]);
		color.domain(protocol_names);
    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
    y.domain([0, d3.max(data.map(function(d) { return d.DNS; })) * 1.1]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
		.style("fill",color("DNS"));

   	render_legends(svg, protocol_names, color,width);
	render_axises(svg,x,y,height);
	});
});

// TCP protocol.
$(function() {
  var target_protocol = "TCP";
  var margin = {top: 20, right: 20, bottom: 30, left: 60},
      width = 960 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("MultipleProtocol.tsv", function(error, data) {
    data = data.map(function(d) {
      d.TIME_SPAN = parseInt(d.TIME_SPAN);
      d.TCP= parseInt(d.TCP);
      return d;
    });
	
  var area = d3.svg.area()
      .x(function(d) { return x(d.TIME_SPAN); })
      .y0(height)
      .y1(function(d) { return y(d.TCP); });

	var protocol_names = d3.keys(data[0]).filter(function(key) {return key != "TIME_SPAN"; });
    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
    y.domain([0, d3.max(data.map(function(d) { return d.TCP; })) * 1.1]);
	color.domain(protocol_names);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", color("TCP"));

	render_legends(svg, protocol_names, color,width);
	render_axises(svg,x,y,height);
 	});
});


