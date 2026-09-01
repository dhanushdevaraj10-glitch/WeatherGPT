from app.services.ai_service import AIService
from app.api.chat import extract_location_query


def test_rule_based_chat_response_changes_with_question_intent():
    service = AIService()
    weather = {
        "temperature": 18,
        "apparent_temp": 17,
        "precipitation": 0.2,
        "precip_probability": 40,
        "humidity": 70,
        "wind_speed": 12,
        "wind_gusts": 25,
        "weather_description": "partly cloudy",
        "location": {"name": "London"},
    }
    risks = {
        "travel_risk": {"level": "LOW", "explanation": "Road conditions look manageable."},
        "outdoor_risk": {"level": "MODERATE", "explanation": "Take a light jacket."},
    }

    temperature = service.generate_rule_based_response(
        "TEMPERATURE", weather, risks, "How warm is it?"
    )
    wind = service.generate_rule_based_response(
        "WIND", weather, risks, "Is it windy?"
    )

    assert temperature != wind
    assert "18" in temperature
    assert "12" in wind


def test_risk_question_uses_risk_assessment():
    service = AIService()
    assert service.detect_intent("any risk?") == "TRAVEL_RISK"

    response = service.generate_rule_based_response(
        "TRAVEL_RISK",
        {"location": {"name": "London"}, "temperature": 23, "weather_description": "Light drizzle"},
        {"overall_risk": {"level": "LOW", "explanation": "Overall risk is LOW."}},
        "any risk?",
    )

    assert response == "Overall risk in London is low. Overall risk is LOW."


def test_chat_extracts_location_from_question():
    assert extract_location_query("any risk in Coimbatore?") == "Coimbatore"
    assert extract_location_query("will it rain in New York today?") == "New York"
    assert extract_location_query("will it rain today?") is None


def test_forecast_response_uses_forecast_data():
    service = AIService()
    response = service.generate_rule_based_response(
        "FORECAST",
        {
            "temperature": 23,
            "weather_description": "Light drizzle",
            "location": {"name": "Coimbatore"},
            "forecast": {"daily": [{
                "date": "2026-08-28",
                "weather_description": "Clear sky",
                "temp_min": 22,
                "temp_max": 31,
                "precip_probability_max": 10,
            }]},
        },
        {},
        "forecast in coimbatore",
    )

    assert "Coimbatore" in response
    assert "Clear sky" in response
    assert "10%" in response
from app.engines.risk_engine import RiskEngine
from app.engines.reliability_engine import ReliabilityEngine
from app.engines.model_agreement_engine import ModelAgreementEngine
from app.engines.scenario_engine import ScenarioEngine
from app.services.ai_service import AIService

def test_risk_engine_rain_low():
    engine = RiskEngine()
    risk = engine.calculate_rain_risk({"precipitation": 0.5, "precip_probability": 10})
    assert risk["level"] == "NORMAL"

def test_risk_engine_rain_high():
    engine = RiskEngine()
    risk = engine.calculate_rain_risk({"precipitation": 20, "precip_probability": 90})
    assert risk["level"] == "SEVERE"

def test_risk_engine_heat_severe():
    engine = RiskEngine()
    risk = engine.calculate_heat_risk({"apparent_temp": 45})
    assert risk["level"] == "SEVERE"

def test_reliability_engine_fresh_data():
    engine = ReliabilityEngine()
    rel = engine.calculate_reliability(2, 0.9, 12, "HIGH", 1.0, True)
    assert rel["grade"] == "A+"

def test_reliability_engine_stale_data():
    engine = ReliabilityEngine()
    rel = engine.calculate_reliability(120, 0.5, 72, "LOW", 0.5, True)
    assert rel["grade"] in ["D", "C"]

def test_model_agreement_high():
    engine = ModelAgreementEngine()
    agreement = engine.compare_models({
        "gfs": {"temperature": 20, "precipitation": 0},
        "ecmwf": {"temperature": 20.2, "precipitation": 0}
    })
    assert agreement["agreement"] == "HIGH"

def test_model_agreement_low():
    engine = ModelAgreementEngine()
    agreement = engine.compare_models({
        "gfs": {"temperature": 20, "precipitation": 0},
        "ecmwf": {"temperature": 25, "precipitation": 10}
    })
    assert agreement["agreement"] == "LOW"

def test_scenario_engine_rainfall_increase():
    engine = ScenarioEngine()
    scenario = engine.simulate(
        {"precipitation": 5, "precip_probability": 50, "apparent_temp": 20},
        {"rainfall_factor": 3},
        {"name": "Test"}
    )
    assert scenario["scenario"]["precipitation"] == 15

def test_intent_detection():
    ai = AIService()
    assert ai.detect_intent("Is it going to rain tomorrow?") == "RAIN"
    assert ai.detect_intent("How hot is it outside?") == "TEMPERATURE"
    assert ai.detect_intent("Are there any IMD alerts?") == "WEATHER_ALERT"


def test_temperature_follow_up_explains_conditions():
    service = AIService()
    weather = {
        "temperature": 31,
        "apparent_temp": 34,
        "humidity": 68,
        "wind_speed": 8,
        "weather_description": "Sunny",
        "location": {"name": "Coimbatore"},
    }

    response = service.generate_rule_based_response(
        "TEMPERATURE",
        weather,
        {},
        "Why is the temperature so high?",
    )

    assert "Coimbatore" in response
    assert "humidity" in response.lower()
    assert "temperature" in response.lower()
