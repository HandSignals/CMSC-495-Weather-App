const axios = require('axios');
const WEATHERSTACK_API_URL = 'http://api.weatherstack.com';
const ACCESS_KEY = process.env.WEATHERSTACK_API_KEY;

async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/current`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f'
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw new Error('Unable to fetch weather data at this time.');
    }
}

async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/forecast`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f',
                forecast_days: 7,
                hourly: 1
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching forecast data:', error.message);
        throw new Error('Unable to fetch forecast data at this time.');
    }
}

module.exports = { getCurrentWeather, getForecastWeather };
