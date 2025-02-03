require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Debugging logs to confirm API keys are loaded
console.log('Weatherstack API Key:', process.env.WEATHERSTACK_API_KEY ? 'Loaded' : 'Not Found');
console.log('WeatherAPI Key:', process.env.WEATHERAPI_KEY ? 'Loaded' : 'Not Found');
