from typing import Dict, Any
from .risk_engine import RiskEngine

class ScenarioEngine:
    def __init__(self):
        self.risk_engine = RiskEngine()

    def simulate(self, baseline: Dict[str, Any], modifications: Dict[str, Any], location: Dict[str, Any]) -> Dict[str, Any]:
        scenario = dict(baseline)
        
        # Apply modifications
        if "temperature_delta" in modifications:
            scenario["temperature"] = baseline.get("temperature", 0) + modifications["temperature_delta"]
            scenario["apparent_temp"] = baseline.get("apparent_temp", 0) + modifications["temperature_delta"]
            
        if "rainfall_factor" in modifications:
            scenario["precipitation"] = baseline.get("precipitation", 0) * modifications["rainfall_factor"]
            
        if "wind_factor" in modifications:
            scenario["wind_speed"] = baseline.get("wind_speed", 0) * modifications["wind_factor"]
            scenario["wind_gusts"] = baseline.get("wind_gusts", 0) * modifications["wind_factor"]

        # Run risks
        baseline_risks = self.risk_engine.calculate_all_risks(baseline)
        scenario_risks = self.risk_engine.calculate_all_risks(scenario)
        
        impacts = []
        if scenario_risks["overall_risk"]["score"] > baseline_risks["overall_risk"]["score"]:
            impacts.append("Overall risk increased.")
        elif scenario_risks["overall_risk"]["score"] < baseline_risks["overall_risk"]["score"]:
            impacts.append("Overall risk decreased.")
            
        return {
            "baseline": baseline,
            "scenario": scenario,
            "risk_change": {
                "before": baseline_risks["overall_risk"]["level"],
                "after": scenario_risks["overall_risk"]["level"]
            },
            "impacts": impacts if impacts else ["No significant changes in risk."],
            "recommendation": "Adjust plans based on the simulated scenario.",
            "disclaimer": "SIMULATION \u2014 NOT A GUARANTEED PREDICTION"
        }
