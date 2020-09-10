const request = require('request');

const forecast = (lat, lon, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=9cbb79c716c1ea0aa48cfce6809d4575&query=${lat},${lon}`;
   
    

    request({
        url,
        json: true
    }, (error, { body }) => {

        if (error) {
            callback('Unable to connect to weather services.');
        } else if (body.error) {
            callback('Unable to find location. Try again');
        } else {
             const address = body.location.name;
             const current = body.current.temperature;
             const feelslike = body.current.feelslike;
             const precip = body.current.precip;

            callback(undefined, `The current temperature in ${address} is ${current} degrees but feels like ${feelslike} degrees with ${precip}% chances of rain.`
            );
        }
    });
}


module.exports = forecast;