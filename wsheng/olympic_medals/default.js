$(document).ready(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("data.tsv", function(error, input_data) {
    // Athlete
    // Age
    // Country
    // Year
    // Sport
    // Gold Medals
    // Silver Medals
    // Bronze Medals
    // Total Medals

    var summary = {};
    input_data.forEach(function(d) {
      if (summary[d.Country] == undefined) {
        summary[d.Country] = {
          Total:  parseInt(d["Total Medals"]),
          Gold:   parseInt(d["Gold Medals"]),
          Silver: parseInt(d["Silver Medals"]),
          Bronze: parseInt(d["Bronze Medals"])
        }
      } else {
        summary[d.Country].Total  += parseInt(d["Total Medals"])
        summary[d.Country].Gold   += parseInt(d["Gold Medals"])
        summary[d.Country].Silver += parseInt(d["Silver Medals"])
        summary[d.Country].Bronze += parseInt(d["Bronze Medals"])
      }
    });
    var keys = [], max_total = 0;
    var data = d3.map(summary).entries().map(function(d) {
      keys.push(d.key);
      max_total = d3.max([max_total, d.value.Total]);
      return {
        name: d.key,
        Total: d.value.Total,
        Gold: d.value.Gold,
        Silver: d.value.Silver,
        Bronze: d.value.Bronze
      };
    });

    x.domain(keys);
    y.domain([0, max_total]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.Total); })
        .attr("height", function(d) { return height - y(d.Total); });

    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function() {
      d3.select("input").property("checked", true).each(change);
    }, 2000);

    function change() {
      clearTimeout(sortTimeout);

      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(data.sort(this.checked
          ? function(a, b) { return b.Total - a.Total; }
          : function(a, b) { return d3.ascending(a.name, b.name); })
          .map(function(d) { return d.name; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d.name); });

      transition.select(".x.axis")
          .call(xAxis)
        .selectAll("g")
          .delay(delay);
    }
  });
});
