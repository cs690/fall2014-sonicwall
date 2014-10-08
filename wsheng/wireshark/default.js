$(function() {

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
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg2 = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv", function(error, data) {
    // change value from string to int
    data = data.map(function(d) {
      var v = {};
      d3.map(d).forEach(function(key, value) {
        v[key] = parseInt(value);
      });
      return v;
    });

    // get protocols' names
    var protocol_names = d3.keys(data[0]).filter(function(key) { return key !== "TIME_SPAN"; });

    // setup domains
    color.domain(protocol_names);
    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
    y.domain(d3.extent(data, function(d) {
      return d3.sum(protocol_names.map(function(name) {
        return d[name];
      })) * 1.1;
    }));

    var protocols = stack(color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {x: d.TIME_SPAN, y: d[name]};
        })
      };
    }));


    // Stack protocols
    // Area
    svg.selectAll(".protocol")
        .data(protocols).enter()
      .append("g")
        .attr("class", "protocol")
      .append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); });

    // Legends
    var legend = svg.selectAll(".legend")
        .data(protocol_names).enter()
      .append("g")
        .attr("class", "legend")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

    legend.append("rect")
      .attr("x", width - 65)
      .attr("y", function(name) { return 25 * protocol_names.indexOf(name); })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(name) { return color(name) });

    legend.append("text")
      .attr("x", width - 65)
      .attr("y", function(name) { return 25 * protocol_names.indexOf(name); })
      .text(function(name) { return name; });

    // Axises
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


    // Single protocol
    var target_protocol = "TCP";

    data2 = data.map(function(d) {
      d.x = d.TIME_SPAN;
      d.y = d[target_protocol];
      return d;
    });
    var area2 = d3.svg.area()
        .x(function(d) { return x(d.x); })
        .y0(y(0))
        .y1(function(d) { return y(d.y); });

    svg2.append("path")
        .datum(data2)
        .attr("class", "area")
        .attr("d", area2)
        .style("fill", function(d) {
          return color(target_protocol);
        });

    // Legend
    var legend = svg2.append("g")
        .attr("class", "legend")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("height", 300)
        .attr("width", 300);

    legend.append("rect")
        .attr("x", width - 65)
        .attr("y", 25)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color(target_protocol));

    legend.append("text")
        .attr("x", width - 65)
        .attr("y", 25)
        .text(target_protocol);

    // Axis
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis);

  });

});
