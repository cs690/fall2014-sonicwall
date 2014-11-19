var width = 860,
    height = width / 2;
 
var opacity = d3.scale.linear()
    .domain([0, 24*3600*1000])
    .range([1, 0.5]);
 
var radius = d3.scale.pow()
    .domain([0, 10])
    .range([0, 75]);
 
var projection = d3.geo.naturalEarth()
    .translate([width/2, height/2])
    .scale(150/900*width);
 
var path = d3.geo.path()
    .projection(projection);
 
var graticule = d3.geo.graticule();
 
var svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);
 
svg.append("path")
    .datum(graticule.outline)
    .attr("class", "water")
    .attr("d", path);
 
svg.append("g")
    .attr("class", "graticule")
  .selectAll("path")
    .data(graticule.lines)
  .enter().append("path")
    .attr("d", path);
 
var focus = svg.append("text")
    .attr("class", "focus");
 
d3.json("world-110m.json", function(error, world) {
 
  svg.insert("path", ".graticule")
      .datum(topojson.object(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);
 
  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a.id !== b.id; }))
      .attr("class", "borders")
      .attr("d", path);
 
});
 
 d3.json('tectonic.json', function(err, data) {
 
  svg.insert("path", ".graticule")
      .datum(topojson.object(data, data.objects.tec))
      .attr("class", "tectonic")
      .attr("d", path);
});  
 
//d3.json('https://raw.githubusercontent.com/sjengle/cs690-sonicwall/gh-pages/public/sfgate_summary.json', function(err, data) {
	d3.json("sfgate_summary.json", function(err,data) {
  	var connection = svg.append("g")
    	.attr("class", "connection")
      	.selectAll(".connection")
      //.data(data.features.reverse())
	 .data(data)
     .enter().append("g")
        .attr("class", "connection")
        .attr("transform", function(d) {
          //return "translate(" + projection(d.geometry.coordinates)[0] + "," + projection(d.geometry.coordinates)[1] + ")";
		  console.log(d.SourceLongitude)
		  return "translate(" + projection(d.SourceLongitude) + "," + projection(d.SourceLatitude) + ")";
        })
        .attr("opacity", function(d) {
          return opacity(d.TotalLength)
        })
        .on("mouseover", function() {
          focus.style("opacity", 1);
        })
        .on("mouseout", function() {
          focus.style("opacity", 0);
        })
        .on("mousemove", function(d) {
		//var o = projection(d.geometry.coordinates);
          //var o = projection(d);
          focus
            //.text(d.properties.mag + ' ' + moment(+d.properties.time).calendar())
			.text("hello")
            .attr("dy", +20)
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + projection(d.SourceLongtitude)+ "," + projection(d.SourceLatitude)+ ")" );
        });
 
  connection.append("circle")
        .attr("r", 2)
        .style("fill", function(d) {
          return "rgb(222, 45, 38)"; // color( +d.geometry.coordinates[2] );
        });
 
  setInterval(function() {
 
    connection.append("circle")
        .attr("r", 0)
        .style("stroke", function(d) {
          return "yellow"; // color( +d.geometry.coordinates[2] );
        })
  		.style("fill", "white")
        .style("stroke-width", 2)
      .transition()
        .ease("linear")
        .duration(function(d) { return 125*radius(d.TotalLength); })
        .attr("r", function(d) { return radius(d.TotalLength); })
        .style("stroke-opacity", 0)
        .style("stroke-width", 0)
        .remove();
 
  }, 4000);
 
});
