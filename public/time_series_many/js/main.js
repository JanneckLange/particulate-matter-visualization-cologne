am4core.ready(function() {

    am4core.useTheme(am4themes_animated);
    am4core.options.minPolylineStep = 5;

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.dataSource.url = "../data/test_refactored.csv";
    chart.dataSource.parser = new am4core.CSVParser();
    chart.dataSource.parser.options.useColumnNames = true;
    chart.dataSource.parser.options.delimiter = ";";
    chart.dateFormatter.inputDateFormat = "i";


    /*var data = [];
    var visits = 10;
    for (var i = 1; i < 50000; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), value: visits });
    }

    chart.data = data;*/

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 1;


// this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 500;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "timestamp";
    series.dataFields.valueY = "P2";
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.fillOpacity = 0.5;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

}); // end am4core.ready()