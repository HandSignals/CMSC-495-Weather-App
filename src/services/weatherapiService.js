const axios = require('axios');
require('dotenv').config();

const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

const epochTimeNow = Date.now();
console.log(epochTimeNow);

// Ensure API key is set; exit process if missing
if (!WEATHERAPI_KEY) {
    console.error("⚠️ WEATHERAPI_KEY is missing! Check your .env file.");
    process.exit(1);
}

// Fetch current weather data
async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${WEATHERAPI_BASE_URL}/current.json`, {
            params: {
                key: WEATHERAPI_KEY,
                q: location,
                timestamp: new Date().getTime()
            },
        });

        console.log("🌍 API Current Weather Response:", response.data);

        // Validate response structure
        if (!response.data || !response.data.current) {
            throw new Error("Invalid API response structure. Missing 'current' data.");
        }

        // return formatted weather data
        return {
            location: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temp_f,
            feelsLike: response.data.current.feelslike_f,
            condition: response.data.current.condition.text,
            windSpeed: response.data.current.wind_mph,
            humidity: response.data.current.humidity,
            precipitation: response.data.current.precip_in !== undefined ? `${response.data.current.precip_in} ` : "0 in",
            icon: response.data.current.condition.icon,

        };

    } catch (error) {
        console.error('❌ Error fetching current weather:', error.message);
        return { error: 'Unable to fetch current weather. Please try again later.' };
    }
}

// Fetch 10-Day forecast weather data
async function getForecastWeather(location) {
    try {
        const response = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
            params: {
                key: WEATHERAPI_KEY,
                q: location,
                days: 10, // Fetching a 10-day forecast
                aqi: "no",
                alerts: "no"
            },
        });

        console.log("🌍 API Forecast Weather Response:", response.data);

        // Validate response structure
        if (!response.data || !response.data.forecast || !Array.isArray(response.data.forecast.forecastday)) {
            console.error("Invalid response structure from WeatherAPI:", response.data);
            throw new Error("Invalid API response structure. Missing 'forecast' data.");
        }

        // Process forecast data into a structured format
        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_f,
            minTemp: day.day.mintemp_f,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
            feelsLike: day.day.avgtemp_f || "N/A",
            wind: day.day.maxwind_mph ? `${day.day.maxwind_mph} mph` : "N/A",
            humidity: day.day.avghumidity ? `${day.day.avghumidity}%` : "N/A",
            precipitation: day.day.totalprecip_in ? `${day.day.totalprecip_in} in` : "N/A",
            hourly: day.hour ? day.hour.map(hour => ({
                time: hour.time,
                temp: hour.temp_f,
                condition: hour.condition.text,
                windSpeed: hour.wind_mph,
                humidity: hour.humidity,
                precipitation: hour.precip_in,
                icon: hour.condition.icon
            })) : []  // Ensure hourly is an array
        }));

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            forecast,
        };
    } catch (error) {
        console.error('Error fetching forecast from WeatherAPI:', error.message);
        return { error: "Unable to fetch forecast from WeatherAPI." };
    }
}

// Export weather functions for use elsewhere
module.exports = { getCurrentWeather, getForecastWeather };
