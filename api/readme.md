## Routes ##
* Get list of all sensors, min day and max day: '/api/info'
* Get Sensor in range: '/api?sensor=[sensor_id]&min=[timestamp]&max=[timestamp]'
* Get all average data for one sensor: '/api?sensor=[sensor_id]'
* Get GPS Position for all sensors: '/api/sensor'
* Get events with sensors in range: '/api/events'

## Data ##
### Particulate matter ###
When requesting data without forcing a specific type (average) the API will choose the best.
When the time range is smaller than 5 hours, it will send the full data. For a time range smaller than a week you will get a hourly average. Everything else is a daily average.

### Weather ###
#### Wind ####
Windstaerke in m/s  
windrichtung in ° (0 = Norden, 180 = Sueden)

#### Luft ####
Luftdruck [hPa]  
Lufttemperatur in 2m Hoehe [°C]  
Lufttemperatur in 5cm Hoehe [°C]  
Relative Luftfeuchte in 2m Hoehe [%]  
Taupunkttemperatur in 2m Hoehe [°C]

#### Niederschlag ####
Niederschlagsdauer der letzten 10 min [Minuten]  
Niederschlag der letzten 10 minuten [mm bzw. l/m³]

#### Solar ####
Globalstrahlung / Gesamtstrahlung [J/cm²] (Ergibt sich aus der Summe der diffusen und direkten Sonneneinstrahlung)  
Diffuse Solarstrahlung (Strahlung, die gestreut wird, Dazu zählt auch zur Erde zurückreflektierte Strahlung) [J/cm²]  
Direktstrahlung (Strahlung die direkt ohne Streuung auf die Erdoberfläche trifft) [J/cm²]  
Sonnenscheindauer [h]
