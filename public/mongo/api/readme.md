## Routes ##
* Get list of all sensors: http://localhost:3000/api/sensors
* Get list of all sensors, min day and max day: http://localhost:3000/api/info
* Get Sensor in range: http://localhost:3000/api?sensor=123&min=123&max=321
* Get Sensor in range (force accurate data): http://localhost:3000/api/accurate?sensor=123&min=123&max=321
* Get Sensor in range (force average hourly data): http://localhost:3000/api/average/day?sensor=123&min=123&max=321
* Get Sensor in range (force average daily data): http://localhost:3000/api/average/hour?sensor=123&min=123&max=321
* Get all average data: http://localhost:3000/api
* Get all average data for one sensor: http://localhost:3000/api?sensor=123
