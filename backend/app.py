"""
Flask API for weather prediction.
Provides endpoint to predict rain probability, temperature, and AQI based on location and date.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load models and scaler
print("Loading models...")
rain_model = joblib.load('rain_model.pkl')
temperature_model = joblib.load('temperature_model.pkl')
aqi_model = joblib.load('aqi_model.pkl')
scaler = joblib.load('scaler.pkl')
print("Models loaded successfully!")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "Weather prediction API is running"})

@app.route('/predict', methods=['POST'])
def predict_weather():
    """
    Predict weather based on location and date.
    
    Expected JSON body:
    {
        "latitude": float,
        "longitude": float,
        "date": "YYYY-MM-DD"
    }
    
    Returns:
    {
        "rain_probability": float (0-100%),
        "temperature": float (Celsius),
        "aqi": int,
        "aqi_category": string
    }
    """
    try:
        data = request.get_json()
        
        # Extract parameters
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        date_str = data.get('date')
        
        # Parse date
        date = datetime.strptime(date_str, '%Y-%m-%d')
        day_of_year = date.timetuple().tm_yday
        month = date.month
        
        # Generate synthetic current weather conditions based on location and season
        # In a real app, you'd fetch actual current weather data
        seasonal_factor = np.sin(2 * np.pi * (day_of_year - 80) / 365)
        latitude_factor = np.cos(np.radians(abs(latitude))) * 30
        current_temp = 15 + latitude_factor + seasonal_factor * 15 + np.random.normal(0, 2)
        
        humidity = 40 + 30 * np.cos(np.radians(abs(latitude))) + np.random.normal(0, 5)
        humidity = np.clip(humidity, 20, 100)
        
        pressure = 1013 + np.random.normal(0, 10)
        wind_speed = np.abs(np.random.normal(10, 3))
        
        # Prepare features
        features = np.array([[
            latitude,
            longitude,
            day_of_year,
            month,
            current_temp,
            humidity,
            pressure,
            wind_speed
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make predictions
        rain_prob = float(rain_model.predict(features_scaled)[0])
        rain_prob = np.clip(rain_prob, 0, 1) * 100  # Convert to percentage
        
        temperature = float(temperature_model.predict(features_scaled)[0])
        
        aqi = float(aqi_model.predict(features_scaled)[0])
        aqi = int(np.clip(aqi, 0, 500))
        
        # Categorize AQI
        if aqi <= 50:
            aqi_category = "Good"
        elif aqi <= 100:
            aqi_category = "Moderate"
        elif aqi <= 150:
            aqi_category = "Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            aqi_category = "Unhealthy"
        elif aqi <= 300:
            aqi_category = "Very Unhealthy"
        else:
            aqi_category = "Hazardous"
        
        response = {
            "rain_probability": round(rain_prob, 1),
            "temperature": round(temperature, 1),
            "aqi": aqi,
            "aqi_category": aqi_category,
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "date": date_str
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

