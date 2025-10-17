require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get current weather by city name or coordinates
app.get('/api/weather/current', async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        error: 'Please provide either a city name or latitude/longitude coordinates'
      });
    }

    const params = {
      appid: WEATHER_API_KEY,
      units: units
    };

    if (city) {
      params.q = city;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: params
    });

    res.json({
      location: {
        name: response.data.name,
        country: response.data.sys.country,
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
        timezone: response.data.timezone
      },
      current: {
        temp: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        temp_min: response.data.main.temp_min,
        temp_max: response.data.main.temp_max,
        pressure: response.data.main.pressure,
        humidity: response.data.main.humidity,
        weather: response.data.weather[0],
        wind: {
          speed: response.data.wind.speed,
          deg: response.data.wind.deg,
          gust: response.data.wind.gust
        },
        clouds: response.data.clouds.all,
        visibility: response.data.visibility,
        dt: response.data.dt,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset
      }
    });
  } catch (error) {
    console.error('Error fetching current weather:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch weather data'
    });
  }
});

// Get weather forecast (5 day / 3 hour)
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric', cnt } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        error: 'Please provide either a city name or latitude/longitude coordinates'
      });
    }

    const params = {
      appid: WEATHER_API_KEY,
      units: units
    };

    if (city) {
      params.q = city;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    if (cnt) {
      params.cnt = Math.min(parseInt(cnt), 40); // Max 40 timestamps (5 days * 8 per day)
    }

    const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
      params: params
    });

    res.json({
      location: {
        name: response.data.city.name,
        country: response.data.city.country,
        lat: response.data.city.coord.lat,
        lon: response.data.city.coord.lon,
        timezone: response.data.city.timezone,
        sunrise: response.data.city.sunrise,
        sunset: response.data.city.sunset
      },
      forecast: response.data.list.map(item => ({
        dt: item.dt,
        dt_txt: item.dt_txt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        weather: item.weather[0],
        wind: {
          speed: item.wind.speed,
          deg: item.wind.deg,
          gust: item.wind.gust
        },
        clouds: item.clouds.all,
        visibility: item.visibility,
        pop: item.pop, // Probability of precipitation
        rain: item.rain,
        snow: item.snow
      }))
    });
  } catch (error) {
    console.error('Error fetching weather forecast:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch forecast data'
    });
  }
});

// Get One Call API (current + forecast + historical in one call)
// Note: Requires separate subscription for One Call API 3.0
app.get('/api/weather/onecall', async (req, res) => {
  try {
    const { lat, lon, units = 'metric', exclude } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Please provide latitude and longitude coordinates'
      });
    }

    const params = {
      lat: lat,
      lon: lon,
      appid: WEATHER_API_KEY,
      units: units
    };

    if (exclude) {
      params.exclude = exclude; // Can exclude: current,minutely,hourly,daily,alerts
    }

    const response = await axios.get(`${WEATHER_API_BASE_URL}/onecall`, {
      params: params
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching One Call data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch One Call data'
    });
  }
});

// Search for cities (Geocoding API)
app.get('/api/weather/search', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        error: 'Please provide a search query with at least 2 characters'
      });
    }

    const response = await axios.get(`${GEO_API_BASE_URL}/direct`, {
      params: {
        q: q,
        limit: Math.min(parseInt(limit), 5),
        appid: WEATHER_API_KEY
      }
    });

    res.json(response.data.map(location => ({
      name: location.name,
      local_names: location.local_names,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state
    })));
  } catch (error) {
    console.error('Error searching cities:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to search cities'
    });
  }
});

// Reverse geocoding (get location name from coordinates)
app.get('/api/weather/reverse', async (req, res) => {
  try {
    const { lat, lon, limit = 1 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Please provide latitude and longitude coordinates'
      });
    }

    const response = await axios.get(`${GEO_API_BASE_URL}/reverse`, {
      params: {
        lat: lat,
        lon: lon,
        limit: Math.min(parseInt(limit), 5),
        appid: WEATHER_API_KEY
      }
    });

    res.json(response.data.map(location => ({
      name: location.name,
      local_names: location.local_names,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state
    })));
  } catch (error) {
    console.error('Error reverse geocoding:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to reverse geocode'
    });
  }
});

// Get air pollution data
app.get('/api/weather/air-pollution', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Please provide latitude and longitude coordinates'
      });
    }

    const response = await axios.get(`${WEATHER_API_BASE_URL}/air_pollution`, {
      params: {
        lat: lat,
        lon: lon,
        appid: WEATHER_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching air pollution:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to fetch air pollution data'
    });
  }
});

// Serve React app for all other routes (must be after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Weather API server running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${WEATHER_API_KEY ? 'Yes' : 'No'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  GET /health - Health check`);
  console.log(`  GET /api/weather/current?city=London - Get current weather`);
  console.log(`  GET /api/weather/forecast?city=London - Get 5-day forecast`);
  console.log(`  GET /api/weather/onecall?lat=51.5074&lon=-0.1278 - Get One Call data`);
  console.log(`  GET /api/weather/search?q=London - Search for cities`);
  console.log(`  GET /api/weather/reverse?lat=51.5074&lon=-0.1278 - Reverse geocode`);
  console.log(`  GET /api/weather/air-pollution?lat=51.5074&lon=-0.1278 - Get air quality`);
});

module.exports = app;
