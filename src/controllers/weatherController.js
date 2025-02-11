const { getCurrentWeather, getForecastWeather } = require('../services/weatherstackService'); // Ensure correct service file


// Fetch and return current weather data
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

        // Format current weather data
        const formattedData = {
            location: weatherData.location || "Unknown",
            country: weatherData.country || "Unknown",
            temperature: weatherData.temperature ?? "N/A",
            feelsLike: weatherData.feelsLike ?? "N/A",
            condition: weatherData.condition || "Unknown",
            icon: weatherData.icon ? `https:${weatherData.icon}` : "",
            wind: weatherData.windSpeed ? `${weatherData.windSpeed} mph` : "N/A",
            humidity: weatherData.humidity ? `${weatherData.humidity}%` : "N/A",
            precipitation: weatherData.precipitation ? `${weatherData.precipitation} in` : "N/A",
            localtime: weatherData.localtime ? `${weatherData.localtime}` : "N/A",
        };

        console.log("Formatted Current Weather Response:", formattedData);

        res.json(formattedData);
    } catch (error) {
        console.error('Error in fetchCurrentWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

// Fetch 7-Day Forecast Weather
async function fetchForecastWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: 'Location query parameter is required.' });
        }

        console.log(`Fetching forecast for: ${location}`);

        const forecastData = await getForecastWeather(location);

        // Format forecast weather data
        const formattedForecast = {
            location: forecastData.location || "Unknown",
            country: forecastData.country || "Unknown",
            forecast: forecastData.forecast.map(day => ({
                day: day.date,
                maxTemp: day.maxTemp ?? "N/A",
                minTemp: day.minTemp ?? "N/A",
                condition: day.condition || "Unknown",
                icon: day.icon || "",
                feelsLike: day.feelsLike ?? "N/A",
                wind: day.wind ?? "N/A",
                humidity: day.humidity ?? "N/A",
                precipitation: day.precipitation ?? "N/A"
            }))
        }

        if (formattedForecast.location === "Unknown" || formattedForecast.country === "Unknown") {
            console.error("Location data missing in API response:", forecastData);
        }

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

// Fetch Hourly Forecast Weather data
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
