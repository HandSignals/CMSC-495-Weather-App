const axios = require('axios');
require('dotenv').config();

const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';
const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

if (!WEATHERAPI_KEY) {
    console.error("⚠️ WEATHERAPI_KEY is missing! Check your .env file.");
    process.exit(1);
}

// Fetch Current Weather
async function getCurrentWeather(location) {
    try {
        const response = await axios.get(`${WEATHERAPI_BASE_URL}/current.json`, {
            params: {
                key: WEATHERAPI_KEY,
                q: location,
            },
        });

        console.log("🔹 Full WeatherAPI Response (Current):", JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.current) {
            throw new Error("Invalid API response structure. Missing 'current' data.");
        }

        return {
            location: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temp_f,
            feelsLike: response.data.current.feelslike_f,
            condition: response.data.current.condition.text,
            windSpeed: response.data.current.wind_mph,
            humidity: response.data.current.humidity,
            precipitation: response.data.current.precip_mm !== undefined ? `${response.data.current.precip_in} ` : "0 in",
            icon: response.data.current.condition.icon,
        };
    } catch (error) {
        console.error('❌ Error fetching current weather:', error.message);
        return { error: 'Unable to fetch current weather. Please try again later.' };
    }
}

// Fetch 10-Day Forecast Weather
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

        // Debugging: Log the full API response
        console.log("WeatherAPI Response (Forecast):", JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.forecast || !Array.isArray(response.data.forecast.forecastday)) {
            console.error("Invalid response structure from WeatherAPI:", response.data);
            throw new Error("Invalid API response structure. Missing 'forecast' data.");
        }

        const forecast = response.data.forecast.forecastday.map(day => ({
            date: day.date,
            maxTemp: day.day.maxtemp_f,
            minTemp: day.day.mintemp_f,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
            hourly: day.hour ? day.hour.map(hour => ({
                time: hour.time,
                temp: hour.temp_f,
                condition: hour.condition.text,
                windSpeed: hour.wind_mph,
                humidity: hour.humidity,
                precipitation: hour.precip_in,
                icon: hour.condition.icon
            })) : []  // Fix potential undefined error
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

// Export the functions
module.exports = { getCurrentWeather, getForecastWeather };


