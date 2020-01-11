var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

let databaseValues = {
    weatherAir: {
        Luftdruck: '$Luftdruck',
        Lufttemperatur1: '$Lufttemperatur1',
        Lufttemperatur2: '$Lufttemperatur2',
        Luftfeuchte: '$Luftfeuchte',
        Taupunkttemperatur: '$Taupunkttemperatur'
    },
    weatherSolar: {
        Globalstrahlung: '$Globalstrahlung',
        Solarstrahlung: '$Solarstrahlung',
        Direktstrahlung: '$Direktstrahlung',
        Sonnenscheindauer: '$Sonnenscheindauer'
    },
    weatherNiederschlag: {Niederschlagsdauer: '$Niederschlagsdauer', Niederschlag: '$Niederschlag'},
    weatherWind: {Windstaerke: '$Windstaerke', Windrichtung: '$Windrichtung'}
}

MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("gdv");
    // ['weatherAir', 'weatherNiederschlag', 'weatherSolar', 'weatherWind']
    let database = 'weatherWind';
    dbo.collection(database).aggregate([
        {
            $project: {
                date: {
                    $toLong: {
                        $dateFromString: {
                            dateString: "$MESS_DATUM"
                        }
                    }
                },  Windstaerke: '$Windstaerke', Windrichtung: '$Windrichtung'
            }
        }
    ]).toArray(function (err, res) {
        if (err)
            throw err;
        // console.log(res)
        res.forEach((data) => {
            dbo.collection(database + "_Converted").insertOne(data, function (err, res) {
                if (err) throw err;
                console.log('inserted');
            });
        });
        db.close();
    });
});
