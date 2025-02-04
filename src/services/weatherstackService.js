const axios = require('axios');
const { getCurrentWeather: getCurrentWeatherBackup, getForecastWeather: getForecastWeatherBackup } = require('./weatherapiService');
const WEATHERSTACK_API_URL = 'https://api.weatherstack.com';
const ACCESS_KEY = process.env.WEATHERSTACK_API_KEY;

if (!ACCESS_KEY) {
    console.error("WEATHERSTACK_API_KEY is missing! Check your .env file.");
    process.exit(1);
}

// Fetch current weather
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

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temperature,
            feelslike: response.data.current.feelslike,
            condition: response.data.current.weather_descriptions[0] || "Unknown",
            windSpeed: response.data.current.wind_speed,
            humidity: response.data.current.humidity,
            precipitation: response.data.current.precip !== undefined ? `${response.data.current.precip} in` : "0 in",
            icon: response.data.current.weather_icons[0] || ""
        };

    } catch (error) {
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getCurrentWeatherBackup(location);
    }
}

// Fetch 10-Day Forecast Weather
async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/forecast`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f',
                forecast_days: 7,
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        const forecast = Object.values(response.data.forecast).map(day => ({
            date: day.date,
            maxTemp: day.maxTemp,
            minTemp: day.minTemp,
            condition: day.weather_descriptions[0] || "Unknown",
            icon: day.weather_icons[0] || "",
            feelslike: day.feelslike || "Unknown",
            wind: day.wind_speed ? `${day.wind_speed} mph` : "N/A",
            humidity: day.humidity ? `${day.humidity}%` : "N/A",
            precipitation: day.precip !== undefined ? `${day.precip} in` : "N/A",
            hourly: day.hourly ? day.hourly.map(hour => ({
                time: hour.time,
                temp: hour.temperature,
                condition: hour.weather_descriptions[0] || "Unknown",
                windSpeed: hour.wind_speed,
                humidity: hour.humidity,
                precipitation: hour.precip !== undefined ? `${hour.precip} in` : "0 in",
                icon: hour.weather_icons[0] || ""
            })) : []
        }));

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            forecast
        };

    } catch (error) {
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getForecastWeatherBackup(location);
    }
}

module.exports = { getCurrentWeather, getForecastWeather };
