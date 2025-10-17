# Weather Dashboard API

A full-stack compatible API backend for a weather dashboard application using OpenWeatherMap API.

## Features

- Current weather data by city name or coordinates
- 5-day weather forecast (3-hour intervals)
- One Call API support (current + hourly + daily forecasts)
- City search with geocoding
- Reverse geocoding (coordinates to location)
- Air pollution/quality data
- Support for metric, imperial, and standard units
- CORS enabled for frontend integration
- Error handling and validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (use `.env.example` as template):
```bash
cp .env.example .env
```

3. Add your OpenWeatherMap API key to the `.env` file:
```
WEATHER_API_KEY=your_openweathermap_api_key_here
PORT=3001
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the server status.

### Current Weather
```
GET /api/weather/current?city=London
GET /api/weather/current?city=London&units=imperial
GET /api/weather/current?lat=51.5074&lon=-0.1278
```
Returns current weather data for the specified location.

**Query Parameters:**
- `city` - City name (e.g., "London", "New York")
- `lat` & `lon` - Latitude and longitude coordinates
- `units` - Units of measurement: `metric` (default, Celsius), `imperial` (Fahrenheit), `standard` (Kelvin)

### Weather Forecast
```
GET /api/weather/forecast?city=London
GET /api/weather/forecast?lat=51.5074&lon=-0.1278&cnt=10
```
Returns 5-day weather forecast with 3-hour intervals.

**Query Parameters:**
- `city` - City name
- `lat` & `lon` - Latitude and longitude coordinates
- `units` - Units of measurement: `metric`, `imperial`, `standard`
- `cnt` - Number of timestamps to return (max 40)

### One Call API
```
GET /api/weather/onecall?lat=51.5074&lon=-0.1278
GET /api/weather/onecall?lat=51.5074&lon=-0.1278&exclude=minutely,hourly
```
Returns current weather, minute forecast, hourly forecast, daily forecast, and alerts.

**Query Parameters:**
- `lat` & `lon` - Latitude and longitude coordinates (required)
- `units` - Units of measurement
- `exclude` - Exclude parts: `current,minutely,hourly,daily,alerts`

### Search Cities
```
GET /api/weather/search?q=London
GET /api/weather/search?q=New&limit=5
```
Search for cities by name using geocoding.

**Query Parameters:**
- `q` - Search query (minimum 2 characters)
- `limit` - Number of results (max 5, default: 5)

### Reverse Geocoding
```
GET /api/weather/reverse?lat=51.5074&lon=-0.1278
```
Get location name from coordinates.

**Query Parameters:**
- `lat` & `lon` - Latitude and longitude coordinates
- `limit` - Number of results (max 5, default: 1)

### Air Pollution
```
GET /api/weather/air-pollution?lat=51.5074&lon=-0.1278
```
Get current air pollution data.

**Query Parameters:**
- `lat` & `lon` - Latitude and longitude coordinates

## Example Response

### Current Weather
```json
{
  "location": {
    "name": "London",
    "country": "GB",
    "lat": 51.5074,
    "lon": -0.1278,
    "timezone": 0
  },
  "current": {
    "temp": 8.0,
    "feels_like": 5.9,
    "temp_min": 6.5,
    "temp_max": 9.2,
    "pressure": 1013,
    "humidity": 81,
    "weather": {
      "id": 803,
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04d"
    },
    "wind": {
      "speed": 3.6,
      "deg": 250,
      "gust": 8.2
    },
    "clouds": 75,
    "visibility": 10000,
    "dt": 1705315800,
    "sunrise": 1705305123,
    "sunset": 1705335456
  }
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found (endpoint doesn't exist)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## CORS

CORS is enabled by default, allowing requests from any origin. For production, consider restricting origins in `server.js`:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## Tech Stack

- Node.js
- Express.js
- Axios
- dotenv
- CORS

## OpenWeatherMap Documentation

For more information about OpenWeatherMap API endpoints and features, visit:
- Current Weather: https://openweathermap.org/current
- 5 Day Forecast: https://openweathermap.org/forecast5
- One Call API: https://openweathermap.org/api/one-call-3
- Geocoding: https://openweathermap.org/api/geocoding-api
- Air Pollution: https://openweathermap.org/api/air-pollution
