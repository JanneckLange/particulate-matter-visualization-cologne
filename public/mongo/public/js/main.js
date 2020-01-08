am4core.ready(function() {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;

    function getData(min,max,sensor_id) {
        fetch("/api/?min=" + min + "&max=" + max + "&sensor=" + sensor_id)
            .then(async (response)=>{
                return await response.json();
            });
    }

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.groupData = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "P2";
    series.dataFields.dateX = "timestamp";
    series.tooltipText = "{P2}";
    series.name = "sensor_1164";
    series.dataSource.updateCurrentData = true;
    series.dateFormatter = {
        "dateFormat": "MM-dd"
    };
    series.dataSource.url = "http://localhost:3000/api";

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    scrollbarX.events.on("up", () => {
        console.log("Range: " + series.xAxis.minZoomed + ", " + series.xAxis.maxZoomed);
        let data = getData(series.xAxis.minZoomed, series.xAxis.maxZoomed, series.name);
        series.dataSource.url = data;
        console.log(data);
        series.dataSource.load();
    });

}, "chartdiv", am4charts.XYChart);
// end am4core.ready()