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

    var selectedRow = undefined; // if some row is clicked(locked)

    var table = d3.select("tbody")
      .on('mouseout', function() {
        if (selectedRow !== undefined) { return; };
        draw_g1($('#g1'), subsetData);
      });

    function draw_sub_g1 (d) {
      var subData = subsetData.filter(function(sub) {
        return sub.Destination === d.Destination &&
        sub.Source === d.Source &&
        sub.Protocol === d.Protocol;
      });
      draw_g1($('#g1'), subData);
    }

    var rows = table.selectAll("tr")
        .data(data).enter()
      .append("tr")
      .on('mouseover', function(d) {
        if (selectedRow !== undefined) { return; };
        draw_sub_g1 (d);
      })
      .on('click', function(d) {
        if (selectedRow !== undefined) {
          $(selectedRow).removeClass('selected');
          if (selectedRow === this) {
            selectedRow = undefined;
            return;
          };
        };
        $(this).addClass('selected');
        selectedRow = this;
        draw_sub_g1 (d);
      });

    table;

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
