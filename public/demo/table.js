$(function() {
  function draw_sub_g1 (data) {
    var subData = subsetData.filter(function(sub) {
      return data.filter(function(d) {
        return sub.Destination === d.Destination &&
        sub.Source === d.Source &&
        sub.Protocol === d.Protocol;
      }).length > 0;
    });
    draw_g1($('#g1'), subData);
  }


  $.getJSON("../sfgate_summary.json", function(data) {
    var TotalLengthX = d3.max(data.map(function(d) {
      return d.TotalLength;
    }));

    // var sline = sparkline()
    //     .domain(lengthOverTimeX, lengthOverTimeY)
    //     .size(100, 20)
    //     .data(function(d){ return d.LengthOverTime; });

    var sarea =sparkarea()
      .size(100,20)
      .data(function(d){ return d.LengthOverTime; });

    var sbar = sparkbar()
      .domain(TotalLengthX)
      .size(100, 20)
      .data(function(d){ return d.TotalLength; });

    var selectedRows = {}; // if some row is clicked(locked)
    function isSelected () {
      return Object.keys(selectedRows).length > 0;
    }

    var table = d3.select("tbody")
      .on('mouseout', function() {
        if (isSelected()) { return; };
        draw_g1($('#g1'), subsetData);
      });

    var rows = table.selectAll("tr")
        .data(data).enter()
      .append("tr")
      .on('mouseover', function(datum) {
        if (isSelected()) { return; };
        draw_sub_g1 ([datum]);
      })
      .on('click', function(datum, index) {
        this.data = datum;

        if (event.metaKey || event.ctrlKey || event.shiftKey) {
          if (selectedRows[index] !== undefined) {
            $(this).removeClass('selected');
            selectedRows[index] = undefined;
          } else {
            $(this).addClass('selected');
            selectedRows[index] = this;
          };
        } else {
          var node = selectedRows[index];
          var count = 0;

          Object.keys(selectedRows).forEach(function(i) {
            if (selectedRows[i] !== undefined) {
              count++;
              $(selectedRows[i]).removeClass('selected');
              selectedRows[i] = undefined;
            };
          });

          if (!(node === this && count === 1)) {
            $(this).addClass('selected');
            selectedRows[index] = this;
          };
        };

        var data = [];
        Object.keys(selectedRows).forEach(function(i) {
          var r = selectedRows[i];
          if (r !== undefined) {
            data.push(r.data);
          };
        });

        draw_sub_g1(data);
      });

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
