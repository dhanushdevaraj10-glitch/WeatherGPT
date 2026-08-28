from typing import Dict, Any

class ReliabilityEngine:
    def calculate_reliability(
        self,
        data_age_minutes: float,
        location_accuracy: float,
        forecast_horizon_hours: int,
        model_agreement: str,
        data_completeness: float,
        provider_available: bool
    ) -> Dict[str, Any]:
        if not provider_available:
            return {
                "score": 0,
                "grade": "F",
                "checks": [{"name": "Provider", "status": "Failed"}],
                "label": "WeatherGPT Data Reliability"
            }
            
        score = 0
        
        # Freshness (30 pts)
        if data_age_minutes <= 5: score += 30
        elif data_age_minutes <= 30: score += 20
        elif data_age_minutes <= 60: score += 10
        
        # Location (20 pts)
        score += int(20 * location_accuracy)
        
        # Horizon (20 pts)
        if forecast_horizon_hours <= 24: score += 20
        elif forecast_horizon_hours <= 48: score += 16
        elif forecast_horizon_hours <= 72: score += 12
        elif forecast_horizon_hours <= 120: score += 8
        else: score += 4
        
        # Agreement (15 pts)
        if model_agreement == "HIGH": score += 15
        elif model_agreement == "MODERATE": score += 10
        elif model_agreement == "LOW": score += 5
        elif model_agreement == "UNKNOWN": score += 8
        
        # Completeness (15 pts)
        score += int(15 * data_completeness)
        
        grade = "D"
        if score >= 90: grade = "A+"
        elif score >= 80: grade = "A"
        elif score >= 70: grade = "B"
        elif score >= 60: grade = "C"
        
        return {
            "score": score,
            "grade": grade,
            "checks": [
                {"name": "Freshness", "points": data_age_minutes},
                {"name": "Location", "points": location_accuracy},
                {"name": "Horizon", "points": forecast_horizon_hours}
            ],
            "label": "WeatherGPT Data Reliability"
        }
