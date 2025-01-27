const express = require('express');
const router = express.Router();
const { fetchCurrentWeather, fetchForecastWeather } = require('../controllers/weatherController');

router.get('/api/weather/current', fetchCurrentWeather);
router.get('/api/weather/forecast', fetchForecastWeather);

module.exports = router;
