am4core.ready(async function () {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    const path = "http://localhost:3000/api";

    async function getData(min, max, sensor_id) {
        let res = await fetch(path + "/?min=" + min + "&max=" + max + "&sensor=" + sensor_id);
        return await res.json();
    }

    // async function getLowResolutionData(sensor_id) {
    //     let res = await fetch(path + "/?sensor=" + sensor_id);
    //     let data =await res.json();
    //     console.log(data)
    //     return data
    // }

    async function getSensors() {
        let res = await fetch(path + "/info");
        return await res.json();
    }

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.groupData = true;

    let sensors = await getSensors();
    sensors = sensors.sensors;

    for (let i = 0; i < sensors.length; i++) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "P2";
        series.dataFields.dateX = "timestamp";
        series.tooltipText = "{P2}";
        series.name = sensors[i];
        series.id = sensors[i];
        series.dataSource.updateCurrentData = true;
        series.dateFormatter = {
            "dateFormat": "MM-dd"
        };
        // series.dataSource.url = await getLowResolutionData(sensors[i]);
        series.dataSource.url = path+"/?sensor=" + sensors[i];
        series.dataSource.load();
    }

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    scrollbarX.events.on("up", async () => {
        console.log("Range: " + series.xAxis.minZoomed + ", " + series.xAxis.maxZoomed);
        for (let i = 0; i < sensors.length; i++) {
            let data = await getData(series.xAxis.minZoomed, series.xAxis.maxZoomed, sensors[i]);
            let current = chart.map.getKey(sensors[i]);
            current.dataSource.url = data;
            console.log(data);
            current.dataSource.load();
        }
    });

}, "chartdiv", am4charts.XYChart);
// end am4core.ready()
