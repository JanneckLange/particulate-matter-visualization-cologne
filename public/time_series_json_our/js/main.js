am4core.ready(function() {

    am4core.useTheme(am4themes_material);
    am4core.options.minPolylineStep = 50;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;

// Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
    var dataSource = new am4core.DataSource();
    chart.dataSource.url = "../data/alle_refactored_converted.json";
    chart.dataSource.incremental = true;
    chart.dataSource.load();

    dataSource.events.on("done", function(ev) {
        // Data loaded and parsed
        console.log(ev.target.data);
    });
    dataSource.events.on("error", function(ev) {
        console.log("Oopsy! Something went wrong");
    });

    chart.dataSource.parser = new am4core.JSONParser();
    chart.dataSource.parser.options.delimiter = ",";
    chart.dataSource.parser.options.inputDateFormat = "x";

    chart.dateFormatter.dateFormat = "yyyy-MM-dd";

// Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.groupData = true;
    dateAxis.groupCount = 500;
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.minZoomCount = 10;

// Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.minBulletDistance = 5;
    series.dataFields.valueY = "P2";
    series.dataFields.dateX = "timestamp";
    series.tooltipText = "{P2}";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

// Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
    var bullet = series.bullets.push(new am4core.Circle());
    bullet.strokeWidth = 2;
    bullet.radius = 4;
    bullet.fill = am4core.color("#fff");

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

// Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

});