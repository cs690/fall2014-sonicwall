function draw_g1(g1, data){
    var framewidth = g1.offsetWidth,
        frameheight = g1.offsetHeight;
    var margin = {top: 20, right: 30, bottom: 35, left: 50},
        width = framewidth - margin.left - margin.right,
        height = frameheight - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var detail = d3.scale.linear()
        .range([0,width/2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var detailAxis = d3.svg.axis()
        .scale(detail)
        .orient("top");

    var svg = d3.select(g1).append('svg')
                  .attr('width', framewidth)
                  .attr('height', frameheight)
                .append('g')
                  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    var color = d3.scale.category10();
    var protocol = [];
    var protocol_inv = {};
    var slice = 80;
    var time_tick = new Array(slice);
    for (var i = 0; i < time_tick.length; i++)
            time_tick[i] = i;

    function round(v){
        if (v <= 0)
            return v;
        var i = Math.floor(Math.log(v)/Math.log(10));
        v = Math.ceil(v / Math.pow(10,i-1))*Math.pow(10,i-1);
        return v;
    }

    function get_total_down(pro,t){
        var sum = 0;
        protocol.forEach(function(d){
            if (pro.Priority < d.Priority && d.Visible)
                sum += d.Data[t];
        })
        return sum;
    }

    function get_total_up(pro,t){
        var sum = 0;
        protocol.forEach(function(d){
            if (pro.Priority <= d.Priority && d.Visible)
                sum += d.Data[t];
        })
        return sum;
    }
    function update_count_domain(){
        var max = 0;
        for (var i = 0; i < slice; i++){
            var sum = 0;
            protocol.forEach(function(d){
                if (d.Visible)
                    sum += d.Data[i];
            });
            if (max < sum)
                max = sum;
        }
        y.domain([0,round(max)]);
        max = 0;
        protocol.forEach(function(d){
            if (d.Visible && d.Max > max)
                max = d.Max;
        })
        detail.domain([0,round(max)])
        var t = svg.transition().duration(750);
        for (var i = 0; i < protocol.length; i++)
            t.select(".p"+i).attr("d",protocol[i].Area(time_tick))

        svg.select(".xaxis").transition()
          .call(xAxis)
        svg.select(".yaxis").transition()
          .call(yAxis)
        svg.select(".detailaxis").transition()
          .call(detailAxis)
    }

    var drag_src;
    function update_legend(){
        d3.selectAll(".legendItem")
            .transition()
            .attr("transform", function(d,i){
                    return "translate(0,"+protocol[i].Priority*20+")";
            })
    }


    var detail_lvl = 0;
    var last_slice = -1;

    var detail_width = 6;
    function update_detail(t){
        if (detail_lvl != 0 && t >= 0 && t < slice){
            if  (t != last_slice){
                svg.select(".fade").transition().attr("visibility", "visible");
                last_slice = t;
                if (detail_lvl == 1){
                    svg.selectAll(".detailrect").transition()
                        .attr("visibility", "visible")
                        .attr("x", function(d){return x(t)-detail_width/2;})
                        .attr("y",function(d){return y(get_total_up(d,t));})
                        .attr("width",detail_width)
                        .attr("height",function(d){return y(0)-y(d.Visible?d.Data[t]:0);})
                    svg.selectAll(".detailtext").transition()
                        .attr("visibility","hidden")
                    svg.select(".detailaxis").transition()
                        .attr("visibility","hidden")
                }else{
                    svg.selectAll(".detailrect").transition()
                        .attr("visibility", "visible")
                        .attr("x", function(d){return (t>slice/2)?x(t)-detail(d.Data[t]):x(t);})
                        .attr("y",function(d){return height + (d.Priority - protocol.length) * 20;})
                        .attr("width",function(d){return d.Visible?detail(d.Data[t]):0})
                        .attr("height",15)

                    svg.selectAll(".detailtext").transition()
                        .attr("visibility","visible")
                        .attr("x",function(d){return x(t) + (t>slice/2?-1:1)*((d.Visible?detail(d.Data[t]):0)+5)})
                        .attr("y",function(d){return height + (d.Priority - protocol.length) * 20 +15})
                        .attr("text-anchor",t > slice/2?"end":"start")
                        .text(function(d){return d.Data[t].toString()})

                    var axis = svg.select(".detailaxis").transition()
                        .attr("visibility","visible")
                        .attr("transform","translate("+x(t) + "," + (height - protocol.length * 20-3)+")" + (t > slice/2?" scale(-1,1)":""))
                    axis.selectAll("text")
                        .attr("transform", t > slice/2?"scale(-1,1)":null)
                        .style("text-anchor",t > slice/2?"start":"end")
                    axis.select(".baseline")
                        .attr("y1","-1000")
                        .attr("y2","1000")
                }
            }
        }else{
            svg.select(".fade").transition().attr("visibility", "hidden");
            svg.selectAll(".detailrect").transition().attr("visibility","hidden")
            svg.selectAll(".detailtext").transition().attr("visibility","hidden")
            svg.select(".detailaxis").transition().attr("visibility","hidden")
        }
    }

    function get_idx(y){
        var proi = Math.floor(y/20);
        for (var i=0; i< protocol.length;i++)
            if (protocol[i].Priority==proi)
                return i;
    }

    var time_domain = [+data[0].Time, +data[data.length-1].Time];
    data.forEach(function(d){
        var idx
        if (!(d.Protocol in protocol_inv)){
            idx = protocol.length;
            protocol_inv[d.Protocol] = idx;
            protocol.push({Name:d.Protocol,
                           Visible:true,
                           Priority:idx,
                           Data:Array.apply(null, new Array(slice)).map(Number.prototype.valueOf,0),
                           Max:0,
                           Area:d3.svg.area()
                            .x(function(t){return x(t);})
                            .y0(function(t){
                                if (this.Visible){
                                    return y(get_total_up(this,t));
                                }else
                                    return y(0);
                            })
                            .y1(function(t){
                                if (this.Visible){
                                    return y(get_total_down(this,t));
                                }else
                                    return y(0);
                            })
            });
        }else
            idx = protocol_inv[d.Protocol]
        var t = Math.floor((+d.Time - time_domain[0]) * slice / (time_domain[1] - time_domain[0]));
        if (t == slice)
            t = slice -1;
        protocol[idx].Data[t] += 1;
        protocol[idx].Max = Math.max(protocol[idx].Max, protocol[idx].Data[t]);
    })

    x.domain([0,slice - 1])
    y.domain([0,1])

    for (var idx = 0; idx < protocol.length; idx++){
        svg.append("path")
            .attr("class","p"+idx)
            .style("fill", color(idx))
            .attr("d", protocol[idx].Area(time_tick));
    }

    var legend = d3.select("svg").append("g")
      .attr("class", "legend")
      .attr('transform', 'translate(' + (framewidth - margin.right) + ', ' + margin.top + ')');

    var legendItem = legend.selectAll(".legendItem")
      .data(protocol).enter()
      .append("g")
      .attr("class","legendItem");


    var isDragging = false;

    var drag = d3.behavior.drag()
      .on("dragstart",function(d){
        d3.event.sourceEvent.stopPropagation();
        drag_src = get_idx(d3.mouse(this.parentNode.parentNode)[1]);
      })
      .on("drag", function(d){
        isDragging = true;
        var mouseloc = d3.mouse(this.parentNode.parentNode)
        var tar = get_idx(mouseloc[1]);
        if (tar >= 0 && tar < protocol.length && tar != drag_src){
            var tmp = protocol[tar].Priority;
            protocol[tar].Priority = protocol[drag_src].Priority;
            protocol[drag_src].Priority = tmp;
            update_legend();
            update_count_domain();
        }
        d3.select(this.parentNode).transition().duration(0).attr("transform", "translate("+(mouseloc[0]+ 10) + "," + (mouseloc[1]-10)+")")
      })
      .on("dragend",function(d){
        drag_src = -1;
        update_legend();
      })

    legendItem.append("rect")
      .attr("x", -15)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", function(d,i){return color(i);})
      .on("click", function(){
        if (isDragging){
            isDragging = false;
            return;
        }
        var p = d3.select(this).data()[0];
        p.Visible = !p.Visible;
        update_count_domain();
        if (!p.Visible)
            d3.select(this).transition().style("fill","#888888")
        else
            d3.select(this).transition().style("fill",color(protocol_inv[p.Name]))
      })
      .call(drag)

    legendItem.append("text")
      .attr("text-anchor","end")
      .attr("x", -20)
      .attr("y", function(d,i){return 12;})
      .html(function(d){return d.Name;})

    var fade = svg.append("rect")
        .attr("class","fade")
        .attr("x",0)
        .attr("y",0)
        .attr("width",width)
        .attr("height",height)
        .style("fill","#ffffff")
        .style("opacity","0.5")

    svg.selectAll(".detailrect")
        .data(protocol).enter()
        .append("rect")
        .attr("class","detailrect")
        .attr("fill",function(d,i){return color(i)})
    svg.selectAll(".detailtext")
        .data(protocol).enter()
        .append("text")
        .attr("class","detailtext")
        .style("fill",function(d,i){return color(i)})
    var detailaxis = svg.append("g")
        .attr("class","detailaxis")
    detailaxis.append("line")
        .attr("class","baseline")
        .attr("x1","0")
        .attr("x2","0");
    detailaxis.append("g")
        .attr("transform", "translate("+(width/2)+",-25)")
    .append("text")
        .attr("class", "label")
        .text("Package per Second")

    svg.append("rect")
        .attr("class","fade")
        .attr("x",0)
        .attr("y",0)
        .attr("width",width)
        .attr("height",height)
        .style("opacity","0")
        .on("mousemove",function(){
            var t = Math.floor(x.invert(d3.mouse(this)[0])+0.5);
            update_detail(t)
        })
        .on("mouseout",function(){
            detail_lvl = 0;
            last_slice = -1;
            update_detail(-1);
        })
        .on("mouseover", function(){
            detail_lvl = 1;
            last_slice = -1;
            var t = Math.floor(x.invert(d3.mouse(this)[0])+0.5);
            update_detail(t);
        })
        .on("click",function(){
            detail_lvl = 3 - detail_lvl;
            last_slice = -1;
            var t = Math.floor(x.invert(d3.mouse(this)[0])+0.5);
            update_detail(t);
        })
    svg.append("g")
      .attr("class", "yaxis")
    .append("text")
      .attr("class","label")
      .attr("transform","rotate(-90)")
      .attr("y", 20)
      .style("text-anchor", "end")
      .text("Package per Second")
    svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0,"+height+")")
    .append("text")
      .attr("class","label")
      .attr("x", width)
      .attr("y", 20)
      .style("text-anchor","end")
      .text("Time/s")
    update_legend();
    update_count_domain();
    update_detail(-1);
};
