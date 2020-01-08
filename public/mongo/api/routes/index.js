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
const accurateDataTime = 7 * 24 * 3600000;//1 week
const hourlyDataTime = 5 * 3600000;//5h

router.get('/', function (req, res, next) {
    let min = req.query.min;
    let max = req.query.max;
    let sensor = req.query.sensor;

    //check if sensor exists
    if (!min && !max && !sensor) {
        sendEverything(req, res, next);
    } else if (!sensors.includes(parseInt(sensor))) {
        res.send('sensor not available').status(400);
    } else if (!min && !max) {
        sendEverythingForOne(req, res, next)
    } else if (min > max) {
        res.send('min must be lower than max').status(400);
    } else if (max - min < accurateDataTime) {
        console.log('send accurate Data');
        sendAccurateDataTime(req, res, next);
    } else if (max - min < hourlyDataTime) {
        console.log('send average Data (hour)');
        sendAverageDataTime(req, res, next, 'hourlyAVG');
    } else {
        console.log('send average Data (day)');
        sendAverageDataTime(req, res, next, 'dailyAVG');
    }
});

router.get('/accurate', function (req, res, next) {
    sendAccurateDataTime(req, res, next);
});

router.get('/average/hour', function (req, res, next) {
    sendAverageDataTime(req, res, next, 'hourlyAVG');
});

router.get('/average/day', function (req, res, next) {
    sendAverageDataTime(req, res, next, 'dailyAVG');
});

router.get('/sensors', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        MongoClient.connect(url, function (err, db) {
            dbo.collection('dailyAVG').distinct('sensor_id').then((data) => {
                res.send(data)
            })
        });
    });
});

router.get('/info', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv").collection('dailyAVG');

        MongoClient.connect(url, function (err, db) {
            dbo.distinct('sensor_id').then((sensorData) => {
                dbo.find().sort({timestamp: 1}).limit(1).toArray((err, minData) => {
                    dbo.find().sort({timestamp: -1}).limit(1).toArray((err, maxData) => {
                        res.send({sensors: sensorData, min: minData[0].timestamp, max: maxData[0].timestamp})
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
        dbo.collection("s" + sensor).find(query).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
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
        dbo.collection(accuracy).find(query).sort({timestamp: 1}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
}

function sendEverything(req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        dbo.collection('dailyAVG').find().sort({timestamp: 1}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
}

function sendEverythingForOne(req, res, next) {
    let sensor = req.query.sensor;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        dbo.collection('dailyAVG').find({sensor_id: parseInt(sensor)}).sort({timestamp: 1}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
}

module.exports = router;
