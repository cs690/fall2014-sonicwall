function render_axises (svg, x, y, height) {
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  svg.selectAll(".x.axis").remove();
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.selectAll(".y.axis").remove();
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
}

function render_legends (svg, names, color, width, callback) {
  var legend = svg.selectAll(".legend")
      .data(names).enter()
    .append("g")
      .attr("class", "legend")
      .attr("x", width - 65)
      .attr("y", 25)
      .attr("height", 300)
      .attr("width", 300);

  legend.append("rect")
    .attr("x", width - 65)
    .attr("y", function(name) { return 15 * names.indexOf(name) - 10; })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(name) { return color(name) })
    .on("click", function(name) {
      if (this.style.opacity == 0.1) {
        // enable it
        this.style.opacity = 1;
        svg.enabledNames.push(name);
        if (callback) {
          callback(svg);
        }
      } else {
        // disable it
        this.style.opacity = 0.1;
        var index = svg.enabledNames.indexOf(name);
        if (index > -1) {
          svg.enabledNames.splice(index, 1);
        };
        if (callback) {
          callback(svg);
        };
      };
    });

  legend.append("text")
    .attr("x", width - 45)
    .attr("y", function(name) { return 15 * names.indexOf(name); })
    .text(function(name) { return name; });
}

function render_area_chart (svg, margin, width, height, x, y, data, names, color) {
  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var protocols = stack(svg.enabledNames.map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {x: d.TIME_SPAN, y: d[name]};
      })
    };
  }));

  var y_values = [];
  protocols.forEach(function(protocol) {
    protocol.values.forEach(function(value) {
      y_values.push(value.y0);
      y_values.push((value.y0 + value.y) * 1.1);
    });
  });
  y.domain(d3.extent(y_values));

  svg.selectAll(".protocol").remove();

  svg.selectAll(".protocol")
      .data(protocols).enter()
    .append("g")
      .attr("class", "protocol")
    .append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); });

  render_axises(svg, x, y, height);
}

function render_100_area_chart (svg, margin, width, height, x, y, data, names, color) {
  var y_sum = {};
  data.forEach(function(d) {
    y_sum[d.TIME_SPAN] = d3.sum(names.map(function(name) { return d[name]; }));
  });

  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(function(d) { return y(d.y0 / y_sum[d.x]); })
      .y1(function(d) { return y((d.y0 + d.y) / y_sum[d.x]); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });

  var protocols = stack(names.map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {x: d.TIME_SPAN, y: d[name]};
      })
    };
  }));

  y.domain([0, 1]);

  svg.selectAll(".protocol")
      .data(protocols).enter()
    .append("g")
      .attr("class", "protocol")
    .append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { return color(d.name); });

  render_axises(svg, x, y, height);
}


$(function() {

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category20();

  d3.csv("data.csv", function(error, data) {
    // change value from string to int
    data = data.map(function(d) {
      var v = {};
      d3.map(d).forEach(function(key, value) {
        v[key] = parseInt(value);
      });
      return v;
    });

    // setup
    var protocol_names = d3.keys(data[0]).filter(function(key) { return key !== "TIME_SPAN"; });
    color.domain(protocol_names);
    x.domain(d3.extent(data, function(d) { return d.TIME_SPAN * 1.1; }));

    // Stack protocols
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.enabledNames = protocol_names.slice(0);
    render_legends(svg, protocol_names, color, width, function(svg) {
      render_area_chart(svg, margin, width, height, x, y, data, protocol_names, color);
    });
    render_area_chart(svg, margin, width, height, x, y, data, protocol_names, color);

    // 100% stacked area plot
    var svg2 = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.enabledNames = protocol_names.slice(0);
    render_legends(svg2, protocol_names, color, width);
    render_100_area_chart(svg2, margin, width, height, x, y, data, protocol_names, color);
  });

});
