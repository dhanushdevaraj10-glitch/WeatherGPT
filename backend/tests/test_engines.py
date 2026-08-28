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
