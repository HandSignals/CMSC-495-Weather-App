const axios = require('axios');
const { getCurrentWeather: getCurrentWeatherBackup, getForecastWeather: getForecastWeatherBackup } = require('./weatherapiService');
const WEATHERSTACK_API_URL = 'https://api.weatherstack.com';
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
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getCurrentWeatherBackup(location);
    }
}

async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/forecast`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f',
                forecast_days: 10,
                hourly: 1,
                interval: 1
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }
        return response.data;
    } catch (error) {
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getForecastWeatherBackup(location);
    }
}

module.exports = { getCurrentWeather, getForecastWeather };
