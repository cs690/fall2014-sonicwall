// Stack protocols
$(function() {

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var area = d3.svg.area()
      .x(function(d) { return x(d.TIME_SPAN); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data.csv", function(error, data) {
    data = data.map(function(d) {
      var v = {};
      d3.map(d).entries().forEach(function(t) {
        v[t.key] = parseInt(t.value);
      });
      return v;
    });

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TIME_SPAN"; }));

    var protocols = stack(color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {TIME_SPAN: d.TIME_SPAN, y: d[name]};
        })
      };
    }));

    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN; }));
    y.domain(d3.extent(data, function(d) {
      var t = 0;
      d3.map(d).entries().forEach(function(entry) {
        if (entry.key !== "TIME_SPAN") {
          t += parseInt(entry.value);
        };
      });
      return t;
    }).map(function(limit) { return limit * 1.1; }));

    // Area
    var protocol = svg.selectAll(".protocol")
        .data(protocols)
      .enter().append("g")
        .attr("class", "protocol");

    protocol.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); });

    // Legends
    var protocol_names = d3.map(data[0]).keys();
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
  });

});


// Single protocol
$(function() {

  var target_protocol = "TCP";

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

  d3.csv("data.csv", function(error, data) {
    data = data.map(function(d) {
      d.x = parseInt(d.TIME_SPAN);
      d.y = parseInt(d[target_protocol]);
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
        .attr("x", width - 65)
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
      .attr("x", width - 65)
      .attr("y", 25)
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

