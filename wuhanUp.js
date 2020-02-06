// var default_color="#D6ECEF";
// var default_color="#ffcbb1";
var default_color="#ffe9de";
var base_opacity=0.7;
var light_opacity=0.5;

var geo_features;
var daily_data;
var scale_range;
var scale_min;
var scale_max;
var divides=10;

function get_range(data)
{
    var values =[];
    var dt = data.map(e => Object.values(e).slice(1));
    for(var t = 0; t < dt.length; t++)
    {
        values = values.concat(dt[t]);
    }
    return values;
}

var heat_color;

// $(document).ready(function(){
//
// });


(function() {
    var getj = $.getJSON("daily.json");
    getj.done(function(data) {

        daily_data=data;
        var current_num=0;

        // console.log(daily_data[0].日期);
        // console.log(daily_data[0].湖北省);

        var scale_values=get_range(daily_data);
        scale_min = Math.round(Math.min.apply(null, scale_values));
        scale_max = Math.round(Math.max.apply(null, scale_values));

        scale_range=$.map($(Array(divides+1)),function(val, i) { return Math.round((scale_max-scale_min)*i/divides+scale_min); });

        var dt = daily_data.map(e => Object.values(e).slice(1));
        // var time_data=dt[0].map((col, i) => dt.map(row => row[i]));
        var time_whole_data=dt.map(e => (e.reduce((a,b) => a + b,0)));

        // var labels=daily_data.map(e=>e['日期'].substring(5));
        // var labels=d3.range(1,time_whole_data.length+1);

        var ctx = document.getElementById('time-plot').getContext('2d');
        var options = {
            type: 'line',
            data: {
                labels: daily_data.map(e=>e['日期'].substring(5)),
                datasets: [
                    {
                        label: '全国',
                        data: time_whole_data,
                        borderWidth: 1,
                        backgroundColor: '#eeeeee',
                        pointHoverRadius:10,
                        order:1
                    // }
                    },
                    {
                        label: '',
                        data: [],
                        borderWidth: 0,
                        backgroundColor: '#ffffff',
                        pointHoverRadius:10,
                        order:0
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            reverse: false
                        }
                    }]
                }
            }
        };


        var time_chart= new Chart(ctx, options);

        // time_chart.options.legend.position='right';
        time_chart.options.legend.display=false;

        require.register("views/map", function(exports, require, module) {
            heat_color = d3.scaleLinear()
            // heat_color = d3.scalePow().exponent(0.2)
            //     .range([default_color,"#ffcbb1","#ffb4a0","#e5989b","#b4838f","#6a6876"])
                .range([default_color,"#ffb4a0","#e5989b"])
                // .domain([0,1,10,50,100,300]);
                .domain(scale_range);

            var MapView;
            return MapView = (function() {
                var interpolate;

                class MapView extends Backbone.View {};
                interpolate = function(x, y, p) {
                    if (x >= 0 && y >= 0) {
                        return x + (y - x) * p;
                    }
                };

                // geo_features=root.features;
                // daily_data.forEach(function(x){
                //     var keyname=Object.keys(x).map(function(s) { return s.substring(0, 2)});
                //     geo_features.map(e => e['properties'][x['日期']]=Object.values(x)[keyname.indexOf(e.properties.name)] || 0);//replace undefined and null values with 0
                // });

                module.exports = MapView = (function() {
                    class MapView extends Backbone.View {
                        createScale() {
                            return this.scale=function(i) {
                                return Math.round((scale_max-scale_min)*i/divides+scale_min);
                            };
                        }

                        initialize(opts) {
                            this.createScale();
                            $(window).on("pointerup", _.bind(this.endDate, this));
                            $(window).on("pointermove", _.bind(this.moveDate, this));
                            if (opts.items) {
                                this.data.items = this.data[opts.items];
                            }

                            return d3.json("data/china.geojson").then((topo) => {
                                this.$elements = {
                                    blocks: {},
                                    labels: {},
                                    map: this.$("#map"),
                                    scale: this.$("#map-scale-canvas"),
                                    date: this.$("#chart-date"),
                                    minimap: this.$("#map-timeline-minimap"),
                                    keys: this.$(".chart-title-label")
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
                            geo_features=topo.features;
                            geo_features.map(e => e['properties']['values']=[]);
                            // var keyname=Object.keys(daily_data[0]).map(function(s) { return s.substring(0, 2)});
                            var keyname=Object.keys(daily_data[0]);

                            daily_data.forEach(function(x){
                                // geo_features.map(e => e['properties'][x['日期']]=Object.values(x)[keyname.indexOf(e.properties.name)] || 0);//replace undefined and null values with 0
                                geo_features.map(e => e['properties']['values'].push(Object.values(x)[keyname.findIndex(ele => ele.includes(e.properties.name))] || 0));//replace undefined and null values with 0
                            });

                            // this.data.scale=daily_data.map(e=>e['日期']);
                            this.data.scale=$.map($(Array(daily_data.length)),function(val, i) { return i; });
                            this.data.scale_text=daily_data.map(e=>e['日期']);
                            this.data.items=geo_features;


                            var map_scale_min=document.getElementById("map-scale-min");
                            var map_scale_max=document.getElementById("map-scale-max");

                            map_scale_min.innerHTML=this.data.scale_text[0];
                            map_scale_max.innerHTML=this.data.scale_text[this.data.scale_text.length-1];


                            var width = this.$elements.map.width();
                            var height = this.$elements.map.height();

                            var svg = d3.select("svg");
                            svg.selectAll("*").remove();


                            var adj_width=Math.min(500,width/2);

                            var projection = d3.geoMercator()
                                // .center([107, 32]).scale(600)
                                .center([107, 32]).scale(adj_width)
                                .translate([width/2, height/2]);

                            var path = d3.geoPath()
                                .projection(projection);

                            // svg.selectAll("*").remove();
                            svg = d3.select("#map").append("svg")
                                .attr("width", width)
                                .attr("height", height)
                                .append("g")
                                .attr("transform", "translate(0,0)");


                            var svg_enter=svg.selectAll("path")
                                .data(geo_features)
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
                                    if (d3.select(this).attr("opacity")>0) {
                                        d3.select(this).transition()
                                            .duration('50')
                                            .attr('opacity', light_opacity)
                                            .attr("stroke", "black")
                                            .attr("stroke-width", "1px");
                                    }
                                })
                                .on("mouseout",function(d,i){
                                    if (d3.select(this).attr("opacity")>0) {
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


                                    time_chart.data.datasets[0].label="全国";
                                    time_chart.data.datasets[0].data=time_whole_data;
                                    time_chart.data.datasets[0].backgroundColor='#eeeeee';

                                    if (d3.select(this).attr("opacity")>0) {
                                        time_chart.data.datasets[1].label=d.properties.name.toString();
                                        time_chart.data.datasets[1].data=geo_features[i].properties.values;
                                        time_chart.data.datasets[1].backgroundColor='#aaaaaa';
                                    }else
                                    {
                                        time_chart.data.datasets[1].label="";
                                        time_chart.data.datasets[1].data=[];
                                        time_chart.data.datasets[1].backgroundColor='#ffffff';
                                        time_chart.data.datasets[1].borderColor='#ffffff';
                                    }

                                    time_chart.update();
                                })
                                .on("mouseup", function (d,i) {
                                    if (d3.select(this).attr("opacity")>0) {
                                        tool_div.transition()
                                            .duration('50')
                                            .style("opacity", 1.0);
                                        tool_div.html(d.properties.name.toString() + ":" + d.properties.values[current_num].toString())
                                            .style("left", (Math.min(d3.event.pageX + 10, $('#map').width()-50)) + "px")
                                            .style("top", (Math.min(d3.event.pageY - 15,$('#map').height()-20)) + "px");

                                        time_chart.data.datasets[0].label="";
                                        time_chart.data.datasets[0].data=[];
                                        time_chart.data.datasets[0].backgroundColor='#ffffff';
                                        time_chart.data.datasets[0].borderColor='#ffffff';
                                        // time_chart.options.legend.display=false;

                                        time_chart.data.datasets[1].label=d.properties.name.toString();
                                        time_chart.data.datasets[1].data=geo_features[i].properties.values;
                                        time_chart.data.datasets[1].backgroundColor='#aaaaaa';
                                        time_chart.update();
                                    }
                                });
                        }

                        drawScale() {
                            var canvas, context, i, k, l, last, len, ref, results, s, v, values, w, x;
                            canvas = this.$elements.scale.get(0);
                            canvas.width = canvas.width * 2;
                            canvas.height = 2;
                            context = canvas.getContext("2d");
                            for (i = k = 0, ref = canvas.width; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
                                s = Math.floor((divides+1) * (k / (canvas.width - 2))) / divides;
                                // context.fillStyle = this.interpolate(s);
                                context.fillStyle = this.interpolate(s*(scale_max-scale_min)+scale_min);
                                context.fillRect(i, 0, 2, 2);
                            }
                            var three_scales=[scale_min,Math.round(0.5*(scale_min+scale_max)),scale_max];
                            var scale_label=document.getElementsByClassName("map-legend-label scale");

                            for (i=0;i<scale_label.length;i++)
                            {
                                scale_label[i].innerHTML=three_scales[i];
                            }
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
                            this.$elements.date.html(this.data.scale_text[this.data.scale[0] + Math.round(t)].slice(5));
                            data = geo_features;
                            for (k = 0, len = data.length; k < len; k++) {

                                item = data[k]['properties']['values'];
                                if (item) {
                                    vx = item[x];
                                    vy = item[y];
                                    sx = vx || scale_min;
                                    sy = vy || scale_max;
                                    value = interpolate(sx, sy, p);

                                    d3.select("#rtg-"+data[k]['properties']['id'])
                                        .attr("opacity", !(vx && vy) ? 0 : base_opacity)
                                        .attr("fill", this.interpolate(value));
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
                            var t;
                            t = this.data.scale.length - 1;
                            window.setTimeout((() => {
                                return this.render(t);
                            }), this.playing ? 100 : 0);
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


