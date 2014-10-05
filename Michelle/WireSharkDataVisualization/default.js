$(function() {
  var target_protocol = "HTTP";
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

  d3.tsv("HTTP.tsv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d.HTTP);
      return d;
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data.map(function(d) { return d.y; })) * 1.1]);

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", function(d) { return color(0); });

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

    legend.append("rect")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color(0));

    legend.append("text")
      .attr("x", width-65)
      .attr("y", 25)
	  .style("font-size","20px")
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

$(function() {
  var target_protocol = "DNS";
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

  d3.tsv("DNS.tsv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d.DNS);
      return d;
    });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain([0, d3.max(data.map(function(d) { return d.y; })) * 1.1]);

    svg.append("pathh")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", function(d) { return color(10); });

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("x", width-65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

    legend.append("rect")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", color(10));

    legend.append("text")
      .attr("x", width-65)
      .attr("y", 25)
	  .style("font-size","20px")
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
