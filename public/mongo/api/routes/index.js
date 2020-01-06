const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const sensors = [
    1164,  2502,  3403,  3585,  3601,
    3677,  5129,  5175,  5898,  9712,
    10695, 10932, 11279, 11642, 12812,
    13455, 13457, 14945, 15291, 17596,
    18447, 18459, 18596, 19917, 19944,
    23234, 24877, 28387, 28499, 30888,
    32834, 35245
];

/* GET home page. */
router.get('/', function (req, res, next) {
    let sensor = req.query.sensor;
    let min = req.query.min;
    let max = req.query.max;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("gdv");

        let query = {
            timestamp: {
                $gte: 1523145600,//min Date
                $lt: 1525823940//max Date
            }
        };

        dbo.collection("2502").find(query).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            db.close();
        });
    });

    res.send('index');
});

module.exports = router;
