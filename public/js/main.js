am4core.ready(async function () {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    const path = "http://e3e1402c.ngrok.io/api";

    async function getData(min, max, sensor_id) {
        let res = await fetch(path + "/?min=" + min + "&max=" + max + "&sensor=" + sensor_id);
        return await res.json();
    }

    async function getLocations() {
        let res = await fetch(path + "/sensor");
        return await res.json();
    }

    async function getSensors() {
        let res = await fetch(path + "/info");
        return await res.json();
    }

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    dateAxis.dateFormatter.dateFormat = "d MMM, yyyy";

    let accuracy = "averageDataTime";
    let currentMin;
    let currentMax;

    dateAxis.groupData = true;

    let sensors = await getSensors();
    sensors = sensors.sensors;

    let activeSensors = [];

    for (let i = 0; i < sensors.length; i++) {
        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "P2";
        series.dataFields.dateX = "timestamp";
        series.tooltipText = "{dateX.formatDate('yyyy-mm-dd')}: P2: {valueY.formatNumber('#.00')}";
        series.strokeWidth = 2;
        series.opacity = 0.7;
        series.name = sensors[i].toString();
        series.id = sensors[i];
        series.dataSource.updateCurrentData = false;
        series.dataSource.url = path + "/?sensor=" + sensors[i];
        series.resolution = "";
        series.minBulletDistance = 30;

        /*var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;*/

        series.dataSource.events.on("done", (ev) => {
            series.data = ev.data[0].data;
            series.resolution = ev.data[0].resolution;
            console.log(series.resolution);
        });

        series.hide();
    }

    console.log(activeSensors);

    /*var scrollbarX = new am4core.Scrollbar();
    scrollbarX.marginBottom = 20;
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.startGrip.disabled = true;
    chart.scrollbarX.endGrip.disabled = true;
    chart.scrollbarX.thumb.minWidth = 50;*/

    var sliderX = new am4core.Slider;
    sliderX.marginBottom = 20;

    chart.events.on("up", () => {
        updateData();
        console.log("chart touched")
    });

    async function updateData() {
        if (activeSensors.length > 0) {
            let basic = chart.map.getKey(activeSensors[0]);
            let min = basic.xAxis.minZoomed;
            let max = basic.xAxis.maxZoomed;

            let delta = max - min;
            let newAccuracy;
            if (delta < 5 * 3600000) {
                newAccuracy = "accurateDataTime";
            } else if (delta < 7 * 24 * 3600000) {
                newAccuracy = "hourlyDataTime";
            } else {
                newAccuracy = "averageDataTime";
            }

            if (newAccuracy !== accuracy || (min < currentMin || max > currentMax) && newAccuracy !== accuracy) {
                console.log("updating data");
                for (let i = 0; i < activeSensors.length; i++) {
                    let current = chart.map.getKey(activeSensors[i]);
                    let data = await getData(min, max, activeSensors[i]);
                    current.data = data.data;
                }
                accuracy = newAccuracy;
                currentMin = min;
                currentMax = max;
            }
        }
    }

    function makeInactive(sensor_id) {
        const index = activeSensors.indexOf(sensor_id);
        if (index > -1) {
            activeSensors.splice(index, 1);
        }
    }

    function makeActive(sensor_id) {
        if (!activeSensors.includes(sensor_id)) {
            activeSensors.push(sensor_id);

            if (activeSensors.length > 5) {
                console.log("slicing");
                let current = activeSensors.shift();
                chart.map.getKey(current).hide();
            }
        }
    }

    /*chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    var marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color("#ccc");
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
    });*/

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fill = am4core.color("#000");
    chart.cursor.lineX.fillOpacity = 0.1;


    //MAP --------------------------------------------------------------------------------------------------------------
    function makeIcon(sensor_id, active) {
        let color;
        if(active) {
            let current = chart.map.getKey(sensor_id);
            color = current.stroke.hex;
        } else {
            color = '#a3a3a3';
        }

        const markerHtmlStyles = `
          background-color: ${color};
          width: 1rem;
          height: 1rem;
          display: block;
          left: -1.5rem;
          top: -1.5rem;
          position: relative;
          border-radius: 3rem 3rem 0;
          transform: rotate(45deg);
          border: 1px solid #FFFFFF`;

        return L.divIcon({
            className: sensor_id.toString(),
            iconAnchor: [0, 24],
            labelAnchor: [-6, 0],
            popupAnchor: [0, -36],
            html: `<span style="${markerHtmlStyles}" />`
        });
    }


    const mymap = L.map('map', {
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false
    })
        .setView([50.9126403, 6.962307], 12);

    let loc = await getLocations();
    loc.forEach(sensorLocation => {
        let marker = L.marker([sensorLocation.lat, sensorLocation.long], {
            riseOnHover: true,
            title: sensorLocation._id,
            doubleClickZoom: false,
            icon: makeIcon(sensorLocation._id, false),
        }).addTo(mymap);

        marker.gdvStats = {
            active: false
        };

        marker.on('click', (x) => {
            let sensor_id = x.target.options.title;
            if (marker.gdvStats.active) {
                x.target.setIcon(makeIcon(sensor_id, false));
                makeInactive(sensor_id);
                let current = chart.map.getKey(sensor_id);
                current.hide();
                marker.gdvStats.active = false;
            } else {
                x.target.setIcon(makeIcon(sensor_id, true));
                makeActive(sensor_id);
                let current = chart.map.getKey(sensor_id);
                current.show();
                marker.gdvStats.active = true;
            }
        })
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 13,
        minZoom: 13,
        id: 'mapbox/streets-v11'
    }).addTo(mymap);
// ---------------------------------------------------------------------------------------------------------------------
}, "chartdiv", am4charts.XYChart);
// end am4core.ready()