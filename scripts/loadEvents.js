const request = require('request');

request('https://geoportal.stadt-koeln.de/arcgis/rest/services/WebVerkehr_DataOSM_66/MapServer/0/query?f=geojson&where=( DATUM_VON <= date \'2020-2-1 00:00:00\' AND DATUM_BIS >= date \'2018-1-1 00:00:00\' ) AND DATUM_VON IS NOT NULL AND DATUM_BIS IS NOT NULL &outFields=*', {json: true}, (err, res, body) => {
    if (err) {
        return console.log(err);
    }
    let features = body.features;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("gdv");

        features.forEach(data => {
            if (
                data.properties.TYP === 12 ||
                data.properties.TYP === 13 ||
                data.properties.TYP === 14
            ) {
                let event = {
                    name: data.properties.NAME,
                    date_start: data.properties.DATUM_VON,
                    date_end: data.properties.DATUM_BIS,
                    type: data.properties.TYP,
                    description: data.properties.BESCHREIBUNG,
                    lat: data.geometry.coordinates[0],
                    long: data.geometry.coordinates[1],

                };

                dbo.collection("events").insertOne(event, function (err, res) {
                    if (err) throw err;
                    console.log(event);
                });
            }
        });
    });


});

//4,5,6,8,10,15
const Types = {
    baustelle: 3,
    sperrung: 2,
    achtung: 1,
    kinder: 4,
    stau: 5,
    frost: 6,
    hochwasser: 7,
    LanxessArena: 8,
    Station: 9,
    Messe: 10,
    Fussball: 11,
    Lauf: 12,
    Karneval: 13,
    Festivall: 14,
    Weihnachten: 15,
    Schwertransport: 16,
    Hochtransport: 17,
};
