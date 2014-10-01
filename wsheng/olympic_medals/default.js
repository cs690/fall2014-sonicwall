$(document).ready(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 140},
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var gold_tip = d3.tip()
      .attr('class', 'tip')
      .offset([0, 10])
      .direction('e')
      .html(function(d) { return "Gold: " + d.Gold; });
  var silver_tip = d3.tip()
      .attr('class', 'tip')
      .offset([0, 10])
      .direction('e')
      .html(function(d) { return "Silver: " + d.Silver; });
  var bronze_tip = d3.tip()
      .attr('class', 'tip')
      .offset([0, 10])
      .direction('e')
      .html(function(d) { return "Bronze: " + d.Bronze; });
  var total_tip = d3.tip()
      .attr('class', 'tip')
      .offset([0, 10])
      .direction('e')
      .html(function(d) {
        return "" +
        "<div>Total: " + d.Total + "</div>" +
        "<div>Gold: " + d.Gold + "</div>" +
        "<div>Silver: " + d.Silver + "</div>" +
        "<div>Bronze: " + d.Bronze + "</div>";
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
      .orient("left")
      .tickSize(0);

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.tsv("data.tsv", function(error, input_data) {

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
    var data = d3.map(summary).entries().map(function(d) {
      return {
        name: d.key,
        Total: d.value.Total,
        Gold: d.value.Gold,
        Silver: d.value.Silver,
        Bronze: d.value.Bronze
      };
    });

    data.sort(function(a, b) {
      return b.Total - a.Total;
    });
    data = data.slice(0, 20);

    x.domain([0, d3.max(data.map(function(d) { return d.Total; })) * 1.1]);
    y.domain(data.map(function(d) { return d.name; }));

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + width/5 + ",0)")
        .call(d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(5)
              .tickSize(-height, 0, 0)
              .tickFormat(""));

    svg.call(gold_tip);
    svg.call(silver_tip);
    svg.call(bronze_tip);
    svg.call(total_tip);

    var bars = svg.selectAll(".bar")
        .data(data).enter()
      .append("g")
        .attr("class", "bars");

    bars.append("rect")
        .attr("class", "bar bar-gold")
        .attr("x", function(d) { return x(2); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Gold); })
        .on('mouseover', gold_tip.show)
        .on('mouseout', gold_tip.hide);

    bars.append("rect")
        .attr("class", "bar bar-silver")
        .attr("x", function(d) { return x(2 + d.Gold); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Silver); })
        .on('mouseover', silver_tip.show)
        .on('mouseout', silver_tip.hide);

    bars.append("rect")
        .attr("class", "bar bar-bronze")
        .attr("x", function(d) { return x(2 + d.Gold + d.Silver); })
        .attr("y", function(d) { return y(d.name); })
        .attr("height", y.rangeBand())
        .attr("width", function(d) { return x(d.Bronze); })
        .on('mouseover', bronze_tip.show)
        .on('mouseout', bronze_tip.hide);

    svg.selectAll("g.y.axis g.tick")
        .on('mouseover', total_tip.show)
        .on('mouseout', total_tip.hide);
  });
});
