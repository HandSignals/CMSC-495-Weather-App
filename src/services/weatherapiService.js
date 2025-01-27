const axios = require('axios');
const WEATHERAPI_BASE_URL = 'http://api.weatherapi.com/v1';
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${WEATHERAPI_BASE_URL}/current.json`, {
            params: {
                key: WEATHERAPI_KEY,
                q: location,
            },
        });

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            current: response.data.location.current,
        };
    } catch (error) {
        console.error('Error fetching current weather from WeatherAPI:', error.message);
        throw new Error('Unable to fetch current weather from WeatherAPI.');
    }
}

async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
            params: {
                key: WEATHERAPI_KEY,
                q: location,
                days: 5,
            },
        });

        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_f,
            minTemp: day.day.mintemp_f,
            condition: day.day.condition.text,
        }));

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            forecast,
        };
    } catch (error) {
        console.error('Error fetching forecast from WeatherAPI:', error.message);
        throw new Error('Unable to fetch forecast from WeatherAPI.');
    }
}

module.exports = { getCurrentWeather, getForecastWeather };
