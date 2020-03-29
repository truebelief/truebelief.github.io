// var default_color="#D6ECEF";
// var default_color="#ffcbb1";
var default_color="#ffe9de";
var default_bg_color="#dddddd";
var base_opacity=1.0;
var light_opacity=0.5;
// var trans_opacity=0.2;

var geo_features_case;
var geo_features_death;

var daily_case;
var daily_death;
var daily_case_incre;
var daily_death_incre;

var scale_range;
var scale_min;
var scale_max;
var scale_high;
var scales;
var divides=100;

var current_lang;
var current_date=0;
var current_region="";
var dict_lang=dict;
var scale_text;
var time_chart_case;
var time_chart_death;
var heat_color;


var time_chart_begin_number=10;

$(".button-lang").click(function() {
    $(".button-lang").removeClass('current-lang');
    $(this).addClass('current-lang');
    $("#dropbtn")[0].innerText=$(this)[0].innerText;

    hideLanguages();
    $('[lang="'+$(this)[0].id.substring(0,2)+'"]').show();
    current_lang=$(this)[0].id.substring(0,2);
    updateLanguage();
});

function updateLanguage()
{
    time_chart_case.data.datasets[0].label=dict_lang[current_lang]['全球'];
    time_chart_case.options.title.text=dict_lang[current_lang]['确诊'];

    time_chart_death.data.datasets[0].label=dict_lang[current_lang]['全球'];
    time_chart_death.options.title.text=dict_lang[current_lang]['死亡'];


    time_chart_case.options.scales.yAxes[0].scaleLabel.labelString=dict_lang[current_lang]['累积']
    time_chart_case.options.scales.yAxes[1].scaleLabel.labelString=dict_lang[current_lang]['增量']

    time_chart_death.options.scales.yAxes[0].scaleLabel.labelString=dict_lang[current_lang]['累积']
    time_chart_death.options.scales.yAxes[1].scaleLabel.labelString=dict_lang[current_lang]['增量']

    if (current_region)
    {
        time_chart_case.data.datasets[1].label=dict_lang[current_lang][current_region];
        time_chart_death.data.datasets[1].label=dict_lang[current_lang][current_region];
    }
    time_chart_case.update();
    time_chart_death.update();
}
function hideLanguages(){
    $('[lang="zh"]').hide();
    $('[lang="en"]').hide();
    $('[lang="tw"]').hide();
    $('[lang="ja"]').hide();
    $('[lang="fr"]').hide();
    $('[lang="es"]').hide();
    $('[lang="ru"]').hide();
    $('[lang="de"]').hide();
}
function updateChart(time_chart,id,label,data,bg_color,border_color){
    time_chart.data.datasets[id].label=label;
    time_chart.data.datasets[id].data=data;
    time_chart.data.datasets[id].backgroundColor=bg_color;
    if (border_color)
    {
        // time_chart.data.datasets[id].borderColor=border_color;
    }

}

$("#dropbtn").click(function(){
    document.getElementById("lang-dropdown").classList.toggle("show");
});
window.onclick = function(event) {
    if (!event.target.matches('#dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
function getRange(data)
{
    var values =[];
    Object.values(data).slice(1).map(e => values=values.concat(e));
    return values;
}
function columnSum(array) {
    return array.reduce((a, b)=> a.map((x, i)=> x + (b[i] || 0)))
}

// $( function() {
//
// } );

(function() {
    hideLanguages();
    $('[lang="en"]').show();
    current_lang="en";

    $("#reszable").resizable({ handles: 'sw' });
    $('.ui-resizable-sw').addClass('ui-icon-gripsmall-diagonal-sw');


    var getj = $.getJSON("daily.json");

    getj.done(function(data) {

        daily_case=data[0];
        daily_death=data[1];


        // daily_case_incre=

        var current_num=0;

        var scale_values=getRange(daily_case);
        scale_min = Math.max(1,Math.round(Math.min.apply(null, scale_values)));
        scale_max = Math.round(Math.max.apply(null, scale_values));
        scale_high = scale_max;


        scales=[1,10,100,400,1000,4000,scale_high];


        scale_range=$.map($(Array(divides+1)),function(val, i) { return Math.round((scale_high-scale_min)*i/divides+scale_min); });

        // var dt = daily_case.map(e => Object.values(e).slice(1));
        // var time_whole_data=dt.map(e => (e.reduce((a,b) => a + b,0)));

        var time_world_total_case=columnSum(Object.values(daily_case).slice(1));
        var time_world_total_death=columnSum(Object.values(daily_death).slice(1));

        var time_world_incre_case=[time_world_total_case[0]].concat(time_world_total_case.slice(1).map((e,i)=>e-time_world_total_case[i]));
        var time_world_incre_death=[time_world_total_death[0]].concat(time_world_total_death.slice(1).map((e,i)=>e-time_world_total_death[i]));

        var ctx1 = document.getElementById('time-plot-case').getContext('2d');
        var ctx2 = document.getElementById('time-plot-death').getContext('2d');
        var options1 = {
            type: 'line',
            data: {
                // labels: daily_case.map(e=>dict_lang[current_lang][e['日期']]),
                labels: Object.values(daily_case)[0].slice(time_chart_begin_number),
                datasets: [
                    {
                        label: dict_lang[current_lang]['全球'],
                        // data: time_world_total_case,
                        borderWidth: 1,
                        backgroundColor: '#eeeeee',
                        pointRadius: 1,
                        pointHoverRadius:4,
                        order:3,
                        yAxisID: "id1"
                    },
                    {
                        label: '',
                        data: [],
                        borderWidth: 0,
                        backgroundColor: '#ffffff',
                        pointRadius: 1,
                        pointHoverRadius:4,
                        order:2,
                        yAxisID: "id1"
                    },
                    {
                        label: dict_lang[current_lang]['全球'],
                        // data: time_world_total_case,
                        borderWidth: 1,
                        backgroundColor: '#4ad',
                        pointRadius: 1,
                        pointHoverRadius:4,
                        order:0,
                        yAxisID: "id2"
                    },
                    {
                        label: '',
                        data: [],
                        borderWidth: 0,
                        backgroundColor: '#4ad',
                        pointRadius: 1,
                        pointHoverRadius:4,
                        order:1,
                        yAxisID: "id2"
                    }

                ]
            },
            options: {
                responsive:true,
                maintainAspectRatio:false,
                title: {
                    display: true,
                    // text: dict_lang[current_lang]['确诊']
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            reverse: false,
                            stepSize:2000,
                            min: 0,
                            maxTicksLimit:8
                        },
                        id: "id1",
                        scaleLabel:{
                            display:true,
                            labelString:dict_lang[current_lang]['累积']
                        },
                        position:"left",
                        gridLines: {
                            display:true
                        }
                    },
                    {
                        ticks: {
                            reverse: false,
                            stepSize:1000,
                            min: 0,
                            maxTicksLimit:8
                        },
                        id: "id2",
                        scaleLabel:{
                            display:true,
                            labelString:dict_lang[current_lang]['增量'],
                            fontColor: "#4ad"
                        },
                        position:"right",
                        gridLines: {
                            display:false
                        }
                    }

                    ]
                }
            }
        };
        var options2=JSON.parse(JSON.stringify(options1));
        time_chart_case= new Chart(ctx1, options1);
        time_chart_death= new Chart(ctx2, options2);

        time_chart_case.options.title.text=dict_lang[current_lang]['确诊'];
        time_chart_death.options.title.text=dict_lang[current_lang]['死亡'];

        // time_chart.options.legend.position='right';
        time_chart_case.options.legend.display=false;
        time_chart_death.options.legend.display=false;

        time_chart_case.data.datasets[0].data=time_world_total_case.slice(time_chart_begin_number);
        time_chart_death.data.datasets[0].data=time_world_total_death.slice(time_chart_begin_number);

        time_chart_case.data.datasets[2].data=time_world_incre_case.slice(time_chart_begin_number);
        time_chart_death.data.datasets[2].data=time_world_incre_death.slice(time_chart_begin_number);





        require.register("views/map", function(exports, require, module) {
            // heat_color = d3.scaleLinear()
            heat_color = d3.scaleLinear()
            // heat_color = d3.scalePow().exponent(0.2)
                .range([default_color,"#ffcbb1","#ffb4a0","#e5989b","#b4838f","#6a6876",'#000000'])
                // .range([default_color,"#ffb4a0","#e5989b",'#000000'])
            //     .range([default_color,"#ffb4a0"])
                .domain(scales);
                // .domain(scale_range);

            var MapView;
            return MapView = (function() {
                var interpolate;

                class MapView extends Backbone.View {};
                interpolate = function(x, y, p) {
                    if (x >= 0 && y >= 0) {
                        return x + (y - x) * p;
                    }
                };

                module.exports = MapView = (function() {
                    class MapView extends Backbone.View {
                        createScale() {
                            return this.scale=function(i) {
                                // return Math.round((scale_max-scale_min)*i/divides+scale_min);
                                return Math.round((scale_high-scale_min)*i/divides+scale_min);
                            };
                        }

                        initialize(opts) {
                            this.createScale();
                            $(window).on("pointerup", _.bind(this.endDate, this));
                            $(window).on("pointermove", _.bind(this.moveDate, this));
                            if (opts.items) {
                                this.data.items = this.data[opts.items];
                            }

                            // return d3.json("data/china.geojson").then((topo) => {
                            return d3.json("data/world.geojson").then((topo) => {
                                this.$elements = {
                                    blocks: {},
                                    labels: {},
                                    map: this.$("#map"),
                                    scale: this.$("#map-scale-canvas"),
                                    date: this.$("#chart-date"),
                                    minimap: this.$("#map-timeline-minimap"),
                                    keys: this.$(".chart-title-label"),
                                };
                                this.$el.addClass("loading");
                                this.drawMap(topo);
                                this.drawScale();
                                this.drawMinimap();
                                this.reset();

                                window.setTimeout((() => {
                                    this.play();
                                    return this.$el.removeClass("loading");
                                }), 600);
                                return this.listenTo(this, "resize", () => {
                                    this.drawMap(topo);
                                    if (!this.playing) {
                                        return this.render(this.currentTime * (this.data.scale.length - 1));
                                    }
                                });
                            });
                        }
                        drawMap(topo) {
                            geo_features_case=topo.features;
                            geo_features_case.map(e => e['properties']['values']=[]);
                            // geo_features_death=geo_features_case.slice();
                            geo_features_death=JSON.parse(JSON.stringify(geo_features_case));

                            // var keyname=Object.keys(daily_case[0]).map(function(s) { return s.substring(0, 2)});
                            var keyname=Object.keys(daily_case);

                            geo_features_case.map(e => e['properties']['values']=Object.values(daily_case)[keyname.findIndex(ele => ele.includes(e.properties.name))] || 0);//replace undefined and null values with 0
                            geo_features_case.map(e => e['properties']['values2']=[Object.values(daily_case)[keyname.findIndex(ele => ele.includes(e.properties.name))][0]].concat(Object.values(daily_case)[keyname.findIndex(ele => ele.includes(e.properties.name))].slice(1).map((k,i)=>k-Object.values(daily_case)[keyname.findIndex(ele => ele.includes(e.properties.name))][i]|| 0)));//replace undefined and null values with 0
                            geo_features_death.map(e => e['properties']['values']=Object.values(daily_death)[keyname.findIndex(ele => ele.includes(e.properties.name))] || 0);//replace undefined and null values with 0
                            geo_features_death.map(e => e['properties']['values2']=[Object.values(daily_death)[keyname.findIndex(ele => ele.includes(e.properties.name))][0]].concat(Object.values(daily_death)[keyname.findIndex(ele => ele.includes(e.properties.name))].slice(1).map((k,i)=>k-Object.values(daily_death)[keyname.findIndex(ele => ele.includes(e.properties.name))][i]|| 0)));//replace undefined and null values with 0

                            scale_text=Object.values(daily_case)[0];

                            // this.data.scale=daily_case.map(e=>e['日期']);
                            this.data.scale=$.map($(Array(scale_text.length)),function(val, i) { return i; });
                            this.data.scale_text=scale_text;
                            this.data.items=geo_features_case;

                            var map_scale_min=document.getElementById("map-scale-min");
                            var map_scale_max=document.getElementById("map-scale-max");
                            map_scale_min.innerHTML=scale_text[0];
                            map_scale_max.innerHTML=scale_text[scale_text.length-1];

                            updateLanguage();

                            // var width = this.$elements.map.width();
                            var width = $('#map').width();
                            var height = $('#map').height();

                            var svg = d3.select("svg");
                            svg.selectAll("*").remove();

                            var adj_scale=Math.min(250,height/2);

                            var projection = d3.geoMercator()
                                // .center([107, 32]).scale(600)
                                .center([107, 32]).scale(adj_scale)
                                .translate([width/2, height/2]);

                            var path = d3.geoPath()
                                .projection(projection);

                            // svg.selectAll("*").remove();
                            svg = d3.select("#map").append("svg")
                                .attr("width", width)
                                .attr("height", height)
                                .append("g")
                                .attr("transform", "translate("+(width/4-adj_scale/2)+",0)");
                            // svg.style.width=2000;
                            // svg.style.height=624;
                            // svg.css('margin',0);


                            var svg_enter=svg.selectAll("path")
                                .data(geo_features_case)
                                .enter();

                            var tool_div = d3.select("body").append("div")
                                .attr("class", "path-tooltip")
                                // .attr("font-size", "8px")
                                .style("position", "absolute")
                                .style("z-index", "100")
                                .style("opacity", 0);



                            svg_enter.append("path")
                            // .attr("fill", default_color)
                            // .attr("fill", function(k) {return color_renderer(k)})
                                .attr("d", path )
                                .attr("id", function(d, i) {
                                    // return d.properties.id;
                                    return "rtg-"+d.properties.id;
                                })
                                .on("mouseover",function(d,i){
                                    if (d3.select(this).attr("activated")>0) {
                                        d3.select(this).transition()
                                            .duration('50')
                                            .attr('opacity', light_opacity)
                                            .attr("stroke", "black")
                                            .attr("stroke-width", "1px");
                                    }
                                })
                                .on("mouseout",function(d,i){
                                    if (d3.select(this).attr("activated")>0) {
                                        d3.select(this).transition()
                                            .duration('50')
                                            .attr('opacity', base_opacity)
                                            .attr("stroke-width", "0px");

                                        tool_div.transition()
                                            .duration('50')
                                            .style("opacity", 0);
                                    }
                                    // .attr("fill",function(k) {return color_renderer(k)});
                                })
                                .on("mousedown", function (d,i) {
                                    time_chart_case.options.title.text=dict_lang[current_lang]['确诊'];
                                    time_chart_death.options.title.text=dict_lang[current_lang]['死亡'];

                                    updateChart(time_chart_case,0,dict_lang[current_lang]['全球'],time_world_total_case.slice(time_chart_begin_number),'#eeeeee','');
                                    updateChart(time_chart_death,0,dict_lang[current_lang]['全球'],time_world_total_death.slice(time_chart_begin_number),'#eeeeee','');

                                    updateChart(time_chart_case,2,dict_lang[current_lang]['全球'],time_world_incre_case.slice(time_chart_begin_number),'#4ad','');
                                    updateChart(time_chart_death,2,dict_lang[current_lang]['全球'],time_world_incre_death.slice(time_chart_begin_number),'#4ad','');

                                    if (d3.select(this).attr("activated")>0) {
                                        tool_div.transition()
                                            .duration('50')
                                            .style("opacity", 1.0);
                                        tool_div.html(dict_lang[current_lang][d.properties.name.toString()] + ":" + d.properties.values[current_num].toString() + "("+geo_features_death[i].properties.values[current_num].toString()+")")
                                            .style("left", (Math.min(d3.event.pageX + 10, width-50)) + "px")
                                            .style("top", (Math.min(d3.event.pageY - 15,height-20)) + "px");

                                        current_region=d.properties.name.toString();

                                        updateChart(time_chart_case,1,dict_lang[current_lang][current_region],geo_features_case[i].properties.values.slice(time_chart_begin_number),'#dddddd','');
                                        updateChart(time_chart_death,1,dict_lang[current_lang][current_region],geo_features_death[i].properties.values.slice(time_chart_begin_number),'#dddddd','');

                                        updateChart(time_chart_case,3,dict_lang[current_lang][current_region],geo_features_case[i].properties.values2.slice(time_chart_begin_number),'#4ad','');
                                        updateChart(time_chart_death,3,dict_lang[current_lang][current_region],geo_features_death[i].properties.values2.slice(time_chart_begin_number),'#4ad','');
                                    }else
                                    {
                                        current_region="";
                                        updateChart(time_chart_case,1,"",[],'#ffffff','#ffffff');
                                        updateChart(time_chart_death,1,"",[],'#ffffff','#ffffff');

                                        updateChart(time_chart_case,3,"",[],'#ffffff','#ffffff');
                                        updateChart(time_chart_death,3,"",[],'#ffffff','#ffffff');

                                    }
                                    time_chart_case.update();
                                    time_chart_death.update();
                                })
                                .on("mouseup", function (d,i) {
                                    if (d3.select(this).attr("activated")>0) {
                                        updateChart(time_chart_case,0,"",[],'#ffffff','#ffffff');
                                        updateChart(time_chart_death,0,"",[],'#ffffff','#ffffff');
                                        updateChart(time_chart_case,2,"",[],'#ffffff','#ffffff');
                                        updateChart(time_chart_death,2,"",[],'#ffffff','#ffffff');

                                        // time_chart_case.options.legend.display=false;
                                        current_region=d.properties.name.toString();

                                        updateChart(time_chart_case,1,dict_lang[current_lang][current_region],geo_features_case[i].properties.values.slice(time_chart_begin_number),'#dddddd','');
                                        updateChart(time_chart_death,1,dict_lang[current_lang][current_region],geo_features_death[i].properties.values.slice(time_chart_begin_number),'#dddddd','');

                                        updateChart(time_chart_case,3,dict_lang[current_lang][current_region],geo_features_case[i].properties.values2.slice(time_chart_begin_number),'#4ad','');
                                        updateChart(time_chart_death,3,dict_lang[current_lang][current_region],geo_features_death[i].properties.values2.slice(time_chart_begin_number),'#4ad','');

                                        time_chart_case.update();
                                        time_chart_death.update();
                                    }
                                });
                        }

                        drawScale() {
                            var canvas, context, i, k, l, last, len, ref, results, s, v, values, w, x;
                            canvas = this.$elements.scale.get(0);
                            canvas.width = canvas.width * 2;
                            canvas.height = 2;
                            context = canvas.getContext("2d");
                            // var new_divide=5;

                            var fixed_upper=Math.round(4000);
                            var fixed_middle= 2000;
                            var fixed_lower= 500;

                            for (i = k = 0, ref = canvas.width*0.75; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
                                s = Math.floor((divides+1) * (k / (canvas.width*0.75))) / divides;
                                context.fillStyle = this.interpolate((s*(fixed_upper-scale_min)+scale_min));
                                context.fillRect(i, 0, 2, 2);
                            }
                            for (i = k = canvas.width*0.75, ref = canvas.width; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
                                s = Math.floor((divides+1) * ((k-canvas.width*0.75) / (canvas.width-canvas.width*0.75))) / divides;
                                context.fillStyle = this.interpolate((s*(scale_high-fixed_upper)+fixed_upper));
                                context.fillRect(i, 0, 2, 2);
                            }

                            // var three_scales=[scale_min,Math.round(0.5*(scale_high+scale_max)),scale_max];
                            var three_scales=[scale_min,fixed_lower, fixed_middle,fixed_upper, Math.round(scale_high)];
                            var scale_label=document.getElementsByClassName("map-legend-label-scale");

                            // $('#tick-1').css('left',(fixed_upper-scale_min)/(scale_high-scale_min)*100+'%');
                            scale_label[0].innerHTML=three_scales[0];
                            scale_label[1].innerHTML=three_scales[1];
                            scale_label[2].innerHTML=three_scales[2];
                            scale_label[3].innerHTML=three_scales[3];
                            scale_label[scale_label.length-1].innerHTML=three_scales[three_scales.length-1];
                        }

                        drawMinimap() {
                            var a, a1, a2, canvas, canvasBase, canvasColor, contextBase, contextColor, country, i, j, k, l, len, len1, m, ref, ref1, ref2, resolution, t, v, v1, v2, x, y, date;
                            canvas = this.$elements.minimap.get(0);
                            canvas.width = this.$elements.minimap.width() * 2;
                            canvas.height = this.data.items.length;
                            this.$elements.minimapContext = canvas.getContext("2d");
                            resolution = 2;
                            canvasColor = document.createElement("canvas");
                            canvasColor.width = this.data.scale.length * resolution;
                            canvasColor.height = this.data.items.length;
                            contextColor = canvasColor.getContext("2d");
                            ref = this.data.scale;
                            for (i = k = 0, len = ref.length; k < len; i = ++k) {
                                date = ref[i];
                                ref1 = this.data.items;
                                for (y = l = 0, len1 = ref1.length; l < len1; y = ++l) {
                                    country = ref1[y];
                                    v1 = country.properties.values[i];
                                    v2 = country.properties.values[Math.min(i + 1, this.data.scale.length - 1)];
                                    a1 = v1 ? 1 : 0;
                                    a2 = v2 ? 1 : 0;
                                    for (j = m = 0, ref2 = resolution; (0 <= ref2 ? m <= ref2 : m >= ref2); j = 0 <= ref2 ? ++m : --m) {
                                        if (!v1) {
                                            v1 = v2 || 1;
                                        }
                                        if (!v2) {
                                            v2 = v1 || 1;
                                        }
                                        x = i * resolution + j;
                                        t = j / resolution;
                                        a = interpolate(a1, a2, t);
                                        v = interpolate(v1, v2, t);
                                        contextColor.globalAlpha = a;
                                        contextColor.fillStyle = this.interpolate(v);
                                        contextColor.fillRect(x, y, 1, 1);
                                    }
                                }
                            }
                            this.data.colorImage = canvasColor;
                            canvasBase = document.createElement("canvas");
                            canvasBase.width = canvas.width;
                            canvasBase.height = canvas.height;
                            contextBase = canvasBase.getContext("2d");
                            contextBase.drawImage(this.data.colorImage, 0, 0, canvas.width, canvas.height);
                            contextBase.globalCompositeOperation = "source-in";
                            contextBase.fillStyle = "#cfd9e2";
                            contextBase.fillRect(0, 0, canvas.width, canvas.height);
                            return this.data.baseImage = canvasBase;
                        }

                        drawMinimapAt(t) {
                            var h, w, x;
                            w = this.data.baseImage.width;
                            h = this.data.baseImage.height;
                            x = t / (this.data.scale.length - 1) * (w - 2);
                            this.$elements.minimapContext.clearRect(0, 0, w, h);
                            this.$elements.minimapContext.save();
                            this.$elements.minimapContext.drawImage(this.data.baseImage, 0, 0);
                            this.$elements.minimapContext.beginPath();
                            this.$elements.minimapContext.rect(0, 0, x, this.data.baseImage.height);
                            this.$elements.minimapContext.clip();
                            this.$elements.minimapContext.drawImage(this.data.colorImage, 0, 0, this.data.baseImage.width, this.data.baseImage.height);
                            this.$elements.minimapContext.restore();
                            this.$elements.minimapContext.strokeStyle = "#002a45";
                            this.$elements.minimapContext.lineWidth = 2;
                            this.$elements.minimapContext.strokeRect(1, 1, this.data.baseImage.width - 2, this.data.baseImage.height - 2);
                            return this.$elements.minimapContext.strokeRect(x + 1, 0, 1, this.data.baseImage.height);
                        }

                        render(t) {
                            var data, item, k, len, p, sx, sy, value, vx, vy, x, y;
                            x = Math.floor(t);
                            y = Math.min(x + 1, this.data.scale.length - 1);
                            p = t - x;
                            // this.$elements.date.html(this.data.scale_text[this.data.scale[0] + Math.round(t)]);
                            current_date=this.data.scale[0] + Math.round(t);
                            updateLanguage();

                            var chart_date=document.getElementById("chart-date");
                            chart_date.innerHTML=scale_text[current_date];



                            data = geo_features_case;
                            for (k = 0, len = data.length; k < len; k++) {

                                item = data[k]['properties']['values'];
                                if (item) {
                                    vx = item[x];
                                    vy = item[y];
                                    sx = vx || scale_min;
                                    sy = vy || scale_max;
                                    value = interpolate(sx, sy, p);

                                    d3.select("#rtg-"+data[k]['properties']['id'])
                                        // .attr("opacity", !(vx && vy) ? 0 : base_opacity)
                                        .attr("activated", !(vx && vy) ? 0 : 1)
                                        // .attr("fill", this.interpolate(value));
                                        .attr("fill", !(vx && vy) ? default_bg_color:this.interpolate(value));
                                    current_num = Math.round(this.currentTime * (this.data.scale.length - 1));
                                }
                            }
                            return this.drawMinimapAt(t);
                        }

                        play() {
                            var max, now, repeat;
                            window.cancelAnimationFrame(this.loop);
                            this.playing = true;
                            this.$el.addClass("playing");
                            if (this.currentTime === 1 || (this.currentTime == null)) {
                                this.currentTime = 0;
                            }
                            max = this.data.scale.length - 1;
                            now = Date.now() - this.currentTime * this.data.duration;
                            return (repeat = () => {
                                var d, t;
                                d = Date.now() - now;
                                t = d / this.data.duration;
                                t = Math.min(t, 1);
                                this.render(t * max);
                                if (t < 1 && this.playing) {
                                    this.currentTime = t;
                                    return this.loop = window.requestAnimationFrame(repeat);
                                } else if (this.playing) {
                                    this.$el.removeClass("playing");
                                    this.currentTime = 1;
                                    return this.playing = false;
                                }
                            })();
                        }

                        pause() {
                            if (this.playing) {
                                return this.stop();
                            } else {
                                return this.play();
                            }
                        }

                        stop() {
                            window.cancelAnimationFrame(this.loop);
                            this.playing = false;
                            return this.$el.removeClass("playing");
                        }

                        reset(e) {
                            window.cancelAnimationFrame(this.loop);
                            this.currentTime = 0;
                            this.$el.removeClass("playing");
                            return this.render(0);
                        }

                        end() {
                            var speed=25;
                            var t;
                            t = this.data.scale.length - 1;
                            window.setTimeout((() => {
                                return this.render(t);
                            }), this.playing ? speed : 0);
                            this.currentTime = 1;
                            this.playing = false;
                            return this.$el.removeClass("playing");
                        }

                        startDate(e) {
                            this.stop();
                            this.trackPosition = true;
                            return this.moveDate(e);
                        }

                        moveDate(e) {
                            var o, t, x;
                            if (!this.trackPosition) {
                                return;
                            }
                            o = this.$elements.minimap.offset();
                            x = e.clientX;
                            t = (x - o.left) / this.$elements.minimap.width();
                            t = Math.min(Math.max(t, 0), 1);
                            this.currentTime = t;
                            return this.render(t * (this.data.scale.length - 1));
                        }

                        endDate(e) {
                            return this.trackPosition = false;
                        }

                    };

                    MapView.prototype.data = {
                        "path": "data",
                        "scale": [],
                        "keys": ["values"],
                        "scaleFactor": 1000000000,
                        "stack": true,
                        "suffix": "",
                        "prefix": "",
                        "duration": 20000,
                        "limit": 20,
                        "classes": {"0": "constant", "0.7": "projected"},
                        "items": [{
                        }]};

                    MapView.prototype.events = {
                        "click #btn-play": "play",
                        "click #btn-pause": "pause",
                        "click #btn-reset": "reset",
                        "click #btn-end": "end",
                        "pointerdown #map-timeline-minimap": "startDate",
                        "pointercancel": "endDate"
                    };

                    // MapView.prototype.interpolate = d3.interpolateRgbBasis(["#0056fa", "#fff", "#fa0051"]);

                    MapView.prototype.interpolate =heat_color;
                    return MapView;

                }).call(this);

                return MapView;

            }).call(this);
        });
        require("app").initialize();
    });
}).call(this);


