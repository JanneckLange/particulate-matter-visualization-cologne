const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const sensors = [
    1164, 2502, 3403, 3585, 3601,
    3677, 5129, 5175, 5898, 9712,
    10695, 10932, 11279, 11642, 12812,
    13455, 13457, 14945, 15291, 17596,
    18447, 18459, 18596, 19917, 19944,
    23234, 24877, 28387, 28499, 30888,
    32834, 35245
];
const accurateDataTime = 5 * 3600000;
const hourlyDataTime = 7 * 24 * 3600000;
const mongoProjection = {
    projection: {
        _id: 0,
        lat: 0,
        long: 0,
        dataType: 0
    }
};

router.get('/', function (req, res, next) {
    let min = req.query.min;
    let max = req.query.max;
    let sensor = req.query.sensor;

    //check if sensor exists
    if (!sensor || !sensors.includes(parseInt(sensor))) {
        res.send('sensor not available').status(400);
    } else if (!min && !max) {//send full sensor data when no min/max is given
        sendEverything(req, res, next, {sensor_id: parseInt(sensor)})
    } else if (min > max) {
        res.send('min must be lower than max').status(400);
    } else if (max - min < accurateDataTime) {//send hourly data when time range is smaller than accurateDataTime
        console.log('send accurate Data');
        sendAccurateDataTime(req, res, next);
    } else if (max - min < hourlyDataTime) {//send daily data when time range is smaller than hourlyDataTime
        console.log('send average Data (hour)');
        sendAverageDataTime(req, res, next, 'hourlyAVG');
    } else {
        console.log('send average Data (day)');
        sendAverageDataTime(req, res, next, 'dailyAVG');
    }
});

// router.get('/accurate', function (req, res, next) {
//     sendAccurateDataTime(req, res, next);
// });
//
// router.get('/average/hour', function (req, res, next) {
//     sendAverageDataTime(req, res, next, 'hourlyAVG');
// });
//
// router.get('/average/day', function (req, res, next) {
//     sendAverageDataTime(req, res, next, 'dailyAVG');
// });

router.get('/info', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv").collection('dailyAVG');

        MongoClient.connect(url, function (err, db) {
            dbo.distinct('sensor_id').then((sensorData) => {
                dbo.find().sort({timestamp: 1}).limit(1).toArray((err, minData) => {
                    dbo.find().sort({timestamp: -1}).limit(1).toArray((err, maxData) => {
                        res.send({
                            sensors: sensorData,
                            min: minData[0].timestamp,
                            max: maxData[0].timestamp,
                            autoAccuracy: {
                                accurate: hourlyDataTime,
                                hourlyAverage: accurateDataTime,
                                dailyAverage: null,
                                description: "send data when time range between min and max timestamp is smaller than given value (milliseconds). Null value means everything else."
                            }
                        })
                    });
                });
            })
        });
    });
});

function sendAccurateDataTime(req, res, next) {
    let sensor = req.query.sensor;
    let min = req.query.min;
    let max = req.query.max;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

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
                db.close();
            });
    });
}

function sendAverageDataTime(req, res, next, accuracy) {
    let sensor = req.query.sensor;
    let min = req.query.min;
    let max = req.query.max;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

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
                db.close();
            });
    });
}

function sendEverything(req, res, next, query) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        dbo
            .collection('dailyAVG')
            .find(query, mongoProjection)
            .sort({timestamp: 1})
            .toArray(function (err, result) {
                if (err) throw err;
                res.send({resolution: 'averageDataTime', data: result});
                db.close();
            });
    });
}

module.exports = router;
