const express = require('express');
const router = express.Router();
const { fetchCurrentWeather } = require('../controllers/weatherController');


router.get('/current', fetchCurrentWeather);

module.exports = router;
