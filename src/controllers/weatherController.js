const { getCurrentWeather, getForecastWeather } = require('../services/weatherapiService'); // Ensure correct service file

async function fetchCurrentWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        // Fetch data from the weather API service
        const weatherData = await getCurrentWeather(location);

        // Handle missing data without breaking the API
        if (!weatherData || weatherData.error) {
            return res.status(500).json({
                error: weatherData?.error || "Weather data unavailable.",
                apiResponse: weatherData
            });
        }

        // Format the response, ensuring no errors if `current` is missing
        const formattedData = {
            location: weatherData.location || "Unknown",
            country: weatherData.country || "Unknown",
            temperature: weatherData.temperature ?? "N/A",
            feelsLike: weatherData.feelsLike ?? "N/A",
            condition: weatherData.condition || "Unknown",
            icon: weatherData.icon || "",
            wind: weatherData.windSpeed ? `${weatherData.windSpeed} mph` : "N/A",
            humidity: weatherData.humidity ? `${weatherData.humidity}%` : "N/A",
            precipitation: weatherData.precipitation ? `${weatherData.precipitation} in` : "N/A"
        };

        console.log("Formatted Current Weather Response:", formattedData);

        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetchCurrentWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

// Fetch 10-Day Forecast Weather
async function fetchForecastWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        console.log(`Fetching forecast for: ${location}`);

        const forecastData = await getForecastWeather(location);

        // Log the full API response to debug
        console.log("Raw API Response:", forecastData);

        // Check if API response contains expected forecast data
        if (!forecastData || !forecastData.forecast || !Array.isArray(forecastData.forecast)) {
            console.error("Invalid forecast data:", forecastData);
            return res.status(500).json({ error: "Invalid forecast data received from WeatherAPI" });
        }

        res.json({
            location: forecastData.location.name,
            country: forecastData.location.country,
            forecast: forecastData.forecast
        });
    } catch (error) {
        console.error('Error in fetchForecastWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

// Fetch Hourly Forecast Weather
async function fetchHourlyWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        // Fetch 5-day forecast data, including hourly data
        const forecastData = await getForecastWeather(location);

        // Extract hourly data from today
        const todayHourlyData = forecastData.forecast[0].hourly;

        // Get current hour
        const now = new Date();
        const currentHour = now.getHours();

        // Slice the next 12 hours from today
        let twelveHourForecast = todayHourlyData.slice(currentHour, currentHour + 12);

        // If today does not have 12 hours left, get remaining hours from tomorrow
        if (twelveHourForecast.length < 12 && forecastData.forecast.length > 1) {
            const tomorrowHourlyData = forecastData.forecast[1].hourly; // Get next day
            const hoursNeeded = 12 - twelveHourForecast.length;
            twelveHourForecast = twelveHourForecast.concat(tomorrowHourlyData.slice(0, hoursNeeded));
        }

        res.json({
            location: forecastData.location.name,
            country: forecastData.location.country,
            hourly: twelveHourForecast
        });
    } catch (error) {
        console.error('Error in fetchHourlyWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

// Export the functions
module.exports = { fetchCurrentWeather, fetchForecastWeather, fetchHourlyWeather };
