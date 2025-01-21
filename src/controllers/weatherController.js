const { getCurrentWeather } = require('../services/weatherstackService');

async function fetchCurrentWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        const weatherData = await getCurrentWeather(location);
        const {current} = weatherData;
        const {
            wind_speed,
            humidity,
            temperature,
            weather_descriptions,
            feelslike
        } = current;
        const formattedData = {
            location: weatherData.location.name,
            country: weatherData.location.country,
            localtime: weatherData.location.localtime,
            temperature: temperature,
            feelslike: feelslike,
            weather_descriptions: weather_descriptions,
            humidity: humidity,
            wind_speed:wind_speed,
        };

        console.log(weatherData);
        console.log(weatherData.location.localtime);
        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetchCurrentWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    fetchCurrentWeather
};
