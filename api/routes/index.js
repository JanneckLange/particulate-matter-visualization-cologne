const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const accurateDataTime = 10 * 3600000;
const hourlyDataTime = 7 * 24 * 3600000;
const timeOffset = 24 * 3600000;
const mongoProjection = {
    projection: {
        _id: 0,
        lat: 0,
        long: 0,
        dataType: 0
    }
};
const mongoConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
let dbo;
let sensors;


/**
 * start Database Connection and update sensor list
 */
function startDatabase() {
    MongoClient.connect(url, mongoConnectionOptions, function (err, db) {
        if (err) throw err;
        dbo = db.db("gdv");
        console.log('Database Connected');

        //update sensor list
        dbo.collection('dailyAVG').distinct('sensor_id').then((sensorData) => {
            sensors = sensorData;
        });
    });
}

router.get('/', function (req, res, next) {
    let min = req.query.min;
    let max = req.query.max;
    let sensor = req.query.sensor;

    //check if sensor exists
    if (!sensor || !sensors.includes(parseInt(sensor))) {
        res.send('sensor not available').status(400);
    } else if (!min && !max) {//send full sensor data when no min/max is given
        sendEverything(req, res, {sensor_id: parseInt(sensor)})
    } else if (min > max) {
        res.send('min must be lower than max').status(400);
    } else if (max - min < accurateDataTime) {//send hourly data when time range is smaller than accurateDataTime
        console.log('send accurate Data');
        sendAccurateDataTime(req, res);
    } else if (max - min < hourlyDataTime) {//send daily data when time range is smaller than hourlyDataTime
        console.log('send average Data (hour)');
        sendAverageDataTime(req, res, 'hourlyAVG');
    } else {
        console.log('send average Data (day)');
        sendAverageDataTime(req, res, 'dailyAVG');
    }
});

router.get('/info', function (req, res, next) {
    dbo.collection('dailyAVG').find().sort({timestamp: 1}).limit(1).toArray((err, minData) => {
        dbo.collection('dailyAVG').find().sort({timestamp: -1}).limit(1).toArray((err, maxData) => {
            res.send({
                sensors: sensors,
                min: minData[0].timestamp,
                max: maxData[0].timestamp,
                autoAccuracy: {
                    accurate: hourlyDataTime,
                    hourlyAverage: accurateDataTime,
                    dailyAverage: null,
                    description: "send data when time range between min and max timestamp is smaller than given value (milliseconds). Null value means everything else."
                }
            });
        });
    })
});

router.get('/sensor', async function (req, res, next) {
    res.send(await getCoordinatesFromSensors());
});

router.get('/events', function (req, res, next) {
    dbo.collection('events').find({}, {
        projection: {
            _id: 0,
            description: 0,
            type: 0
        }
    }).sort({date_start: 1}).toArray(async (err, data) => {
        const sensorMaxDistanceInKm = 0.5;
        let sensorCoordinates = await getCoordinatesFromSensors();
        let eventsWithSensors = [];
        data.forEach(event => {
            let sensorInRange = getSensorsInRange(event.lat, event.long, sensorMaxDistanceInKm, sensorCoordinates);
            if (sensorInRange.length > 0) {
                // eventsWithSensors.push({
                //     event: event,
                //     sensorMaxDistance: sensorMaxDistanceInKm,
                //     sensors: sensorInRange
                // });
                event.sensors = sensorInRange;
                event.sensorMaxDistance = sensorMaxDistanceInKm;
                eventsWithSensors.push(event);
            }
        });
        // console.log(eventsWithSensors.length):
        res.send(eventsWithSensors)
    });
});

router.get('/weather', function (req, res, next) {
    let min = req.query.min;
    let max = req.query.max;
    let query = {
        date: {
            $gte: parseInt(min),//min Date
            $lt: parseInt(max)//max Date
        }
    };
    let projection = {
        projection: {
            _id: 0
        }
    }


    dbo.collection('weatherAir_Converted').find(query, projection).toArray(function (err, data_air) {
        if (err) throw err;
        dbo.collection('weatherNiederschlag_Converted').find(query, projection).toArray(function (err, data_nie) {
            if (err) throw err;
            dbo.collection('weatherSolar_Converted').find(query, projection).toArray(function (err, data_sol) {
                if (err) throw err;
                dbo.collection('weatherWind_Converted').find(query, projection).toArray(function (err, data_win) {
                    if (err) throw err;
                    res.send({
                        air: data_air,
                        niederschlag: data_nie,
                        solar: data_sol,
                        wind: data_win
                    });
                });
            });
        });
    });
});

function getSensorsInRange(eventLat, eventLong, range, sensors) {
    let sensorsInRange = [];
    sensors.forEach(sensor => {
        if (getDistanceFromLatLonInKm(sensor.lat, sensor.long, eventLat, eventLong) < range) {
            sensorsInRange.push(sensor._id)
        }
    });
    return sensorsInRange;
}

function getCoordinatesFromSensors() {
    return new Promise((res) => {
        dbo.collection('dailyAVG').aggregate([
            {
                $group: {
                    _id: '$sensor_id',
                    lat: {$last: '$lat'},
                    long: {$last: '$long'}
                }
            },
            {$sort: {_id: 1}}
        ]).toArray((err, data) => {
            res(data);
        });
    })

}

/**
 * send original sensor data
 * @param req
 * @param res
 */
function sendAccurateDataTime(req, res) {
    let sensor = req.query.sensor;
    let min = req.query.min - timeOffset;
    let max = req.query.max + timeOffset;

    let query = {
        timestamp: {
            $gte: parseInt(min),//min Date
            $lt: parseInt(max)//max Date
        }
    };
    dbo
        .collection("s" + sensor)
        .find(query, mongoProjection)
        .sort({timestamp: 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.send({resolution: 'accurateDataTime', data: result});
        });
}

/**
 * send daily or hourly average for time range
 * @param req
 * @param res
 * @param accuracy string 'hourlyAVG' or 'dailyAVG'
 */
function sendAverageDataTime(req, res, accuracy) {
    let sensor = req.query.sensor;
    let min = req.query.min - timeOffset;
    let max = req.query.max + timeOffset;


    let query = {
        timestamp: {
            $gte: parseInt(min),//min Date
            $lt: parseInt(max)//max Date
        },
        sensor_id: parseInt(sensor)
    };
    dbo
        .collection(accuracy)
        .find(query, mongoProjection)
        .sort({timestamp: 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.send({resolution: accuracy === 'hourlyAVG' ? 'hourlyDataTime' : 'averageDataTime', data: result});
        });
}

/**
 * send daily average for query
 * @param req
 * @param res
 * @param query for mongo search
 */
function sendEverything(req, res, query) {
    dbo
        .collection('dailyAVG')
        .find(query, mongoProjection)
        .sort({timestamp: 1})
        .toArray(function (err, result) {
            if (err) throw err;
            res.send({resolution: 'averageDataTime', data: result});
        });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    // console.log(`lat1: ${lat1}, lon1: ${lon1}, lat2: ${lat2}, lon2: ${lon2}, d=${d} `)
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module.exports = {
    router: router,
    dbStarter: startDatabase()
};
