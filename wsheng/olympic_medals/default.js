$(document).ready(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 140},
      width = 960 - margin.left - margin.right,
      height = 3000 - margin.top - margin.bottom;

  var tip = d3.tip()
      .attr('class', 'tip')
      .offset([0, 10])
      .direction('e')
      .html(function(d) {
        return "" +
        "<div>" + "Gold: "   + d.Gold   + "</div>" +
        "<div>" + "Silver: " + d.Silver + "</div>" +
        "<div>" + "Bronze: " + d.Bronze + "</div>";
      });

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.ordinal()
      .rangeBands([0, height], 0.1, 0.5);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

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

    x.domain([0, d3.round(max_total * 1.1)]);
    y.domain(keys);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.call(tip);

    var bars = svg.selectAll(".bar")
        .data(data).enter()
      .append("g")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    bars.append("rect")
        .attr("class", "bar bar-gold")
        .attr("x", function(d) { return x(2); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Gold); });

    bars.append("rect")
        .attr("class", "bar bar-silver")
        .attr("x", function(d) { return x(2 + d.Gold); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Silver); });

    bars.append("rect")
        .attr("class", "bar bar-bronze")
        .attr("x", function(d) { return x(2 + d.Gold + d.Silver); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Bronze); });

    svg.select("g.y.axis").selectAll("g.tick")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function() {
      d3.select("input").property("checked", true).each(change);
    }, 1000);

    function change() {
      clearTimeout(sortTimeout);

      // Copy-on-write since tweens are evaluated after a delay.
      var y0 = y.domain(data.sort(this.checked
          ? function(a, b) { return b.Total - a.Total; }
          : function(a, b) { return d3.ascending(a.name, b.name); })
          .map(function(d) { return d.name; }))
          .copy();

      var transition = svg.transition().duration(250),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("y", function(d) { return y0(d.name); });

      transition.select(".y.axis")
          .call(yAxis)
        .selectAll("g")
          .delay(delay);
    }
  });
});
