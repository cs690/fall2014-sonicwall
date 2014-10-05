$(document).ready(function() {
/*Reference: WanZhangSheng's Olypmic Medal Bar Charts.*/
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
	/*Keys are countries, max_total is the maximum TotalMedals, as a range of input of xAxis/yAxis(domain)*/
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

  var margin = {top: 20, right: 20, bottom: 30, left: 20},
      width = 2000 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var yScale =  d3.scale.linear()
	  .domain([0,d3.round(max_total * 1.1)])
      .range([height, 0]);

  var xScale = d3.scale.ordinal()
	  .domain(keys)
      .rangeRoundBands([0, width], .2, 1);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
	//TODO transform translate .
      .attr("transform", "translate(" + (margin.left*2)+ "," + margin.top + ")");

  svg.append("g")
        .attr("class", "x axis")
		.attr("transform","translate(0,"+height+")")
        .call(xAxis);

  svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
		.append("text")
      	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
      	.text("Medals"); 

  var tip = d3.tip()
      .attr("class", "tip")
      .offset([0, 10])
      .direction('e')
      .html(function(d) {
        return "" +
        "<div>" + "Gold: "   + d.Gold   + "</div>" +
        "<div>" + "Silver: " + d.Silver + "</div>" +
        "<div>" + "Bronze: " + d.Bronze + "</div>";
      });

  svg.call(tip);

    svg.selectAll(".bar")
        .data(data)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.name); })
		.attr("width",xScale.rangeBand())
		.attr("y", function(d) {return (yScale(d.Total)); })
        .attr("height", function(d) {return (height - yScale(d.Total)); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function() {
      d3.select("input").property("checked", true).each(change);
    }, 2000);

    function change() {
      clearTimeout(sortTimeout);

      // Copy-on-write since tweens are evaluated after a delay.
      var y0 = y.domain(data.sort(this.checked
          ? function(a, b) { return b.Total - a.Total; }
          : function(a, b) { return d3.ascending(a.name, b.name); })
          .map(function(d) { return d.name; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("y", function(d) { return y0(d.name); });

      transition.select(".x.axis")
          .call(xAxis)
        .selectAll("g")
          .delay(delay);
    }
  });
});
