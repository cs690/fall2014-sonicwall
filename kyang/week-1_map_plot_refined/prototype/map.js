d3.select(window).on("resize",onWindowResize)

function add_key(obj, key, value){
    obj[key] = value;
    return obj
}
var width;
var height;
var scale = 1
var rotate = [0,0]
var cur_prj;
var cur_prj_idx = 0;
var path = d3.geo.path()
var graticule = d3.geo.graticule();

var projections = {
    "orthographic":[d3.geo.orthographic(), function(){return Math.min(width, height) / 2;}],
    "kavrayskiy7":[d3.geo.kavrayskiy7(),function(){return width/5.64;}],
    };
cur_prj = projections[Object.keys(projections)[cur_prj_idx]];


function updateProjection(){
        cur_prj[0]
            .rotate(rotate)
            .scale(scale * cur_prj[1]())
            .translate([width/2, height/2])
        path.projection(cur_prj[0])
}

onWindowResize()
function onWindowResize(){
    
    width = window.innerWidth - 100,
    height = width / 2;
    updateProjection()
}
queue()
    .defer(d3.json, "world-countries.json")
    .defer(d3.csv, "/public/sfgate.csv")
    .defer(d3.csv, "/public/geoip.csv")
    .await(onLoadReady)

var svg = d3.select("body").select("svg")
    .attr("width", width)
    .attr("height", height)
    
var s0, t0, S0, r0;

var locations = {}
var conversition = {}
var color = d3.scale.category10()
var rand_norm = d3.random.normal()
var datawidth = 20
var datasize = d3.scale.linear().range([0,datawidth/2])
var protocols = []

function zoomstart() {
  s0 = zoom.scale()
  t0 = [d3.event.sourceEvent.x, d3.event.sourceEvent.y]
  S0 = scale
  r0 = cur_prj[0].rotate().slice(0);
}

function zoom() {
  if (s0) {
    rotate = [r0[0] + (d3.event.sourceEvent.x - t0[0])/8/scale, r0[1] - (d3.event.sourceEvent.y - t0[1])/8/scale]
    scale = S0 * zoom.scale() / s0
    updateProjection()
    refresh(svg)
  }
}

function zoomend() {
  if (s0) {
    s0 = null;
  }
}

var zoom = d3.behavior.zoom()
    .on("zoomstart", zoomstart)
    .on("zoom", zoom)
    .on('zoomend', zoomend)
    
function ip2int(ip){
    return ip.split('.').reduce(function(prev, curr){return prev*256+(+curr);}, 0)
}

    
function onLoadReady(err, world, data, ip_loc){
    ip_loc.forEach(function(l){
        l.Latitude = +l.Latitude;
        l.Longitude= +l.Longitude;
        var ipint = ip2int(l.IP)
        if (locations[ipint]!= undefined)
            console.log("HASH CONFLICT!")
        locations[ipint] = l
    })
    var maxsize = 0;
    data.forEach(function(d){
        d.Time = +d.Time
        if (protocols.indexOf(d.Protocol) < 0)
            protocols.push(d.Protocol);
        var srcip = ip2int(d.Source),
            dstip = ip2int(d.Destination),
            hashpair = srcip + dstip,
            reverse = 0;
        if (conversition[hashpair] == undefined)
            conversition[hashpair] = {src:d.Source, dst:d.Destination, srcint:srcip, dstint:dstip, protocol:{}, size:0};
        if (conversition[hashpair].src != d.Source && conversition[hashpair].dst != d.Source)
            console.log("HASH CONFLICT!")
        if (conversition[hashpair].protocol[d.Protocol]==undefined)
            conversition[hashpair].protocol[d.Protocol]={startTime:d.Time, size:0}
        
        conversition[hashpair].protocol[d.Protocol].endTime = d.Time
        conversition[hashpair].protocol[d.Protocol].size += +d.Length
        conversition[hashpair].size += +d.Length
        if (conversition[hashpair].size > maxsize)
            maxsize = conversition[hashpair].size
    })
    datasize.domain([1,maxsize])
    Object.keys(conversition).forEach(function(ippair){
        conversition[ippair].width = datasize(conversition[ippair].size)
        var s = 0;
        protocols.forEach(function(p){
            if (conversition[ippair].protocol[p]!= undefined){
                conversition[ippair].protocol[p].start_off = s;
                s += conversition[ippair].protocol[p].size;
            }
        })
    })
    svg.append("path").datum(graticule)
        .attr("class","prjpath graticule")
    svg.selectAll('.land').data(world.features).enter()
      .append('path')
        .attr("class", "prjpath land")
    svg.append('rect')
        .attr('class', 'eventlistener')
        .attr('x', '-100')
        .attr('y', '-100')
        .attr('width','1e6')
        .attr('height','1e6')
        .attr('style','opacity:0;')
        .call(zoom)
    svg.selectAll('.ippair').data(Object.keys(conversition)).enter()
      .append('g')
        .attr('class','ippair')
      .selectAll('.data').data(protocols).enter().append('rect')
        .attr('class','data')
        .attr('x','0')
        .attr('width','1')
        .attr('fill',function(d){return color(d);});
    refresh(svg)
}
function change(){
    cur_prj_idx ++
    cur_prj_idx = cur_prj_idx % Object.keys(projections).length
    cur_prj = projections[Object.keys(projections)[cur_prj_idx]]
    onWindowResize()
    refresh(svg.transition().duration(1000))
}

function refresh(svg){
    svg.selectAll('.prjpath').attr('d',path)
    svg.selectAll('.ippair').attr('transform',function(d){
        var info = conversition[d],
            srcloc = [locations[info.srcint].Longitude, locations[info.srcint].Latitude],
            dstloc = [locations[info.dstint].Longitude, locations[info.dstint].Latitude],
            srcploc = cur_prj[0](srcloc),
            dstploc = cur_prj[0](dstloc),
            dx = dstploc[0] - srcploc[0],
            dy = dstploc[1] - srcploc[1];
        return "translate("+srcploc+")rotate(" + (Math.atan(dy/dx)/Math.PI*180+(dx>0?0:180)) + ")scale(" + Math.sqrt(dx*dx+dy*dy) + ",1)";
    })
    svg.selectAll('.data')
        .attr('y',function(d){
            var par = conversition[this.parentNode.__data__],
                cur = par.protocol[d]
            if (cur==undefined)
                return 0;
            else
                return -par.width + 2 * par.width * cur.start_off / par.size
        })
        .attr('height', function(d){
            var par = conversition[this.parentNode.__data__],
                cur = par.protocol[d]
            if (cur==undefined)
                return 0;
            else
                return 2 * par.width * cur.size / par.size;
        })
}