const axios = require('axios');
const { getCurrentWeather: getCurrentWeatherBackup, getForecastWeather: getForecastWeatherBackup } = require('./weatherapiService');
const WEATHERSTACK_API_URL = 'https://api.weatherstack.com';
const ACCESS_KEY = process.env.WEATHERSTACK_API_KEY;

// Ensure API key is set; exit process if missing
if (!ACCESS_KEY) {
    console.error("WEATHERSTACK_API_KEY is missing! Check your .env file.");
    process.exit(1);
}

// Fetch current weather data
async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/current`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f'
            }
        });

        // Check for API errors
        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        // Format and return relevant weather data
        return {
            location: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temperature ?? "N/A",
            feelslike: response.data.current.feelslike ?? "N/A",
            condition: response.data.current.weather_descriptions?.[0] || "Unknown",
            windSpeed: response.data.current.wind_speed?? "N/A",
            humidity: response.data.current.humidity ?? "N/A",
            precipitation: response.data.current.precip !== undefined ? `${response.data.current.precip}` : "0 in",
            icon: response.data.current.weather_icons?.[0] || ""
        };

    } catch (error) {
        // If WeatherStack fails, switch to WeatherAPI
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getCurrentWeatherBackup(location);
    }
}

// Fetch 7-Day forecast weather data
async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERSTACK_API_URL}/forecast`, {
            params: {
                access_key: ACCESS_KEY,
                query: location,
                units: 'f',
                timezone: 'local',
                forecast_days: 7,
                timestamp: new Date().getTime()
            }
        });

        // Check for API errors
        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        // Format forecast data
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
                precipitation: hour.precip !== undefined ? `${hour.precip}` : "0 in",
                icon: hour.weather_icons[0] || ""
            })) : []
        }));

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            forecast
        };

    } catch (error) {
        // If WeatherStack fails, switch to WeatherAPI
        console.error('Weatherstack failed, switching to WeatherAPI:', error.message);
        return await getForecastWeatherBackup(location);
    }
}

// Export the weather functions for use elsewhere
module.exports = { getCurrentWeather, getForecastWeather };
