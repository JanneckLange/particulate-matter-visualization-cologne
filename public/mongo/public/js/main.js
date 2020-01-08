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

    function getAllLowRes(sensor_id) {
        fetch("/api/?sensor=" + sensor_id)
            .then(async (response) => {
                return await response.json();
            })
    }

    function getSensors() {
        fetch("/api/info").
            then(async (response) => {
                return await response.json();
        })
    }

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.groupData = true;

    let sensors = getSensors().sensors;

    for(let i=0; i < sensors.length; i++) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "P2";
        series.dataFields.dateX = "timestamp";
        series.tooltipText = "{P2}";
        series.name = sensors[i];
        series.id = sensors[i];
        series.dataSource.updateCurrentData = true;
        series.dateFormatter = "x";
        series.dataSource.url = getAllLowRes(sensors[i]);
        series.dataSource.load();
    }

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    scrollbarX.events.on("up", () => {
        console.log("Range: " + series.xAxis.minZoomed + ", " + series.xAxis.maxZoomed);
        for(let i=0; i < sensors.length; i++) {
            let data = getData(series.xAxis.minZoomed, series.xAxis.maxZoomed, sensors[i]);
            let current = chart.map.getKey(sensors[i]);
            current.dataSource.url = data;
            console.log(data);
            current.dataSource.load();
        }
    });

}, "chartdiv", am4charts.XYChart);
// end am4core.ready()