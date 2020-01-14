var fs = require("fs");
console.log("*Load File* \n");

var content = fs.readFileSync("collections/alle_refactored_converted.json");
var jsonContent = JSON.parse(content);

console.log("*START* \n");

let latestSensor;
let fileName;
let isFirst=true;

jsonContent.forEach((data, index) => {
    if (latestSensor !== data.sensor_id) {
        console.log(data.sensor_id +'('+index+')');
        if (latestSensor) {
            fs.appendFileSync(fileName, "\n]");
        }
        fileName = "collections/" + data.sensor_id + ".json";
        latestSensor = data.sensor_id;

        fs.appendFileSync(fileName, "[\n");
        isFirst=true;
    }

    // console.log("Save: " + JSON.stringify(data))

    fs.appendFileSync(fileName, (isFirst?"\n":",\n")+JSON.stringify(data));
    isFirst=false;
});


console.log("\n *EXIT* \n");
