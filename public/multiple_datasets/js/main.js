am4core.ready(function() {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    let data1 ="../data/sensor_1164_converted.json";
    let data2 ="../data/sensor_1164_converted.json";

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.groupData = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "P2";
    series.dataFields.dateX = "timestamp";
    series.tooltipText = "{P2}";
    series.name = "test";
    series.dataSource.updateCurrentData = true;
    series.dateFormatter = "x";
    series.dataSource.url = data1;

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    scrollbarX.events.on("up", () => {
        console.log("Range: " + series.xAxis.minZoomed + ", " + series.xAxis.maxZoomed);
        series.dataSource.load();
    });

}, "chartdiv", am4charts.XYChart);
// end am4core.ready()