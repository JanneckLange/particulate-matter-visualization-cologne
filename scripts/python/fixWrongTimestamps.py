import json

jsonFile = {}
sensors = [
    1164, 2502, 3403, 3585, 3601,
    3677, 5129, 5175, 5898, 9712,
    10695, 10932, 11279, 11642, 12812,
    13455, 13457, 14945, 15291, 17596,
    18447, 18459, 18596, 19917, 19944,
    23234, 24877, 28387, 28499, 30888,
    32834, 35245
]

for sensor in sensors:
    print(sensor)
    path = "./converted/sensor_"+str(sensor)+"_refactored_converted.json"
   
    with open(path) as json_file:
        jsonFile = json.load(json_file)
        i=0
        for p in jsonFile:
            newDate = int(jsonFile[i]['timestamp'])-int(3600000)
            jsonFile[i]['timestamp']=newDate
            i=i+1

    with open(path, 'w') as outfile:
        json.dump(jsonFile, outfile)