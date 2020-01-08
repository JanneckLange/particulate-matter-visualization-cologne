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
const dataMinDate = 1527811200000;
const dataMaxDate = 1578338286000;
const accurateDataTime = 604800000;//1 week

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
    } else if (max < dataMinDate) {
        res.send('max Date to low').status(400);
    } else if (min > dataMaxDate) {
        res.send('min Date to height').status(400);
    } else if (max - min < accurateDataTime) {
        console.log('send accurate Data');
        sendAccurateDataTime(req, res, next);
    } else {
        console.log('send average Data');
        sendAverageDataTime(req, res, next);
    }
});

router.get('/accurate', function (req, res, next) {
    sendAccurateDataTime(req, res, next);
});

router.get('/average', function (req, res, next) {
    sendAverageDataTime(req, res, next);
});

router.get('/sensors', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        MongoClient.connect(url, function (err, db) {
            dbo.collection('dailyAVG').distinct('sensor').then((data) => {
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
            dbo.distinct('sensor').then((sensorData) => {
                dbo.find().sort({day: 1}).limit(1).toArray((err, minData) => {
                    dbo.find().sort({day: -1}).limit(1).toArray((err, maxData) => {
                        res.send({sensors: sensorData, min: minData[0].day, max: maxData[0].day})
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

function sendAverageDataTime(req, res, next) {
    let sensor = req.query.sensor;
    let min = req.query.min;
    let max = req.query.max;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("gdv");

        let query = {
            day: {
                $gte: parseInt(min),//min Date
                $lt: parseInt(max)//max Date
            },
            sensor: parseInt(sensor)
        };
        dbo.collection('dailyAVG').find(query).toArray(function (err, result) {
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

        dbo.collection('dailyAVG').find().toArray(function (err, result) {
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

        dbo.collection('dailyAVG').find({sensor: parseInt(sensor)}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
}

module.exports = router;
