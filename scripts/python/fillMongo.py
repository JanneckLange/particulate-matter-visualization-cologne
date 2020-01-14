import os, sys

sensors = [
    1164, 2502, 3403, 3585, 3601,
    3677, 5129, 5175, 5898, 9712,
    10695, 10932, 11279, 11642, 12812,
    13455, 13457, 14945, 15291, 17596,
    18447, 18459, 18596, 19917, 19944,
    23234, 24877, 28387, 28499, 30888,
    32834, 35245
]

string = ""

for sensor in sensors:
    print('add: '+str(sensor))
    string+="C:/Programme/MongoDB/Server/4.2/bin/mongoimport.exe --db gdv --collection s"+str(sensor)+" --file ./converted/sensor_"+str(sensor)+"_refactored_converted.json --jsonArray & "
    
string += "echo finish"
os.system('cmd /k "'+string+'"')
