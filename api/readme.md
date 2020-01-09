## Routes ##
* Get list of all sensors, min day and max day: '/api/info'
* Get Sensor in range: '/api?sensor=[sensor_id]&min=[timestamp]&max=[timestamp]'
* Get all average data for one sensor: '/api?sensor=[sensor_id]'
* Get GPS Position for all sensors: '/api/sensor'
* Get events with sensors in range: '/api/events'

## Data ##
When requesting data without forcing a specific type (average) the API will choose the best.
When the time range is smaller than 5 hours, it will send the full data. For a time range smaller than a week you will get a hourly average. Everything else is a daily average.
