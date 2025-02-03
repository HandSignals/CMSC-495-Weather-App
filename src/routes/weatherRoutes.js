const express = require('express');
const router = express.Router();
const { fetchCurrentWeather, fetchForecastWeather, fetchHourlyWeather } = require('../controllers/weatherController');

router.get('/current', fetchCurrentWeather);
router.get('/forecast', fetchForecastWeather);
router.get('/hourly', fetchHourlyWeather); // New route for hourly data

module.exports = router;

