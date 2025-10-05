"""
Quick script to test your deployed Render backend
Replace YOUR_RENDER_URL with your actual deployed URL
"""
import requests
import json

# Replace this with your actual Render URL after deployment
RENDER_URL = "https://your-app-name.onrender.com"

def test_health():
    """Test the health endpoint"""
    print("Testing /health endpoint...")
    try:
        response = requests.get(f"{RENDER_URL}/health", timeout=10)
        print(f"✓ Status: {response.status_code}")
        print(f"✓ Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def test_prediction():
    """Test the prediction endpoint"""
    print("\nTesting /predict endpoint...")
    try:
        data = {
            "latitude": 28.7041,  # New Delhi
            "longitude": 77.1025,
            "date": "2025-10-15"
        }
        response = requests.post(
            f"{RENDER_URL}/predict",
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"✓ Status: {response.status_code}")
        result = response.json()
        print(f"✓ Rain Probability: {result.get('rain_probability')}%")
        print(f"✓ Temperature: {result.get('temperature')}°C")
        print(f"✓ AQI: {result.get('aqi')} ({result.get('aqi_category')})")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Testing Render Deployment")
    print("=" * 50)
    print(f"API URL: {RENDER_URL}")
    print("=" * 50)
    
    # Test health
    health_ok = test_health()
    
    # Test prediction
    if health_ok:
        test_prediction()
    
    print("\n" + "=" * 50)
    print("Testing complete!")
    print("=" * 50)
