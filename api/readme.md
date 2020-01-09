## Routes ##
* Get list of all sensors, min day and max day: http://localhost:3000/api/info
* Get Sensor in range: http://localhost:3000/api?sensor=123&min=123&max=321
* Get all average data for one sensor: http://localhost:3000/api?sensor=123
* Get GPS Position for all sensors: http://localhost:3000/api/sensor

## Data ##
When requesting data without forcing a specific type (average) the API will choose the best.
When the time range is smaller than 5 hours, it will send the full data. For a time range smaller than a week you will get a hourly average. Everything else is a daily average.
