const express = require('express');
const router = express.Router();
const { fetchCurrentWeather, fetchForecastWeather, fetchHourlyWeather, fetchLocationAutocomplete } = require('../controllers/weatherController');

router.get('/current', fetchCurrentWeather);
router.get('/forecast', fetchForecastWeather);
router.get('/hourly', fetchHourlyWeather);
router.get('/autocomplete', fetchLocationAutocomplete);  // Fixed import issue

module.exports = router;




