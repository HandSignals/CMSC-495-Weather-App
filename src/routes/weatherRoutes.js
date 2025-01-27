const express = require('express');
const router = express.Router();
const { fetchCurrentWeather, fetchForecastWeather } = require('../controllers/weatherController');

router.get('/current', fetchCurrentWeather);
router.get('/forecast', fetchForecastWeather);

module.exports = router;
