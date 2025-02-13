const { getCurrentWeather, getForecastWeather } = require('../services/weatherapiService'); // Ensure correct service file


// Fetch and return current weather data
async function fetchCurrentWeather(req, res) {
    try {
        const location = req.query.location;

        if (!location) {
            return res.status(400).json({ error: "Location query parameter is required." });
        }

        const weatherData = await getCurrentWeather(location);

        if (!weatherData || weatherData.error) {
            return res.status(404).json({ error: "Invalid location, no forecast data." });
        }

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

        res.json(formattedData);
    } catch (error) {
        console.error("Error in fetchCurrentWeather:", error.message);
        return res.status(500).json({ error: "Unable to fetch weather data." });
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
            location: forecastData.location || "Unknown",  // Fix: Correct location access
            country: forecastData.country || "Unknown",   // Fix: Correct country access
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

        res.json(formattedForecast);
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

        const forecastData = await getForecastWeather(location);

        if (!forecastData || !forecastData.forecast || forecastData.forecast.length === 0) {
            return res.status(500).json({ error: "No forecast data available." });
        }

        // ✅ Debugging log
        console.log("Extracted Location Data:", forecastData.location, forecastData.country);

        res.json({
            location: forecastData.location || "Unknown",
            country: forecastData.country || "Unknown",
            hourly: forecastData.forecast[0]?.hourly || []
        });
    } catch (error) {
        console.error('Error in fetchHourlyWeather:', error.message);
        return res.status(500).json({ error: error.message });
    }
}

// Export the functions
module.exports = { fetchCurrentWeather, fetchForecastWeather, fetchHourlyWeather };



