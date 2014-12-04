function ip2int(ip){
    return ip.split('.').reduce(function(prev, curr){return prev*256+(+curr);}, 0)
}
var node_r = 5
var detail_time = 300
var detail_off = 10
var detail_height = 150
var detail_bar = 20
function map_activity(d3selection, worldmap){
        // config
    var width = 500,
       height = width / 2,
       record = {'interval':0.1, 'length': 5, slots: 50},
   projection = d3.geo.kavrayskiy7()
        
     accessor = {'event':{}, 'ip':{}},
        
        // display arguments
        scale = 1,
 scale_factor = function(){return width/5.64},
       rotate = [0,0],
        
        // private variable
     category = [],
     cate_idx = [],
    dashboard = {}, // (ipInt + ipInt) -> connection_dashboard
     geoloc = {}, //ipInt -> {ip, geoloc}
      detail_on = null,
        color = d3.scale.category10(),
         path = d3.geo.path(),
          svg = d3selection.append('svg'),
     svg_root = svg.append('g'),
        decay = Math.exp(-record.interval*5),
  scale_decay = Math.sqrt(Math.sqrt(Math.sqrt(decay, -10))),
        timer = null,
        nodes = null,
        edges = null,
       detail = null,
 detail_scale = d3.scale.linear().range([0,150]).domain([0,0]),
detail_domain = 0,
         line = d3.svg.line()
                .x(function(d,i){return i/record.slots * detail_time})
                .y(function(d){return -detail_scale(d) - detail_off}),
redraw_network= false
                
               
    // helper functions
    function refreshDetail(){
        if (detail_on == null){
            detail[0].attr('visibility','hidden')
            detail[1].attr('visibility','hidden')
        }else{
            var nodeint = Object.keys(detail_on[0].nodes),
               nodeinfo = nodeint.map(function(srcint){return detail_on[0].nodes[srcint]})
			var mx = 0
			for (var i = 0; i < 2; i++){
				ni = nodeinfo[i];
				for (var j = 0; j < category.length; j++)
					mx = Math.max(mx, Math.max.apply(null, ni[category[j]].data))
			}
			if (mx == 0)
				mx == 1
			detail_scale.domain([0,mx]);
            for (i = 0; i < 2; i++){
                var srcloc = projection(geoloc[nodeint[i]].loc),
                    dstloc = projection(geoloc[nodeint[1-i]].loc)
                    dx = dstloc[0] - srcloc[0],
                    dy = dstloc[1] - srcloc[1],
                    ni = nodeinfo[i];
                detail[i]
                    .attr('visibility','visible')
                    .attr('transform',"translate("+srcloc+")rotate(" + (Math.atan(dy/dx)/Math.PI*180+(dx>0?0:180)) + ")")
                detail[i].selectAll('.timeline')
                    .attr('d',function(d){return line(ni[category[d]].data)})
                detail[i].selectAll('.bar')
                    .attr('y', function(d){return detail_scale(-ni[category[d]].data[0]) - detail_off})
                    .attr('height', function(d){return detail_scale(ni[category[d]].data[0])})
            }
        }
    }
    
    function refreshEdge(){
        edges.selectAll('.edge')
            .attr('x1', function(d){return projection(geoloc[Object.keys(dashboard[d].nodes)[0]].loc)[0];})
            .attr('y1', function(d){return projection(geoloc[Object.keys(dashboard[d].nodes)[0]].loc)[1];})
            .attr('x2', function(d){return projection(geoloc[Object.keys(dashboard[d].nodes)[1]].loc)[0];})
            .attr('y2', function(d){return projection(geoloc[Object.keys(dashboard[d].nodes)[1]].loc)[1];})
            .attr('stroke',function(d){return dashboard[d].active>0?'green':'gray'})
        refreshDetail()
    }
    function refreshNetwork(){
        nodes.selectAll('.node')
            .attr('cx', function(d){return projection(geoloc[d].loc)[0];})
            .attr('cy', function(d){return projection(geoloc[d].loc)[1];})
            .attr('r',node_r)
        refreshEdge()
    }
   
    
    function prepareProjection(){
        projection
            .rotate(rotate)
            .scale(scale * scale_factor())
            .translate([width/2, height/2])
        path.projection(projection)
        svg_root.selectAll('.prjpath').attr('d',path)
        refreshNetwork()    
    }
    function updateSize(){
        svg.attr('width',width)
            .attr('height',height)
        prepareProjection()
    }
    
    function appendLoc(ipint, ip){
        geoloc[ipint] = {'ip':ip, 'loc': accessor.ip.geoloc(ip)};
        nodes.selectAll('.node').data(Object.keys(geoloc)).enter().append('circle')
            .attr('class', 'node')
        refreshNetwork()
    }
    function appendConn(conint, int1, int2){
        dashboard[conint] = {active:0, nodes:{}}
        dashboard[conint].nodes[int1] = {}
        dashboard[conint].nodes[int2] = {}
        var arrlen = record.slots + 5;
        category.forEach(function(cate){
            dashboard[conint].nodes[int1][cate] = {
                'data':Array.apply(null, new Array(arrlen)).map(Number.prototype.valueOf,0),
                'nextval':0
            }
            dashboard[conint].nodes[int2][cate] = {
                'data':Array.apply(null, new Array(arrlen)).map(Number.prototype.valueOf,0),
                'nextval':0
            }
        })
        edges.selectAll('.edge').data(Object.keys(dashboard)).enter().append('line')
            .attr('class','edge')
            .on('mouseover',function(){if (detail_on == null) detail_on = [dashboard[this.__data__], null];refreshDetail()})
            .on('mouseout',function(){if (detail_on[1]==null) detail_on = null;refreshDetail()})
            .on('click', function(){
                var srcloc, dstloc,nodeint = Object.keys(detail_on[0].nodes);
                switch (detail_on[1]){
                    case null:
                        detail_on[1] = 'src';
                        srcloc = projection(geoloc[nodeint[0]].loc);
                        dstloc = projection(geoloc[nodeint[1]].loc);
                        break;
                    case 'src':
                        detail_on[1] = 'dst';
                        srcloc = projection(geoloc[nodeint[1]].loc);
                        dstloc = projection(geoloc[nodeint[0]].loc);
                        break;
                    case 'dst':
                        detail_on[1] = null;
                        svg_root.transition().attr('transform','')
                        return
                }
                var dx = dstloc[0] - srcloc[0],
                    dy = dstloc[1] - srcloc[1]
                svg_root.transition().attr('transform',"translate(400," + height/2 + ")rotate(" + -(Math.atan(dy/dx)/Math.PI*180+(dx>0?0:180)) + ")translate("+[-srcloc[0],-srcloc[1]]+")")
            })
        refreshEdge()
    }
    
    function appendCate(cate){
        cate_idx.push(category.length)
        category.push(cate)
        var arrlen = record.slots + 5;
        Object.keys(dashboard).forEach(function(conint){
            var biboard = dashboard[conint].nodes
            Object.keys(biboard).forEach(function(srcint){
                biboard[srcint][cate]={
                    'data':Array.apply(null, new Array(arrlen)).map(Number.prototype.valueOf,0),
                    'nextval':0
                }                
            })
        })
        for (i = 0; i < 2; i++){
            detail[i].selectAll('.timeline').data(cate_idx).enter().append('path')
                .attr('class','timeline')
                .attr('stroke',function(ci){return color(category[ci])})
            detail[i].selectAll('.bar').data(cate_idx).enter().append('rect')
                .attr('class','bar')
                .attr('y',detail_off)
                .attr('x',function(ci){return -(ci+1)*detail_bar})
                .attr('width',detail_bar)
                .attr('fill',function(ci){return color(category[ci])})
        }
    }
    
    function makeDetailFeature(s){
        s.append('line')
            .attr('class','detail_axis')
            .attr('y1', -detail_off)
            .attr('y2', -detail_off - detail_height)
        s.append('line')
            .attr('class','detail_axis')
            .attr('x1', 0)
            .attr('y1', -detail_off)
            .attr('x2', detail_time)
            .attr('y2', -detail_off)
    }
    
    // init gesture
    var s0,t0,S0,r0;
    function zoomstart() {
      s0 = zoom.scale()
      t0 = [d3.event.sourceEvent.x, d3.event.sourceEvent.y]
      S0 = scale
      r0 = projection.rotate().slice(0);
    }

    function zoomming() {
      if (s0) {
        rotate = [r0[0] + (d3.event.sourceEvent.x - t0[0])/8/scale, r0[1] - (d3.event.sourceEvent.y - t0[1])/8/scale]
        scale = S0 * zoom.scale() / s0
        prepareProjection()
      }
    }

    function zoomend() {
      if (s0) {
        s0 = null;
      }
    }

    var zoom = d3.behavior.zoom()
        .on("zoomstart", zoomstart)
        .on("zoom", zoomming)
        .on('zoomend', zoomend)
        
        
    // init SVG
    svg_root.append('g')
        .attr('class', 'layer_graticule')
      .append('path').datum(d3.geo.graticule())
        .attr('class', 'prjpath graticule')
        
    svg_root.append('g')
        .attr('class', 'layer_land')
        .selectAll('.land').data(worldmap).enter()
      .append('path')
        .attr('class','prjpath land')
        
    svg_root.append('rect')
        .attr('class', 'eventlistener')
        .attr('x','-100')
        .attr('y','-100')
        .attr('width','1e6')
        .attr('height','1e6')
        .style('opacity','0')
        .call(zoom)
        
    edges = svg_root.append('g')
    nodes = svg_root.append('g')
    detail = [svg_root.append('g'), svg_root.append('g')]
    makeDetailFeature(detail[0])
    makeDetailFeature(detail[1])
        
        
    // register timer
   timer = setInterval(function(){
        Object.keys(dashboard).forEach(function(conint){
            var biboard = dashboard[conint]
            biboard.active--;
            Object.keys(biboard.nodes).forEach(function(srcint){
                var board = biboard.nodes[srcint];
                category.forEach(function(cate){
                    var b = board[cate]
                    b.data.unshift(b.nextval)
                    b.data.pop()
                    b.nextval = b.nextval * decay
                })
            })
        })
        if (redraw_network){
            refreshNetwork()
            redraw_network = false;
        }
        refreshEdge()
    },record.interval*1000)
    
    // prepare return value
    var map_activity = function(event){
        var src = accessor.event.src(event),
         srcint = ip2int(src),
            dst = accessor.event.dst(event),
         dstint = ip2int(dst),
           cate = accessor.event.category(event),
         conint = srcint + dstint
           
        if (geoloc[srcint]==undefined)
            appendLoc(srcint, src)
        if (geoloc[dstint]==undefined)
            appendLoc(dstint, dst)
        if (category.indexOf(cate) < 0)
            appendCate(cate);
        if (dashboard[conint] == undefined)
            appendConn(conint,srcint,dstint);
        dashboard[conint].active=2;
        dashboard[conint].nodes[srcint][cate].nextval += accessor.event.size(event)
        if (dashboard[conint].nodes[srcint][cate].nextval > detail_domain)
            detail_domain = dashboard[conint].nodes[srcint][cate].nextval
        redraw_network = true;
    }
    
    map_activity.width = function(w){
        if (!arguments.length) return width;
        width = w;
        height = width/2;
        updateSize()
        return map_activity;
    }
    
    map_activity.record = {
        'interval':function(i){
            if (!arguments.length) return record.interval;
            record.interval = i;
            record.slots = Math.floor(record.length / record.interval)
            return map_activity;
        },
        'length':function(l){
            if (!arguments.length) return record.length;
            record.length = l;
            record.slots = Math.floor(record.length / record.interval)
            return map_activity;
        }
    }
    
    map_activity.accessor = {
        'event':{
            'category':function(x){
                if(!arguments.length)return accessor.event.category;
                accessor.event.category = x;
                return map_activity;
            },
            'src':function(x){
                if(!arguments.length)return accessor.event.src;
                accessor.event.src = x;
                return map_activity;
            },
            'dst':function(x){
                if(!arguments.length)return accessor.event.dst;
                accessor.event.dst = x;
                return map_activity;
            },
            'size':function(x){
                if(!arguments.length)return accessor.event.size;
                accessor.event.size = x;
                return map_activity;
            },
            'time':function(x){
                if(!arguments.length)return accessor.event.time;
                accessor.event.time = x;
                return map_activity;
            }
        },
        'ip':{
            'geoloc':function(x){
                if (!arguments.length) return accessor.ip.geoloc;
                accessor.ip.geoloc = x;
                return map_activity;
            },
        }
    }
    
    map_activity.projection = function(proj, s_factor){
        if(!arguments.length)return projection;
        projection=proj
        scale_factor = s_factor
        prepareProjection()
    }
    
    updateSize()
    return map_activity;
}