from typing import Dict, Any

class DecisionEngine:
    def get_recommendation(
        self,
        weather: Dict[str, Any],
        risks: Dict[str, Any],
        user_category: str,
        activity: str,
        time_context: str
    ) -> Dict[str, Any]:
        recommendation = "Normal conditions. Proceed with general plans."
        factors = []
        
        overall = risks.get("overall_risk", {}).get("level", "NORMAL")
        
        if activity.lower() == "travel":
            if risks.get("travel_risk", {}).get("level") in ["HIGH", "SEVERE"]:
                recommendation = "Consider delaying travel due to severe weather risks."
            factors = ["Travel Risk", "Rain Risk", "Wind Risk"]
            
        elif activity.lower() == "outdoor":
            if risks.get("outdoor_risk", {}).get("level") in ["HIGH", "SEVERE"]:
                recommendation = "Avoid prolonged outdoor activities."
            factors = ["Outdoor Risk", "Heat Risk", "UV Index"]
            
        elif activity.lower() == "farming":
            if risks.get("rain_risk", {}).get("level") in ["HIGH", "SEVERE"]:
                recommendation = "Heavy rain expected. Protect sensitive crops."
            factors = ["Precipitation", "Temperature"]
            
        return {
            "recommendation": recommendation,
            "confidence": "High",
            "factors": factors,
            "disclaimer": "Follow official authority guidance for severe weather."
        }
