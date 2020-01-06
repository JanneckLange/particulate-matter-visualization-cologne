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
        dbo.collection(sensor.toString()).aggregate([
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {$toDate: {$toLong: {$multiply: ["$timestamp", 1000]}}}
                        }
                    },
                    P1: '$P1',
                    P2: '$P2',
                    id: '$sensor_id'
                }
            },
            {
                $group: {
                    _id: '$date',
                    avgP1: {$avg: '$P1'},
                    avgP2: {$avg: '$P2'},
                    sensor_id: {$last: '$id'}
                }
            },
            {$sort: {_id: 1}}
        ]).toArray(function (err, res) {
            if (err)
                throw err;
            // console.log(res)
            res.forEach((data) => {
                let average = {sensor: data.sensor_id, day: data._id, averageP1:data.avgP1,averageP2:data.avgP2};
                dbo.collection("avg").insertOne(average, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
            });
        });
    });
});


// let average = { sensor: sensor, day: "Highway 37", average: };
// dbo.collection("customers").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
// });
