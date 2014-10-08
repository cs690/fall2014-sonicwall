var maxheight = 15000;
// HTTP protocol
$(function() {
  var target_protocol = "HTTP";
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var color = d3.scale.category20();

  /*var HTTP_tip = d3.tip()
	  .attr('class','d3-tip')
	  .offset([0,10])
	  .html(function(d) {
		  return ""+
		  "<strong>Year:</strong><span style='color:red'>"+d.ekei+"</span>"+"<br/>"
		  //"<div>HTTP: "+d.HTTP+"</div>"
	}); */

  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height)
      .y1(function(d) { return y(d.y); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("MultipleProtocol.tsv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d.HTTP);
      return d;
    });

	//svg.call(HTTP_tip);

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data.map(function(d) { return d.y; })) * 1.1]);
	//y.domain([0,3500000]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
	  	.style("fill", '#2ECCFA');
        //.style("fill", function(d) { return color(18); });
	  	//.on('mouseover', HTTP_tip.show)
	  	//.on('mouseout', HTTP_tip.hide);

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);
	

    legend.append("rect")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", '#2ECCFA');
	  
  	  legend.append("text")
      .attr("x", width-65)
      .attr("y", 25)
	  .style("font-size","16px")
      .text("HTTP");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  });

});

// DNS protocol 
$(function() {
  var target_protocol = "DNS";
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var color = d3.scale.category20();

  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height)
      .y1(function(d) { return y(d.y); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

  d3.tsv("MultipleProtocol.tsv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d.DNS);
      return d;
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data.map(function(d) { return d.y; })) * 1.1]);
	//y.domain([0,3500000]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
	  	.style("fill",'#2ECCFA')
        /*.style("fill", function(d) { 
			console.log(color(2));
			return color(2); });  */

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

  legend.append("rect")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", '#2ECCFA');

    legend.append("text")
      .attr("x", width-65)
      .attr("y", 25)
	  .style("font-size","16px")
      .text("DNS");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  });

});

// TCP protocol.
$(function() {
  var target_protocol = "TCP";
  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var color = d3.scale.category20();

  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(height)
      .y1(function(d) { return y(d.y); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("MultipleProtocol.tsv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d.TCP);
      return d;
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
   	y.domain([0, d3.max(data.map(function(d) { return d.y; })) * 1.1]);
	//y.domain([0,3500000]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
	  	.style("fill", '#2ECCFA');
        //.style("fill", function(d) { return color(0); });

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

    legend.append("rect")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("width", 14)
      .attr("height", 14)
      .style("fill", '2ECCFA');

    legend.append("text")
      .attr("x", width-65)
      .attr("y", 25)
	  .style("font-size","16px")
      .text(target_protocol);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
  });

});


