from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_location_search():
    response = client.get("/api/location/search?q=London")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_weather_current_missing_params():
    response = client.get("/api/weather/current")
    assert response.status_code == 422

def test_chat_endpoint():
    response = client.post("/api/chat", json={
        "message": "What is the weather?",
        "location": {"name": "London", "latitude": 51.5, "longitude": -0.1}
    })
    assert response.status_code == 200
    assert "response" in response.json()

def test_risk_analyze():
    response = client.post("/api/risk/analyze", json={
        "lat": 51.5,
        "lon": -0.1,
        "location_name": "London"
    })
    assert response.status_code == 200
    assert "overall_risk" in response.json()

def test_scenario_simulate():
    response = client.post("/api/scenario/simulate", json={
        "location": {"name": "London"},
        "baseline": {"precipitation": 5, "precip_probability": 50},
        "modifications": {"rainfall_factor": 2}
    })
    assert response.status_code == 200
    assert "scenario" in response.json()
