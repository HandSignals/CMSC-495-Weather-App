require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log('Weatherstack API Key:', process.env.WEATHERSTACK_API_KEY);
console.log('WeatherAPI Key:', process.env.WEATHERAPI_KEY);
