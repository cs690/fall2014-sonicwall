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
    "orthographic":[d3.geo.orthographic(),
        function(lvl){
            var prj = cur_prj[0];
            if (lvl){
                prj.rotate(rotate)
                lvl--;
            }
            if (lvl){
                prj.scale(scale * Math.min(width, height) / 2)
                lvl--;
            }
            if (lvl){
                prj.translate([width/2, height/2])
                path.projection(prj)
            }
        }],
    "kavrayskiy7":[d3.geo.kavrayskiy7(),
        function(lvl){
            var prj = cur_prj[0];
            if (lvl){
                prj.rotate(rotate)
                lvl--;
            }
            if (lvl){
                prj.scale(scale *width/5.64)
                lvl--;
            }
            if (lvl){
                prj.translate([width/2, height/2])
                path.projection(prj)
            }
        }],
    };
cur_prj = projections[Object.keys(projections)[cur_prj_idx]];



onWindowResize()
function onWindowResize(){
    
    width = window.innerWidth - 100,
    height = width / 2;
    cur_prj[1](3)
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

function zoomstart() {
  s0 = zoom.scale()
  t0 = [d3.event.sourceEvent.x, d3.event.sourceEvent.y]
  S0 = scale
  r0 = cur_prj[0].rotate().slice(0);
}

function zoom() {
  if (s0) {
    rotate = [r0[0] + (d3.event.sourceEvent.x - t0[0])/8, r0[1] - (d3.event.sourceEvent.y - t0[1])/8]
    scale = S0 * zoom.scale() / s0
    cur_prj[1](2)
    refresh(svg)
  }
}

function zoomend() {
  if (s0) {
    s0 = null;
  }
}

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoomstart", zoomstart)
    .on("zoom", zoom)
    .on('zoomend', zoomend)
    
function datapath(d){
    var src = locations[d.Source],
        dst = locations[d.Destination],
        pstart = cur_prj[0]([src.Longitude, src.Latitude]),
        pend = cur_prj[0]([dst.Longitude, dst.Latitude]),
        dx = (pend[0] - pstart[0])/3,
        dy = (pend[1] - pstart[1])/3,
        len = (dx * dx + dy * dy),
        prep = [-dy/len, dx/len]
    return "M" + pstart+'C'
        + (pstart[0]+dx+prep[0]*d.disp_arg) + ',' + (pstart[1]+dy+prep[1]*d.disp_arg) + ','
        + (pend[0]-dx+prep[0]*d.disp_arg) + ',' + (pend[1]-dy+prep[1]*d.disp_arg) + ','
        + pend
}
    
function onLoadReady(err, world, data, ip_loc){
    ip_loc.forEach(function(l){
        l.Latitude = +l.Latitude;
        l.Longitude= +l.Longitude;
        locations[l.IP] = l
    })
    data.forEach(function(d){
        d.Time = +d.Time
        d.disp_arg = rand_norm()
    })
    console.log(data)
    svg.append("path").datum(graticule)
        .attr("class","prjpath graticule")
        .attr('d',path)
    svg.selectAll('.land').data(world.features).enter()
        .append('path')
        .attr("class", "prjpath land")
        .attr('d', path)
    svg.append('rect')
        .attr('class', 'eventlistener')
        .attr('x', '-100')
        .attr('y', '-100')
        .attr('width','1e6')
        .attr('height','1e6')
        .attr('style','opacity:0;')
        .call(zoom)
    svg.selectAll('.data').data(data).enter()
        .append('path')
        .attr('class','data')
        .attr('stroke',function(d){return color(d.Protocol)})
        .attr('d', datapath)
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
    svg.selectAll('.data').attr('d',datapath)
}