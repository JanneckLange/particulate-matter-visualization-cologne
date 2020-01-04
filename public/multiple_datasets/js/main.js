am4core.ready(function() {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    let data1 ="../data/sensor_1164_converted.json";
    let data2 ="../data/sensor_1164_converted.json";

    var chart = am4core.createFromConfig({
        "xAxes": [{
            "type": "DateAxis",
            "groupData": true,
            "dateFormats": {
                "day": "MMMM dt"
            }
        }],
        "yAxes": [{
            "type": "ValueAxis",
        }],
        "series": [{
            "type": "LineSeries",
            "dataSource": {
                "url": data1,
            },
            "dataFields": {
                "valueY": "P2",
                "dateX": "timestamp"
            },
            "name": "test",
            "minBulletDistance": 20
        },
            {
                "type": "LineSeries",
                "dataSource": {
                    "url": data2,
                },
                "dataFields": {
                    "valueY": "P1",
                    "dateX": "timestamp"
                },
                "name": "test2",
                "minBulletDistance": 20
            }],
        "legend": {},
        "scrollbar": true
    }, "chartdiv", am4charts.XYChart);
}); // end am4core.ready()