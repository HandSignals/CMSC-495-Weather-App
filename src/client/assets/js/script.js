document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");
    const locationInput = document.getElementById("location");

    // Set default background on home page
    document.body.style.backgroundImage = "url('assets/images/backgrounds/partly-sunny-bg.jpg')";

    // Check which page is loaded and set appropriate fixed background
    let page = window.location.pathname.split("/").pop();
    if (page === "hourly.html") {
        document.body.style.backgroundImage = "url('assets/images/decorations/trees.png')";
    } else if (page === "weekly.html") {
        document.body.style.backgroundImage = "url('assets/images/decorations/mountains.png')";
    } else if (page === "contact.html") {
        document.body.style.backgroundImage = "url('assets/images/backgrounds/contact-bg.jpg')";
    } else if (page === "about.html") {
        document.body.style.backgroundImage = "url('assets/images/backgrounds/about-bg.jpg')";
    }

    searchBtn.addEventListener("click", function () {
        const location = locationInput.value.trim();
        if (!location) {
            alert("Please enter a city name!");
            return;
        }

        localStorage.setItem("lastSearchedLocation", location);

        fetchWeather(location);
        fetchHourlyForecast(location, 6);  // Show next 6 hours on homepage
        fetchWeeklyForecast(location, 3);  // Show next 3 days on homepage
    });

    function getStoredLocation() {
        return localStorage.getItem("lastSearchedLocation") || "";
    }

    async function fetchWeather(location) {
        try {
            const response = await fetch(`/api/weather/current?location=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (response.ok) {
                updateWeatherDisplay(data);
                setBackgroundBasedOnWeather(data.condition);
            } else {
                alert(data.error || "Failed to fetch weather data.");
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Error fetching weather data.");
        }
    }

    async function fetchHourlyForecast(location, hoursToShow) {
        try {
            const response = await fetch(`/api/weather/hourly?location=${encodeURIComponent(location)}`);
            const data = await response.json();

            console.log("✅ Hourly Forecast Response:", data);

            if (response.ok) {
                updateHourlyForecast(data.hourly, hoursToShow);
            } else {
                alert(data.error || "Failed to fetch hourly forecast.");
            }
        } catch (error) {
            console.error("Error fetching hourly forecast:", error);
            alert("Error fetching hourly forecast.");
        }
    }

    async function fetchWeeklyForecast(location, daysToShow) {
        try {
            console.log(`Fetching weekly forecast for location: ${location}`);
            const response = await fetch(`/api/weather/forecast?location=${encodeURIComponent(location)}`);
            const data = await response.json();

            if (!response.ok) {
                console.error("API Error:", data);
                alert(`Error fetching weekly forecast: ${data.error || "Unknown error"}`);
                return;
            }

            // Check if data has the required forecast field
            if (!data || !data.forecast || !Array.isArray(data.forecast) || data.forecast.length === 0) {
                console.error("Invalid forecast data:", data);
                alert("Error: No forecast data available.");
                return;
            }

            console.log("Weekly forecast data received:", data);

            updateWeeklyForecast(data.forecast, daysToShow);
        } catch (error) {
            console.error("Network/Parsing Error:", error);
            alert("Network error while fetching weekly forecast.");
        }
    }

    function updateWeatherDisplay(data) {
        document.getElementById("location").innerText = `${data.location}, ${data.country}`;
        document.getElementById("temperature").innerText = `${data.temperature}°F`;
        document.getElementById("feels-like").innerText = `Feels Like: ${data.feelsLike}°F`;
        document.getElementById("condition").innerText = data.condition;
        document.getElementById("wind").innerText = `Wind: ${data.wind}`;
        document.getElementById("humidity").innerText = `Humidity: ${data.humidity}`;
        document.getElementById("precipitation").innerText = `Precipitation: ${data.precipitation}`;
        document.getElementById("weather-icon").src = data.icon;
    }

    function updateHourlyForecast(hourlyData, hoursToShow) {
        const hourlyContainer = document.querySelector(".hourly-container");
        hourlyContainer.innerHTML = "";

        const now = new Date();
        const currentHour = now.getHours();

        // Ensure we only show the next 12 hours
        const nextHours = hourlyData.slice(0, hoursToShow);

        nextHours.forEach(hour => {
            const hourElement = document.createElement("div");
            hourElement.classList.add("hourly-item");
            hourElement.innerHTML = `
            <p class="hourly-time">${new Date(hour.time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
            <img src="https:${hour.icon}" alt="${hour.condition}">
            <p class="hourly-temp">${hour.temp}°F</p>
            <p class="hourly-condition">${hour.condition}</p>
        `;
            hourlyContainer.appendChild(hourElement);
        });

        if (nextHours.length > 0) {
            setBackgroundBasedOnWeather(nextHours[0].condition);
        }
    }

    function updateWeeklyForecast(forecastData, daysToShow) {
        const weeklyContainer = document.querySelector(".weekly-container");
        if (!weeklyContainer) return;
        weeklyContainer.innerHTML = "";

        const nextDays = forecastData.slice(0, daysToShow);

        nextDays.forEach(day => {
            const dayElement = document.createElement("div");
            dayElement.classList.add("weekly-item");
            dayElement.innerHTML = `
                <p class="weekly-date">${day.date}</p>
                <img src="https:${day.icon}" alt="${day.condition}">
                <p class="weekly-temp">H: ${day.maxTemp}°F / L: ${day.minTemp}°F</p>
                <p class="weekly-condition">${day.condition}</p>
                <p class="weekly-details">Feels Like: ${day.feelsLike || "N/A"}°F</p>
                <p class="weekly-details">Wind: ${day.wind || "N/A"}</p>
                <p class="weekly-details">Humidity: ${day.humidity || "N/A"}</p>
                <p class="weekly-details">Precipitation: ${day.precipitation || "N/A"}</p>
            `;
            weeklyContainer.appendChild(dayElement);
        });

        if (nextDays.length > 0) {
            setBackgroundBasedOnWeather(nextDays[0].condition);
        }
    }

    function setBackgroundBasedOnWeather(condition) {
        let backgroundImage = "partly-cloudy-bg.jpg"; // Default

        if (condition.toLowerCase().includes("sunny")) backgroundImage = "sunny-bg.jpg";
        else if (condition.toLowerCase().includes("cloudy")) backgroundImage = "cloudy-bg.jpg";
        else if (condition.toLowerCase().includes("rain")) backgroundImage = "rainy-bg.jpg";
        else if (condition.toLowerCase().includes("snow")) backgroundImage = "snowy-bg.jpg";
        else if (condition.toLowerCase().includes("partly sunny")) backgroundImage = "partly-sunny-bg.jpg";
        else if (condition.toLowerCase().includes("partly cloudy")) backgroundImage = "partly-cloudy-bg.jpg";
        else if (condition.toLowerCase().includes("wind")) backgroundImage = "windy-bg.jpg";
        else if (condition.toLowerCase().includes("night")) backgroundImage = "night-bg.jpg";

        document.body.style.backgroundImage = `url('assets/images/backgrounds/${backgroundImage}')`;
    }

    document.getElementById("view-12-hour").addEventListener("click", function () {
        const location = getStoredLocation();
        if (!location) {
            alert("Please search for a location first!");
            return;
        }
        window.location.href = `/hourly.html?location=${encodeURIComponent(location)}`;
    });

    document.getElementById("view-10-day").addEventListener("click", function () {
        const location = getStoredLocation();
        if (!location) {
            alert("Please search for a location first!");
            return;
        }
        window.location.href = `/weekly.html?location=${encodeURIComponent(location)}`;
    });

    const storedLocation = getStoredLocation();
    if (storedLocation) {
        fetchWeather(storedLocation);
        fetchHourlyForecast(storedLocation, 6);
        fetchWeeklyForecast(storedLocation, 3);
    }
});
