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

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    
var s0, t0, S0, r0;

function zoomstart() {
  //d3.event.preventDefault()
  s0 = zoom.scale()
  t0 = [d3.event.sourceEvent.x, d3.event.sourceEvent.y]
  S0 = scale
  r0 = cur_prj[0].rotate().slice(0);
}

function zoom() {
  if (s0) {
    rotate = [r0[0] + (d3.event.sourceEvent.x - t0[0])/8, r0[1] - (d3.event.sourceEvent.y - t0[1])/8]
    console.log(Object.keys(d3.event.sourceEvent))
    scale = S0 * zoom.scale() / s0
    cur_prj[1](2)
    svg.selectAll('.prjpath').attr('d',path)
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
    
function onLoadReady(err, world, data, ip_loc){
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
}
function change(){
    cur_prj_idx ++
    cur_prj_idx = cur_prj_idx % Object.keys(projections).length
    cur_prj = projections[Object.keys(projections)[cur_prj_idx]]
    onWindowResize()
    svg.selectAll(".prjpath").transition().duration(1000).attr("d",path)
}