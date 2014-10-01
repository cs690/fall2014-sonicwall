$(document).ready(function() {

	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
    .range([height, 0]);

	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

	var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Year:</strong><span style='color:red'>"+d.year+"</span>"+"<br/>"+
	"<strong>Medals:</strong> <span style='color:red'>" + d.totalmedals + "</span>";})
	//return "<strong>Frequency:</strong> <span style='color:red'>" + d.totalmedals + "</span>";})
debugger

	var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
	//.attr("width", width/2)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	d3.tsv("data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.totalmedals; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-30," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("total medals");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand()/2)
      .attr("y", function(d) { return y(d.totalmedals); }) 
	  .attr("height", function(d) { return height-y(d.totalmedals); })
	  .on("mouseover", tip.show)
	  .on("mouseout", tip.hide)
	});


function type(d) {
  d.totalmedals = +d.totalmedals;
  return d;
}		
});
