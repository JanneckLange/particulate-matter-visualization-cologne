var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("gdv");


    var query = {
        timestamp: {
            $gte: 1523145600,//min Date
            $lt: 1525823940//max Date
        }
    };

    dbo.collection("2502").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});
