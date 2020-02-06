<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>国内2019-nCov疫情变化追踪图</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
    <meta http-equiv="content-type" content="text/html;UTF-8">
    <meta http-equiv="content-language" content="en">
    <link rel="stylesheet" href="vendor/app.37391c5.css">
    <link rel="stylesheet" href="wuhanUp.css">
</head>
<body>



<div id="wrapper" data-view="map">

    <div id="map-wrapper">
        <svg id="map" width="100%" height="100%">
            <text x="50%" y="50%" text-anchor="middle">Loading map...</text>
        </svg>

<!--        <div id="chart-title">-->
<!--            <h1 class="chart-title-main">国内疫情发展-->
<!--                <div class="chart-title-sub">累计确诊病例数</div>-->
<!--            </h1>-->
<!--        </div>-->


        <div id="map-scale">
            <div class="map-legend-label txt-bold">累计确诊病例数</div>
            <div id="map-scale-canvas-wrap">
                <canvas id="map-scale-canvas"></canvas>
            </div>
            <div class="flex flex-between">
                <div class="map-legend-label scale">0</div>
                <div class="map-legend-label scale">150</div>
                <div class="map-legend-label scale">300</div>
            </div>
        </div>
        <div id="chart-date"></div>
        <div id="controls">
            <a class="btn" id="btn-reset" tabindex="0">
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <rect class="btn-icon-shape" x="0" y="0" width="8" height="24"></rect>
                    <polygon class="btn-icon-shape" points="24,24 24,0 8,12 "></polygon>
                </svg>
            </a>
            <a class="btn" id="btn-play" tabindex="0">
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <polygon class="btn-icon-shape" points="2,24 2,0 22,12 "></polygon>
                </svg>
            </a>
            <a class="btn" id="btn-pause" tabindex="0">
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <rect class="btn-icon-shape" x="0" y="0" width="8" height="24"></rect>
                    <rect class="btn-icon-shape" x="16" y="0" width="8" height="24"></rect>
                </svg>
            </a>
            <a class="btn" id="btn-end" tabindex="0">
                <svg class="btn-icon" viewBox="0 0 24 24">
                    <rect class="btn-icon-shape" x="16" y="0" width="8" height="24"></rect>
                    <polygon class="btn-icon-shape" points="0,0 0,24 16,12 "></polygon>
                </svg>
            </a>
        </div>
    </div>
    <div id="map-timeline">
        <canvas id="map-timeline-minimap"></canvas>
        <div class="clearfix">
            <div class="map-legend-label" id="map-scale-min"></div>
            <div class="map-legend-label" id="map-scale-max"></div>
        </div>
    </div>
    <small class="txt-sans" id="chart-source"> 作者(ZX), 数据来源(
        <a href="https://zh.wikipedia.org/wiki/%E6%96%B0%E5%9E%8B%E5%86%A0%E7%8B%80%E7%97%85%E6%AF%92%E8%82%BA%E7%82%8E%E5%85%A8%E7%90%83%E7%96%AB%E6%83%85%E7%97%85%E4%BE%8B">维基百科</a>
        ), 网页参考(
        <a href="https://interactives.lowyinstitute.org/charts/china-us-trade-dominance/us-china-competition/">lowyinstitute</a>
        )
    </small>

    <div id="time-chart">
        <canvas id="time-plot"></canvas>
    </div>
</div>



<script type="text/javascript" src="vendor/Chart.min.js"></script>

<script type="text/javascript" src="vendor/jquery-3.4.1.min.js"></script>

<script type="text/javascript" src="vendor/vendor.37391c5.js"></script>
<script type="text/javascript" src="vendor/app.37391c5.js"></script>
<script type="text/javascript" src="vendor/d3.v5.js"></script>
<script type="text/javascript" src="wuhanUp.js"></script>



</body>
</html>
