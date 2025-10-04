import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

function App() {
  const [position, setPosition] = useState(null);
  const [date, setDate] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!position) {
      setError('Please select a location on the map');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        latitude: position.lat,
        longitude: position.lng,
        date: date,
      });

      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get prediction. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getRainIcon = (probability) => {
    if (probability < 30) return '☀️';
    if (probability < 60) return '⛅';
    return '🌧️';
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌍 Weather Prediction App</h1>
        <p>Select a location and date to predict weather conditions</p>
      </header>

      <div className="main-container">
        <div className="left-panel">
          <div className="map-container">
            <h2>Select Location</h2>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '400px', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
            {position && (
              <div className="coordinates">
                <p>
                  📍 Selected: {position.lat.toFixed(4)}°, {position.lng.toFixed(4)}°
                </p>
              </div>
            )}
          </div>

          <div className="date-selector">
            <h2>Select Date</h2>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="date-input"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || !position || !date}
            className="predict-button"
          >
            {loading ? '🔄 Predicting...' : '🔮 Predict Weather'}
          </button>

          {error && <div className="error-message">⚠️ {error}</div>}
        </div>

        <div className="right-panel">
          <h2>Prediction Results</h2>
          {prediction ? (
            <div className="results">
              <div className="result-card rain-card">
                <div className="result-icon">{getRainIcon(prediction.rain_probability)}</div>
                <div className="result-content">
                  <h3>Rain Probability</h3>
                  <p className="result-value">{prediction.rain_probability}%</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill rain-fill"
                      style={{ width: `${prediction.rain_probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="result-card temp-card">
                <div className="result-icon">🌡️</div>
                <div className="result-content">
                  <h3>Temperature</h3>
                  <p className="result-value">{prediction.temperature}°C</p>
                  <p className="result-subtext">
                    {prediction.temperature > 30
                      ? 'Hot'
                      : prediction.temperature > 20
                      ? 'Warm'
                      : prediction.temperature > 10
                      ? 'Mild'
                      : 'Cold'}
                  </p>
                </div>
              </div>

              <div className="result-card aqi-card">
                <div className="result-icon">💨</div>
                <div className="result-content">
                  <h3>Air Quality Index</h3>
                  <p className="result-value" style={{ color: getAQIColor(prediction.aqi) }}>
                    {prediction.aqi}
                  </p>
                  <p className="result-subtext">{prediction.aqi_category}</p>
                  <div className="aqi-scale">
                    <div className="aqi-marker" style={{ left: `${(prediction.aqi / 500) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="prediction-meta">
                <p>📅 Date: {prediction.date}</p>
                <p>
                  📍 Location: {prediction.location.latitude.toFixed(2)}°,{' '}
                  {prediction.location.longitude.toFixed(2)}°
                </p>
              </div>
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p>Select a location and date, then click "Predict Weather" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

