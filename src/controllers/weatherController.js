const { getCurrentWeather, getForecastWeather } = require('../services/weatherstackService');

async function fetchCurrentWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        const weatherData = await getCurrentWeather(location);

        const formattedData = {
            location: weatherData.location.name,
            country: weatherData.location.country,
            current: weatherData.current,
        };

        console.log(weatherData);

        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetchCurrentWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

async function fetchForecastWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        const forecastData = await getForecastWeather(location);

        const formattedData = {
            location: forecastData.location.name,
            country: forecastData.location.country,
            forecast: forecastData.forecast,
        };

        console.log(forecastData);

        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetchForecastWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { fetchCurrentWeather, fetchForecastWeather };
