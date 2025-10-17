import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [city, setCity] = useState('London');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [airPollution, setAirPollution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all weather data for a city
  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentRes = await fetch(`${API_BASE_URL}/api/weather/current?city=${cityName}`);
      if (!currentRes.ok) throw new Error('Failed to fetch current weather');
      const currentData = await currentRes.json();
      setCurrentWeather(currentData);

      // Fetch forecast
      const forecastRes = await fetch(`${API_BASE_URL}/api/weather/forecast?city=${cityName}&cnt=8`);
      if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

      // Fetch air pollution using coordinates from current weather
      const { lat, lon } = currentData.location;
      const airRes = await fetch(`${API_BASE_URL}/api/weather/air-pollution?lat=${lat}&lon=${lon}`);
      if (!airRes.ok) throw new Error('Failed to fetch air pollution');
      const airData = await airRes.json();
      setAirPollution(airData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search for cities
  const handleSearch = async () => {
    if (searchQuery.length < 2) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/weather/search?q=${searchQuery}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const getAQILabel = (aqi) => {
    const labels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    return labels[aqi - 1] || 'Unknown';
  };

  const getAQIColor = (aqi) => {
    const colors = ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97'];
    return colors[aqi - 1] || '#666';
  };

  // Get background gradient based on weather condition
  const getWeatherGradient = () => {
    if (!currentWeather) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    const condition = currentWeather.current.weather.main.toLowerCase();
    const temp = currentWeather.current.temp;

    // Weather-based gradients
    if (condition.includes('clear')) {
      return temp > 25
        ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' // Hot sunny
        : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'; // Cool clear
    } else if (condition.includes('cloud')) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Cloudy
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)'; // Rainy
    } else if (condition.includes('thunder') || condition.includes('storm')) {
      return 'linear-gradient(135deg, #232526 0%, #414345 100%)'; // Stormy
    } else if (condition.includes('snow')) {
      return 'linear-gradient(135deg, #e6dada 0%, #274046 100%)'; // Snowy
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
      return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)'; // Misty
    } else if (condition.includes('smoke') || condition.includes('dust') || condition.includes('sand')) {
      return 'linear-gradient(135deg, #c79081 0%, #dfa579 100%)'; // Dusty
    }

    // Default gradient
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <div className="app" style={{ background: getWeatherGradient(), backgroundAttachment: 'fixed' }}>
      <header className="header">
        <h1>Weather Dashboard</h1>
        <p>Real-time weather data powered by OpenWeatherMap</p>
      </header>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => {
                  setCity(result.name);
                  setSearchResults([]);
                  setSearchQuery('');
                }}
              >
                <strong>{result.name}</strong>
                {result.state && `, ${result.state}`}, {result.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && <div className="loading">Loading weather data...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && currentWeather && (
        <div className="dashboard">
          {/* Current Weather Card */}
          <div className="card current-weather">
            <h2>Current Weather - {currentWeather.location.name}</h2>
            <div className="weather-main">
              <div className="temperature">
                <span className="temp-value">{Math.round(currentWeather.current.temp)}°C</span>
                <div className="weather-icon">
                  <img
                    src={`https://openweathermap.org/img/wn/${currentWeather.current.weather.icon}@2x.png`}
                    alt={currentWeather.current.weather.description}
                  />
                  <p>{currentWeather.current.weather.description}</p>
                </div>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <span className="label">Feels Like</span>
                <span className="value">{Math.round(currentWeather.current.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span className="label">Humidity</span>
                <span className="value">{currentWeather.current.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Speed</span>
                <span className="value">{currentWeather.current.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="label">Pressure</span>
                <span className="value">{currentWeather.current.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="label">Visibility</span>
                <span className="value">{(currentWeather.current.visibility / 1000).toFixed(1)} km</span>
              </div>
              <div className="detail-item">
                <span className="label">Clouds</span>
                <span className="value">{currentWeather.current.clouds}%</span>
              </div>
            </div>
          </div>

          {/* Air Quality Card */}
          {airPollution && (
            <div className="card air-quality">
              <h2>Air Quality</h2>
              <div className="aqi-main">
                <div
                  className="aqi-circle"
                  style={{ borderColor: getAQIColor(airPollution.list[0].main.aqi) }}
                >
                  <span className="aqi-value">{airPollution.list[0].main.aqi}</span>
                  <span className="aqi-label">{getAQILabel(airPollution.list[0].main.aqi)}</span>
                </div>
              </div>
              <div className="aqi-details">
                <div className="detail-item">
                  <span className="label">CO</span>
                  <span className="value">{airPollution.list[0].components.co.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">NO₂</span>
                  <span className="value">{airPollution.list[0].components.no2.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">O₃</span>
                  <span className="value">{airPollution.list[0].components.o3.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">PM2.5</span>
                  <span className="value">{airPollution.list[0].components.pm2_5.toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">PM10</span>
                  <span className="value">{airPollution.list[0].components.pm10.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Card */}
          {forecast && (
            <div className="card forecast">
              <h2>24-Hour Forecast</h2>
              <div className="forecast-list">
                {forecast.forecast.map((item, index) => (
                  <div key={index} className="forecast-item">
                    <div className="forecast-time">
                      {new Date(item.dt * 1000).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true
                      })}
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather.icon}.png`}
                      alt={item.weather.description}
                      className="forecast-icon"
                    />
                    <div className="forecast-temp">{Math.round(item.temp)}°C</div>
                    <div className="forecast-desc">{item.weather.main}</div>
                    <div className="forecast-rain">💧 {Math.round(item.pop * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="card location-info">
            <h2>Location Details</h2>
            <div className="location-details">
              <div className="detail-item">
                <span className="label">City</span>
                <span className="value">{currentWeather.location.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country</span>
                <span className="value">{currentWeather.location.country}</span>
              </div>
              <div className="detail-item">
                <span className="label">Coordinates</span>
                <span className="value">
                  {currentWeather.location.lat.toFixed(4)}, {currentWeather.location.lon.toFixed(4)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Timezone</span>
                <span className="value">UTC{currentWeather.location.timezone >= 0 ? '+' : ''}{currentWeather.location.timezone / 3600}</span>
              </div>
              <div className="detail-item">
                <span className="label">Sunrise</span>
                <span className="value">
                  {new Date(currentWeather.current.sunrise * 1000).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Sunset</span>
                <span className="value">
                  {new Date(currentWeather.current.sunset * 1000).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Weather data provided by OpenWeatherMap API</p>
      </footer>
    </div>
  );
}

export default App;
