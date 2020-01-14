am4core.ready(async function () {
    am4core.options.minPolylineStep = 10;
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    const path = "http://f16d5eda.ngrok.io/api";


    let mainContainer;
    let timeLineContainer;
    let chart;
    let dirtDateAxis;
    let weatherDateAxis;
    let dirtAxis;
    let weatherAxis;
    let sensors = await getSensors();
    let timeLineChart;
    let myMap;


    let accuracy = "averageDataTime";
    let currentMin;
    let currentMax;
    let activeSensors = [];

    let currentWeatherMin;
    let currentWeatherMax;

    async function initChart() {
        // CREATE CHART ------------------------------------------------------------------------------------------------
        chart = am4core.create("chartdiv", (am4charts.XYChart));
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
        setDateAxisProperties();
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
            series.tooltipText = "{dateX.formatDate('yyyy-MM-dd')}: P2: {valueY.formatNumber('#.00')}";
            series.tooltipText = `[bold]{dateX.formatDate('dd.MM.yyyy')}[/]
P2: {valueY.formatNumber('#.00')}
Niederschlag: noll`;
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
                setDateAxisProperties();
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

    function initTimeline() {
        //am4core.useTheme(am4themes_animated);
        timeLineChart = am4core.create("timeLineDiv", am4plugins_timeline.SerpentineChart);
        timeLineChart.curveContainer.padding(20, 20, 20, 20);
        timeLineChart.levelCount = 4;
        timeLineChart.orientation = "vertical";
        timeLineChart.yAxisRadius = am4core.percent(45);
        timeLineChart.yAxisInnerRadius = am4core.percent(-45);
        timeLineChart.maskBullets = false;
        timeLineChart.language.locale = am4lang_de_DE;

        let colorSet = new am4core.ColorSet();
        colorSet.saturation = 0.5;

        timeLineChart.dateFormatter.dateFormat = "yyyy-MM-dd";
        timeLineChart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
        timeLineChart.fontSize = 11;

        let categoryAxis = timeLineChart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.paddingRight = 25;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.innerRadius = -60;
        categoryAxis.renderer.radius = 60;

        let dateAxis = timeLineChart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 70;
        dateAxis.baseInterval = { count: 1, timeUnit: "day" };
        dateAxis.renderer.tooltipLocation = 0;
        dateAxis.startLocation = -0.5;
        dateAxis.renderer.line.strokeDasharray = "1,4";
        dateAxis.renderer.line.strokeOpacity = 0.6;
        dateAxis.tooltip.background.fillOpacity = 0.2;
        dateAxis.tooltip.background.cornerRadius = 5;
        dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        dateAxis.tooltip.label.paddingTop = 7;

        let labelTemplate = dateAxis.renderer.labels.template;
        labelTemplate.verticalCenter = "middle";
        labelTemplate.fillOpacity = 0.7;
        labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
        labelTemplate.background.fillOpacity = 1;
        labelTemplate.padding(7, 7, 7, 7);

        let series = timeLineChart.series.push(new am4plugins_timeline.CurveColumnSeries());
        series.columns.template.height = am4core.percent(20);
        series.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

        series.dataFields.openDateX = "start";
        series.dataFields.dateX = "end";
        series.dataFields.categoryY = "category";
        series.columns.template.propertyFields.fill = "color"; // get color from data
        series.columns.template.propertyFields.stroke = "color";
        series.columns.template.strokeOpacity = 0;

        let eventSeries = timeLineChart.series.push(new am4plugins_timeline.CurveLineSeries());
        eventSeries.dataFields.dateX = "date_start";
        eventSeries.dataFields.optionOne = "date_end";
        eventSeries.dataFields.categoryY = "category";
        eventSeries.data = [
            {
                "name": "Straßenfest Neusser Straße",
                "date_start": 1525392000000,
                "date_end": 1525647600000,
                "lat": 50.96236449670464,
                "long": 6.954247264208018,
                "sensors": [
                    35245
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Tag des guten Lebens",
                "date_start": 1530421200000,
                "date_end": 1530473400000,
                "lat": 50.94988476658721,
                "long": 6.956903564961454,
                "sensors": [
                    5129,
                    24877,
                    28387,
                    32834
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Silvesterfeuerwerk 2018",
                "date_start": 1546218000000,
                "date_end": 1546300800000,
                "lat": 50.938014156165195,
                "long": 6.957558024318678,
                "sensors": [
                    3677
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest Neusser Straße",
                "date_start": 1525392000000,
                "date_end": 1525647600000,
                "lat": 50.96236449670464,
                "long": 6.954247264208018,
                "sensors": [
                    35245
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Tag des guten Lebens",
                "date_start": 1530421200000,
                "date_end": 1530473400000,
                "lat": 50.94988476658721,
                "long": 6.956903564961454,
                "sensors": [
                    5129,
                    24877,
                    28387,
                    32834
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Silvesterfeuerwerk 2018",
                "date_start": 1546218000000,
                "date_end": 1546300800000,
                "lat": 50.938014156165195,
                "long": 6.957558024318678,
                "sensors": [
                    3677
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Karneval - Zülpicher Viertel",
                "date_start": 1551315600000,
                "date_end": 1551744000000,
                "lat": 50.92965018028039,
                "long": 6.938020814412779,
                "sensors": [
                    12812
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Karneval - Altstadt",
                "date_start": 1551315600000,
                "date_end": 1551744000000,
                "lat": 50.93708251207144,
                "long": 6.960505602823413,
                "sensors": [
                    3677
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Karneval - Geisterzug",
                "date_start": 1551546000000,
                "date_end": 1551564000000,
                "lat": 50.932672745344505,
                "long": 6.921541321346401,
                "sensors": [
                    1164,
                    3403,
                    11642,
                    18459
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Veranstaltung \"Straßenland\"",
                "date_start": 1561161600000,
                "date_end": 1561330800000,
                "lat": 50.94466639808929,
                "long": 6.953282581591832,
                "sensors": [
                    5129,
                    24877,
                    28387
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest am Eigelstein",
                "date_start": 1561680000000,
                "date_end": 1561935600000,
                "lat": 50.94772854175718,
                "long": 6.956635344509361,
                "sensors": [
                    5129,
                    24877,
                    28387,
                    32834
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest Deutzer Freiheit",
                "date_start": 1564704000000,
                "date_end": 1564959600000,
                "lat": 50.936770134685865,
                "long": 6.973619092877602,
                "sensors": [
                    28499
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            }, {
                "name": "CSD",
                "date_start": 1562500800000,
                "date_end": 1562522400000,
                "lat": 50.9358564,
                "long": 6.9614686,
                "sensors": [
                    11279, 19917, 3677, 3585
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest Venloer Straße",
                "date_start": 1565308800000,
                "date_end": 1565564400000,
                "lat": 50.94885736225773,
                "long": 6.919159520987985,
                "sensors": [
                    3601
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest Agnesviertel",
                "date_start": 1565913600000,
                "date_end": 1566169200000,
                "lat": 50.95293980866827,
                "long": 6.9571825156304214,
                "sensors": [
                    5898,
                    32834
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "gamescom city festival",
                "date_start": 1566432000000,
                "date_end": 1566774000000,
                "lat": 50.93900106816272,
                "long": 6.939592588621571,
                "sensors": [
                    13455
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Straßenfest Carrée Sülz-Klettenberg",
                "date_start": 1567123200000,
                "date_end": 1567378800000,
                "lat": 50.91684774920366,
                "long": 6.9255968229677505,
                "sensors": [
                    2502
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Dä längste Desch vun Kölle",
                "date_start": 1568937600000,
                "date_end": 1569193200000,
                "lat": 50.92411146229489,
                "long": 6.958638001506143,
                "sensors": [
                    11279
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Rund an der Eigelsteintorburg",
                "date_start": 1569729600000,
                "date_end": 1569776400000,
                "lat": 50.94950625141212,
                "long": 6.956839192065867,
                "sensors": [
                    5129,
                    24877,
                    28387,
                    32834
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Köln Marathon",
                "date_start": 1570752000000,
                "date_end": 1571007600000,
                "lat": 50.94168517528119,
                "long": 6.955372376235818,
                "sensors": [
                    5129
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Köln Marathon",
                "date_start": 1570752000000,
                "date_end": 1571007600000,
                "lat": 50.939812518374175,
                "long": 6.974391568526428,
                "sensors": [
                    28499
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Halloween",
                "date_start": 1572483600000,
                "date_end": 1572566400000,
                "lat": 50.93015733580246,
                "long": 6.938879121763812,
                "sensors": [
                    12812
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Karnevalseröffnung - Altstadt",
                "date_start": 1573434000000,
                "date_end": 1573516800000,
                "lat": 50.92981923270955,
                "long": 6.938439239392281,
                "sensors": [
                    12812
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Karnevalseröffnung - Altstadt",
                "date_start": 1573434000000,
                "date_end": 1573516800000,
                "lat": 50.936338059327326,
                "long": 6.960473987554355,
                "sensors": [
                    3677,
                    19917
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            },
            {
                "name": "Verkaufsoffener Sonntag in der Innenstadt",
                "date_start": 1576411200000,
                "date_end": 1576429200000,
                "lat": 50.93649969224725,
                "long": 6.955229867558557,
                "sensors": [
                    3677
                ],
                "sensorMaxDistance": 0.5,
                "category": ""
            }];

        eventSeries.strokeOpacity = 0;

        let bullet = eventSeries.bullets.push(new am4charts.CircleBullet());

        let circle = bullet.createChild(am4core.Circle);
        circle.radius = 15;
        circle.fillOpacity = 1;
        circle.strokeOpacity = 0;

        let circleHoverState = circle.states.create("hover");
        circleHoverState.properties.scale = 1.3;


        series.heatRules.push({ target: circle, min: 20, max: 50, property: "radius" });
        circle.adapter.add("fill", function(fill, target) {
            if (target.dataItem) {
                return timeLineChart.colors.getIndex(target.dataItem.index)
            }
        });
        circle.tooltipText = "{dateX.formatDate('dd.MM.yyyy')} - {optionOne.formatDate('dd.MM.yyyy')}";

        circle.adapter.add("tooltipY", function(tooltipY, target){
            return -target.pixelRadius - 4;
        });

        let textLabel = bullet.createChild(am4core.Label);
        textLabel.text = "{name}";
        textLabel.strokeOpacity = 0;
        textLabel.fill = am4core.color("#000");
        textLabel.horizontalCenter = "middle";
        textLabel.verticalCenter = "middle";
        textLabel.interactionsEnabled = false;

        timeLineChart.scrollbarX = new am4core.Scrollbar();
        timeLineChart.scrollbarX.align = "center";
        timeLineChart.scrollbarX.width = am4core.percent(85);

        let outerCircle = bullet.createChild(am4core.Circle);
        outerCircle.radius = 30;
        outerCircle.fillOpacity = 0;
        outerCircle.strokeOpacity = 0;
        outerCircle.strokeDasharray = "1,3";

        let hoverState = outerCircle.states.create("hover");
        hoverState.properties.strokeOpacity = 0.8;
        hoverState.properties.scale = 1.5;

        outerCircle.events.on("over", function(event){
            let circle = event.target.parent.children.getIndex(1);
            circle.isHover = true;
            event.target.stroke = circle.fill;
            event.target.radius = circle.pixelRadius;
            event.target.animate({property: "rotation", from: 0, to: 360}, 4000, am4core.ease.sinInOut);
        });

        outerCircle.events.on("out", function(event){
            let circle = event.target.parent.children.getIndex(1);
            circle.isHover = false;
        });

        bullet.events.on("hit", (event) => {
            console.log(event.target);
        });

        let cursor = new am4plugins_timeline.CurveCursor();
        timeLineChart.cursor = cursor;
        cursor.xAxis = dateAxis;
        cursor.yAxis = categoryAxis;
        cursor.lineY.disabled = true;
        cursor.lineX.strokeDasharray = "1,4";
        cursor.lineX.strokeOpacity = 1;

        dateAxis.renderer.tooltipLocation2 = 0;
        categoryAxis.cursorTooltipEnabled = false;

        console.log("timeline ready")
    }

    function setDateAxisProperties() {
        dirtDateAxis.dateFormats.setKey("month", "MMMM YYYY");
        dirtDateAxis.dateFormats.setKey("day", "dd.MM.YYYY");
        dirtDateAxis.dateFormats.setKey("hour", "HH:mm");
        dirtDateAxis.dateFormats.setKey("minute", "HH:mm");
        dirtDateAxis.periodChangeDateFormats.setKey("month", "MMMM [bold]yyyy[/]");
        dirtDateAxis.periodChangeDateFormats.setKey("day", "dd. [bold]MMMM[/] YYYY");
        dirtDateAxis.periodChangeDateFormats.setKey("hour", "[bold]dd. MMM[/] HH:mm");
        dirtDateAxis.periodChangeDateFormats.setKey("minute", "[bold]dd. MMM[/] HH:mm");
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

            if (newAccuracy !== accuracy || (min < currentMin || max > currentMax)) {
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
        if (active) {
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

    initTimeline();
    initChart();
// ---------------------------------------------------------------------------------------------------------------------
});





