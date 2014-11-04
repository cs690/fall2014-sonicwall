$(function() {
	$.getJSON("../sfgate_summary.json", function(data) {
		// var lengthOverTimeX = d3.max(data.map(function(d) {
		//     return d.LengthOverTime.length;
		// }));
		// var lengthOverTimeY = d3.max(data.map(function(d) {
		//     return d3.max(d.LengthOverTime);
		// }));
		var TotalLengthX = d3.max(data.map(function(d) {
			return d.TotalLength;
		}));

		// var sline = sparkline()
		//     .domain(lengthOverTimeX, lengthOverTimeY)
		//     .size(100, 20)
		//     .data(function(d){ return d.LengthOverTime; });

		var sarea =sparkarea()
			// .domain(lengthOverTimeX, lengthOverTimeY)
			.size(100,20)
			.data(function(d){ return d.LengthOverTime; });

		var sbar = sparkbar()
			.domain(TotalLengthX)
			.size(100, 20)
			.data(function(d){ return d.TotalLength; });

		var table = d3.select("tbody");
		var rows = table.selectAll("tr")
				.data(data).enter()
			.append("tr");

		rows.append("td").text(function(d) { return d.Source; });
		rows.append("td").text(function(d) { return d.SourceCountry + ', ' + d.SourceCity; });
		rows.append("td").text(function(d) { return d.Destination; });
		rows.append("td").text(function(d) { return d.DestinationCountry + ', ' + d.DestinationCity; });
		rows.append("td").text(function(d) { return d.Protocol; });

		rows.append("td")
			.call(sarea)
			.select("path")
			.style("stroke","#0000ff");

		rows.append("td")
			.call(sbar)
			.select("rect")
			.style("fill","#888");

		// sortable table
		$("#target").tablesorter({
			headers: {
				0: { sorter: "text" },
				1: { sorter: "text" },
				2: { sorter: "text" },
				3: { sorter: "text" },
				4: { sorter: "text" },
				5: { sorter: false },
				6: { sorter: false }
			}
		});
	});
});