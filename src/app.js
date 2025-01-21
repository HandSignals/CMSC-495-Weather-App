require('dotenv').config();   // Loads environment variables from .env
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Basic route for health check
app.get('/', (req, res) => {
    res.send('Weather App API is running...');
});


const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
