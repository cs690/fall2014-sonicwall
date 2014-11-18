d3.select(window).on("resize",onWindowResize)

function add_key(obj, key, value){
    obj[key] = value;
    return obj
}
var width;
var height;
var scale = 1
var origin = [0,0]
var cur_prj;
var path = d3.geo.path()
var projections = {
    "orthographic":[d3.geo.orthographic(),
        function(lvl){
            var prj = cur_prj[0];
            if (lvl){
                prj.center(origin)
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
        }]
    };
cur_prj = projections['orthographic'];



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
    
function onLoadReady(err, world, data, ip_loc){
    svg.selectAll('.bg').data(world.features).enter()//topojson.feature(world, world.objects.land)).enter()
        .append('path')
        .attr("class", "prj bg")
        .attr('d', path)
}
function change(){
    pcur = 1 - pcur;
    projection.mode(pname[pcur])
    onWindowResize()
    svg.selectAll(".prj").transition().duration(1000).attr("d",path)
}