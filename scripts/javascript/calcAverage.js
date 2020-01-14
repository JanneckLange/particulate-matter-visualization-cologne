var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("gdv");

    //1. get all sensorId´s
    //2. get all days for sensor
    //3. calc average for each day
    //4. save average to database

    const sensors = [
        1164, 2502, 3403, 3585, 3601,
        3677, 5129, 5175, 5898, 9712,
        10695, 10932, 11279, 11642, 12812,
        13455, 13457, 14945, 15291, 17596,
        18447, 18459, 18596, 19917, 19944,
        23234, 24877, 28387, 28499, 30888,
        32834, 35245
    ];


    sensors.forEach((sensor) => {
        dbo.collection("s" + sensor.toString()).aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            // format: "%Y-%m-%dT%H:00:00",
                            format: "%Y-%m-%d",
                            date: {$toDate: {$toLong: "$timestamp"}}
                        }
                    },
                    P2: '$P2',
                    sensor_id: '$sensor_id',
                    timestamp: "$timestamp",
                    lat: '$lat',
                    lon: '$lon'
                }
            },
            {
                $group: {
                    _id: '$date',
                    timestamp: {$first: '$timestamp'},
                    avgP2: {$avg: '$P2'},
                    sensor_id: {$last: '$sensor_id'},
                    lat: {$last: '$lat'},
                    lon: {$last: '$lon'}
                }
            },
            {$sort: {_id: 1}}
        ]).toArray(function (err, res) {
            if (err)
                throw err;
            // console.log(res)
            res.forEach((data) => {

                let average = {
                    sensor_id: data.sensor_id,
                    timestamp: new Date(data._id).getTime(),
                    P2: data.avgP2,
                    lat: data.lat,
                    long: data.lon,
                    // dataType: 'hourlyAVG'
                    dataType: 'dailyAVG'
                };
                dbo.collection("dailyAVG").insertOne(average, function (err, res) {
                    if (err) throw err;
                    console.log(data.sensor_id + ": " + data._id);
                });
            });
        });
    });
});
