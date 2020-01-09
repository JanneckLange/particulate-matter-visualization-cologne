/**
 * Create a chart
 */
var chartData = [{
    "date": "2012-01-01",
    "distance": 227,
    "townName": "New York",
    "townSize": 25,
    "latitude": 40.712784,
    "longitude": -74.005941,
}, {
    "date": "2012-01-02",
    "distance": 371,
    "townName": "Washington",
    "townSize": 14,
    "latitude": 38.907192,
    "longitude": -77.036871,
}, {
    "date": "2012-01-03",
    "distance": 433,
    "townName": "Wilmington",
    "townSize": 6,
    "latitude": 39.739072,
    "longitude": -75.539788,
}, {
    "date": "2012-01-04",
    "distance": 345,
    "townName": "Jacksonville",
    "townSize": 7,
    "latitude": 30.332184,
    "longitude": -81.655651,
}, {
    "date": "2012-01-05",
    "distance": 480,
    "townName": "Miami",
    "townSize": 10,
    "latitude": 25.761680,
    "longitude": -80.191790,
}, {
    "date": "2012-01-06",
    "distance": 386,
    "townName": "Tallahassee",
    "townSize": 7,
    "latitude": 30.438256,
    "longitude": -84.280733,
}, {
    "date": "2012-01-07",
    "distance": 348,
    "townName": "New Orleans",
    "townSize": 10,
    "latitude": 29.951066,
    "longitude": -90.071532,
}, {
    "date": "2012-01-08",
    "distance": 238,
    "townName": "Houston",
    "townSize": 16,
    "latitude": 29.760427,
    "longitude": -95.369803,
}, {
    "date": "2012-01-09",
    "distance": 218,
    "townName": "Dallas",
    "townSize": 17,
    "latitude": 32.776664,
    "longitude": -96.796988,
}, {
    "date": "2012-01-10",
    "distance": 349,
    "townName": "Oklahoma City",
    "townSize": 11,
    "latitude": 35.467560,
    "longitude": -97.516428,
}, {
    "date": "2012-01-11",
    "distance": 603,
    "townName": "Kansas City",
    "townSize": 10,
    "latitude": 39.099727,
    "longitude": -94.578567,
}, {
    "date": "2012-01-12",
    "distance": 534,
    "townName": "Denver",
    "townSize": 18,
    "latitude": 39.739236,
    "longitude": -104.990251,
}, {
    "date": "2012-01-13",
    "townName": "Salt Lake City",
    "townSize": 12,
    "distance": 425,
    "latitude": 40.760779,
    "longitude": -111.891047,
    "alpha": 0.4
}, {
    "date": "2012-01-14",
    "townName": "Las Vegas",
    "latitude": 36.169941,
    "longitude": -115.139830
}];

var chart = AmCharts.makeChart("chartdiv", {
    type: "serial",
    theme:"light",
    dataDateFormat: "YYYY-MM-DD",
    dataProvider: chartData,
    startDuration: 1,
    categoryField: "date",
    valueAxes:[{
        axisAlpha:0,
        dashLength:2
    }],
    categoryAxis: {
        parseDates: true,
        minPeriod: "DD",
        autoGridCount: false,
        gridCount: 50,
        gridAlpha:0,
        dateFormats: [{
            period: 'DD',
            format: 'DD'
        }, {
            period: 'WW',
            format: 'MMM DD'
        }, {
            period: 'MM',
            format: 'MMM'
        }, {
            period: 'YYYY',
            format: 'YYYY'
        }]
    },

    graphs: [{
        valueField: "latitude",
        title: "latitude/city",
        valueAxis: "a2",
        lineColor: "#90afde",
        lineThickness: 1,
        bullet: "round",
        bulletSizeField: "townSize",
        bulletBorderColor: "#90afde",
        bulletBorderAlpha: 1,
        bulletBorderThickness: 2,
        bulletAlpha:1,
        bulletColor: "#FFFFFF",
        labelText: "[[townName]]",
        labelPosition: "bottom",
        labelOffset: 10,
        balloonText: "latitude: [[value]]",
        showBalloon: true
    }],
    chartCursor: {
        zoomable: false,
        categoryBalloonDateFormat: "DD",
        valueBalloonsEnabled: false,
        cursorAlpha: 0.1,
        cursorColor:"#90afde",
        fullWidth: true
    }
});

/**
 * Chart events
 */
chart.addListener("changed", function(event) {
    resetMarkers();
    if ( event.index === undefined )
        return;
    highlightMarker(chart.dataProvider[event.index].marker);
});

chart.addListener("init", function() {
    chart.chartCursor.addListener("onHideCursor", function() {
        resetMarkers();
    });
});

/**
 * Create a map
 */
var map;

function mapInit() {

    // set map options
    var mapOptions = {
        center: {
            lat: 50.9372142,
            lng: 6.9606245
        },
        zoom: 13
    };

    // create map instance
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // add markers (and assemble data for the lines)
    var points = [];
    for (var i = 0; i < chart.dataProvider.length; i++) {
        var dp = chart.dataProvider[i];
        dp.marker = addMarker(dp.latitude, dp.longitude, dp.townName, i);
        points.push(new google.maps.LatLng(dp.latitude, dp.longitude))
    }

    // add path
    var path = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#000000',
        strokeOpacity: 0.3,
        strokeWeight: 2
    });
    path.setMap(map);
}
google.maps.event.addDomListener(window, 'load', mapInit);

/**
 * Map-related functions
 */
function addMarker(lat, long, title, id) {
    // cretae marker
    var coord = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
        position: coord,
        opacity: 0.5,
        animation: google.maps.Animation.DROP,
        map: map,
        title: title,
        id: id
    });

    // add events
    google.maps.event.addListener(marker, 'mouseover', function() {
        resetMarkers();
        highlightMarker(this);
        chart.chartCursor.showCursorAt(chart.chartData[this.id].category);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        resetMarkers();
        chart.chartCursor.hideCursor();
    });

    return marker;
}

function highlightMarker(marker) {
    marker.setOpacity(1);
}

function getMarkers() {
    return chart.dataProvider.map(function(element, index, array) {
        return element.marker;
    })
}

function resetMarkers() {
    var markers = getMarkers()
    for (var i = 0; i < markers.length; i++) {
        if (markers[i] !== undefined)
            markers[i].setOpacity(0.5);
    }
}

function removeMarker() {
    if (chart.mapMarker !== undefined)
        chart.mapMarker.setMap(null);
}
