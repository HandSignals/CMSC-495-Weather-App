# SAAND Weather App

## Overview
The **SAAND Weather App** provides real-time weather updates using APIs from multiple sources. Built with **Node.js and Express.js**, this application follows **modular design principles** to ensure efficiency, scalability, and maintainability.

## Features
- Search weather by **city name** or **zip code**.
- Display **temperature, humidity, wind speed, and forecast data**.
- Supports **12-hour and 10-day forecasts**.
- Implements **fallback mechanisms** for API failures.
- Designed with **responsive UI** for cross-device compatibility.

## Project Structure
```
SAAND-Weather-App/
│── .gitignore
│── README.md
│── app.js
│── weatherRoutes.js
│── weatherController.js
│── services/
│   ├── weatherstackService.js
│   ├── weatherapiService.js
│── public/
│   ├── index.html
│   ├── script.js
│── tests/
│   ├── unit_tests.js
│── package.json
│── package-lock.json
│── config/
│   ├── config.js
│── .env
│── docs/
│   ├── test_strategy.md
```

## Installation
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **NPM** (comes with Node.js)

### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/SAAND-Weather-App.git
   cd SAAND-Weather-App
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add API keys and other configuration details:
     ```env
     WEATHER_API_KEY=your_api_key_here
     WEATHERSTACK_API_KEY=your_weatherstack_api_key
     ```
4. **Start the server:**
   ```sh
   npm start
   ```

## Usage
- Access the app at **http://localhost:3000**.
- Enter a city name or ZIP code in the search bar.
- View real-time weather updates and forecasts.

## Testing
This project includes unit tests to ensure the app runs correctly.

### Run Tests
```sh
npm test
```

## API Endpoints
| Method | Endpoint            | Description |
|--------|--------------------|-------------|
| GET    | `/weather/:location` | Fetch weather for a location |
| GET    | `/forecast/:location` | Get 10-day forecast |

## Contributors
- **Anterrio Graphenreed**
- **Daisy Sharma**
- **Scott Estes**
- **Alec Dowell-Quintero**
- **Nick Moore**

## License
This project is licensed under the [MIT License](LICENSE).
