am4core.ready(async function () {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    const path = "http://e3e1402c.ngrok.io/api";


    let mainContainer;
    let chart;
    let dirtDateAxis;
    let weatherDateAxis;
    let dirtAxis;
    let weatherAxis;
    let slider;
    let myMap;
    let sensors = await getSensors();


    let accuracy = "averageDataTime";
    let currentMin;
    let currentMax;
    let activeSensors = [];

    let currentWeatherMin;
    let currentWeatherMax;

    function initMainContainer() {
        mainContainer = am4core.create("chartdiv", am4core.Container);
        mainContainer.background.fillOpacity = 0.3;
        mainContainer.background.fill = am4core.color("#79b8df");
        mainContainer.width = am4core.percent(100);
        mainContainer.height = am4core.percent(100);
    }

    async function initChart() {
        // CREATE CHART ------------------------------------------------------------------------------------------------
        chart = mainContainer.createChild(am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        chart.zoomOutButton.disabled = true;
        chart.events.on("up", () => {
            // necessary because min/max zoom level updates slow
            setTimeout(() => updateData(), 200);
        });
        // -------------------------------------------------------------------------------------------------------------

        // CREATE AXES -------------------------------------------------------------------------------------------------
        weatherDateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dirtDateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dirtDateAxis.baseInterval = weatherDateAxis.baseInterval = {
            "timeUnit": "minute",
            "count": 1
        };
        weatherDateAxis.min = sensors.min;
        weatherDateAxis.max = sensors.max;
        weatherDateAxis.cursorTooltipEnabled = false;
        weatherDateAxis.hidden = true;

        dirtAxis = chart.yAxes.push(new am4charts.ValueAxis());
        weatherAxis = chart.yAxes.push(new am4charts.ValueAxis());
        weatherAxis.renderer.opposite = true;
        weatherAxis.renderer.cellStartLocation = 0;
        weatherAxis.renderer.cellEndLocation = 1;
        weatherAxis.min = 0;

        dirtDateAxis.dateFormatter.dateFormat = "d MMM, yyyy";
        dirtDateAxis.groupData = true;

        weatherDateAxis.groupData = true;

        // dateAxis.baseInterval = {count: 1, timeUnit: "day"};
        // -------------------------------------------------------------------------------------------------------------

        // CREATE WEATHER SERIES ---------------------------------------------------------------------------------------
        let weather = chart.series.push(new am4charts.ColumnSeries());
        weather.strokeWidth = 3;
        weather.fillOpacity = 0.5;
        weather.dataFields.valueY = "Niederschlag";
        weather.dataFields.dateX = "date";
        weather.dataSource.url = path + "/weather";
        weather.yAxis = weatherAxis;
        weather.xAxis = weatherDateAxis;
        weather.name = "weather";
        weather.id = "weather";
        weather.groupFields.valueY = "sum";

        weather.dataSource.events.on("done", (ev) => {
            ev.data[0].data.P2 += 3600000;
            weather.data = ev.data[0].data;
            weather.resolution = ev.data[0].type;
            weather.invalidateRawData();
        });
        // -------------------------------------------------------------------------------------------------------------

        // CREATE DIRT SERIES -----------------------------------------------------------------------------------------------
        sensors = sensors.sensors;

        for (let i = 0; i < sensors.length; i++) {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "P2";
            series.dataFields.dateX = "timestamp";
            series.tooltipText = "{dateX.formatDate('yyyy-mm-dd')}: P2: {valueY.formatNumber('#.00')}";
            series.strokeWidth = 2;
            series.opacity = 0.7;
            series.yAxis = dirtAxis;
            series.xAxis = dirtDateAxis;
            series.name = sensors[i].toString();
            series.id = sensors[i];
            series.dataSource.updateCurrentData = false;
            series.dataSource.url = path + "/?sensor=" + sensors[i];
            series.resolution = "";
            series.hide();

            series.groupFields.valueY = "average";
            series.dataSource.events.on("done", (ev) => {
                series.data = ev.data[0].data;
                series.resolution = ev.data[0].resolution;
            });
        }

        // -------------------------------------------------------------------------------------------------------------

        // CREATE CURSOR -----------------------------------------------------------------------------------------------
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dirtDateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;
        chart.cursor.behavior = "panX";
        // -------------------------------------------------------------------------------------------------------------

        let lowerRange = dirtAxis.axisRanges.create();
        let middleRange = dirtAxis.axisRanges.create();
        let upperRange = dirtAxis.axisRanges.create();

        lowerRange.value = 0;
        lowerRange.endValue = 20;
        lowerRange.axisFill.fill = am4core.color("#00b800");

        middleRange.value = 20;
        middleRange.endValue = 60;
        middleRange.axisFill.fill = am4core.color("#ffff00");

        upperRange.value = 60;
        upperRange.endValue = 1000;
        upperRange.axisFill.fill = am4core.color("#ff0000");

        upperRange.axisFill.fillOpacity = middleRange.axisFill.fillOpacity = lowerRange.axisFill.fillOpacity = 0.1;
        upperRange.grid.strokeOpacity = middleRange.grid.strokeOpacity = lowerRange.grid.strokeOpacity = 0;
    }

    async function getData(min, max, sensor_id) {
        let res = await fetch(path + "/?min=" + min + "&max=" + max + "&sensor=" + sensor_id);
        return await res.json();
    }

    async function getWeatherData(min, max) {
        let res = await fetch(path + "/weather/?min=" + min + "&max=" + max);
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

    async function updateData() {
        // regarding weather ---------------------------
        let weather = chart.map.getKey("weather");
        let weatherMin = weather.xAxis.minZoomed;
        let weatherMax = weather.xAxis.maxZoomed;
        let deltaWeather = weatherMax - weatherMin;
        let newWeatherAccuracy;
        if (deltaWeather < 31 * 24 * 3600000) {
            newWeatherAccuracy = "acc";
        } else {
            newWeatherAccuracy = "avg";
        }
        if (newWeatherAccuracy !== weather.resolution) {
            console.log("updating weather data");
            let data = await getWeatherData(weatherMin, weatherMax);
            weather.data = data.data;
            weather.resolution = newWeatherAccuracy;
            currentMin = weatherMin;
            currentMax = weatherMax;
            weather.invalidateRawData();
        }

        // regarding dirt ---------------------------
        if (activeSensors.length > 0) {
            let basic = chart.map.getKey(activeSensors[0]);
            let min = basic.xAxis.minZoomed;
            let max = basic.xAxis.maxZoomed;

            let delta = max - min;
            let newAccuracy;
            if (delta < 10 * 3600000) {
                newAccuracy = "accurateDataTime";
            } else if (delta < 7 * 24 * 3600000) {
                newAccuracy = "hourlyDataTime";
            } else {
                newAccuracy = "averageDataTime";
            }

            if (newAccuracy !== accuracy || ((min < currentMin || max > currentMax) && newAccuracy !== accuracy)) {
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
                // to many sensors active, deactivate first one
                console.log("slicing");
                // remove graph
                let current = activeSensors.shift();
                chart.map.getKey(current).hide();
                // change marker color
                for(let i in myMap._layers) {
                    let currentMarker = myMap._layers[i];
                    if(currentMarker.options.title === current) {
                        currentMarker.setIcon(makeIcon("", false));
                    }
                }
            }
        }
    }

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

    myMap = L.map('map', {
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
        }).addTo(myMap);

        marker.gdvStats = {
            active: false
        };

        marker.on('click', async (x) => {
            let sensor_id = x.target.options.title;
            if (marker.gdvStats.active) {
                x.target.setIcon(makeIcon("", false));
                makeInactive(sensor_id);
                let current = chart.map.getKey(sensor_id);
                current.hide();
                marker.gdvStats.active = false;
            } else {
                x.target.setIcon(makeIcon(sensor_id, true));
                makeActive(sensor_id);
                let current = chart.map.getKey(sensor_id);
                if (current.resolution !== accuracy) {
                    let basic = chart.map.getKey(activeSensors[0]);
                    let min = basic.xAxis.minZoomed;
                    let max = basic.xAxis.maxZoomed;
                    console.log("series needs update!");
                    let data = await getData(min, max, sensor_id);
                    current.data = data.data
                }
                current.show();
                marker.gdvStats.active = true;
            }
        })
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 13,
        minZoom: 13,
        id: 'mapbox/streets-v11'
    }).addTo(myMap);

    initMainContainer();
    initChart();
// ---------------------------------------------------------------------------------------------------------------------
}, "chartdiv", am4charts.XYChart);
// end am4core.ready()


