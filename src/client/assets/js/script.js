document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const locationInput = document.getElementById("location");

    searchBtn.addEventListener("click", function () {
        const location = locationInput.value.trim();
        if (!location) {
            alert("Please enter a city name!");
            return;
        }

        fetchWeather(location);
    });

    async function fetchWeather(location) {
        try {
            const response = await fetch(`http://localhost:3000/api/weather/current?location=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (response.ok) {
                updateWeatherDisplay(data);
            } else {
                alert(data.error || "Failed to fetch weather data.");
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Error fetching weather data.");
        }
    }

    function updateWeatherDisplay(data) {
        document.getElementById("current-location").textContent = data.location || "Unknown";
        document.getElementById("temperature").textContent = `${data.current.temperature}°F`;
        document.getElementById("description").textContent = data.current.weather_descriptions[0];
        document.getElementById("feels-like").textContent = `Feels Like: ${data.current.feelslike}°F`;
        document.getElementById("wind").textContent = `Wind: ${data.current.wind_speed} mp/h`;
        document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity}%`;
        document.getElementById("precip").textContent = `Precipitation: ${data.current.precip} in```;
    }
});
