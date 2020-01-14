var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("gdv");

    const sensors = [
        1164, 2502, 3403, 3585, 3601,
        3677, 5129, 5175, 5898, 9712,
        10695, 10932, 11279, 11642, 12812,
        13455, 13457, 14945, 15291, 17596,
        18447, 18459, 18596, 19917, 19944,
        23234, 24877, 28387, 28499, 30888,
        32834, 35245
    ];

    sensors.forEach((sensor,index) => {
        dbo.collection('s' + sensor).find({P2:{$gte: 10000}}).toArray(function (err, result) {
            if (err) throw err;

            result.forEach((oldSensorData,index2) => {
                dbo.collection('s' + sensor).deleteOne({_id: oldSensorData._id});
            });
        });
    });
});
