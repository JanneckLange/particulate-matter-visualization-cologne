am4core.ready(async function () {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    const path = "http://3e7a93f6.ngrok.io/api";

    async function getData(min, max, sensor_id) {
        let res = await fetch(path + "/?min=" + min + "&max=" + max + "&sensor=" + sensor_id);
        return await res.json();
    }

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

    let activeSensors = [];

    for (let i = 0; i < sensors.length; i++) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "P2";
        series.dataFields.dateX = "timestamp";
        series.tooltipText = "{P2}";
        series.name = sensors[i];
        series.id = sensors[i];
        series.dataSource.updateCurrentData = false;
        series.dataSource.url = path+"/?sensor=" + sensors[i];
        //series.dateFormatter.inputDateFormat = "x";
        series.dataSource.load();
        series.hide();
    }

    console.log(activeSensors);

    var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;

    scrollbarX.events.on("up", async () => {
        let basic = chart.map.getKey(activeSensors[0]);
        let min = basic.xAxis.minZoomed;
        let max = basic.xAxis.maxZoomed;

        for (let i = 0; i < activeSensors.length; i++) {
            let current = chart.map.getKey(activeSensors[i]);
            current.data = await getData(min, max, activeSensors[i]);
        }
    });

    function makeInactive(sensor_id) {
        const index = activeSensors.indexOf(sensor_id);
        if (index > -1) {
            activeSensors.splice(index, 1);
        }
    }

    function makeActive(sensor_id) {
        if(!activeSensors.includes(sensor_id)) {
            activeSensors.push(sensor_id);
            if(activeSensors.length > 5) {
                console.log("slicing");
                let current = activeSensors.shift();
                console.log(current);
                chart.map.getKey(current).hide();
            }
        }
    }

    chart.legend = new am4charts.Legend();
    chart.legend.itemContainers.template.events.on("hit", (ev) => {
        let sensor_id = ev.target.dataItem.dataContext.name;
        //somehow status updates to late..so we have to ask for the opposite -.-
        if (!ev.target.dataItem.dataContext.isHidden) {
            //console.log(sensor_id + " is hidden");
            makeInactive(sensor_id);
        } else {
            //console.log(sensor_id + " is visible");
            makeActive(sensor_id);
        }
    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fill = am4core.color("#000");
    chart.cursor.lineX.fillOpacity = 0.1;

}, "chartdiv", am4charts.XYChart);
// end am4core.ready()
