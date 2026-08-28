from typing import Dict, Any

class ModelAgreementEngine:
    def compare_models(self, models_data: Dict[str, Any]) -> Dict[str, Any]:
        if not models_data or len(models_data) <= 1:
            return {
                "agreement": "NOT_AVAILABLE",
                "models_compared": len(models_data),
                "temperature_spread": 0.0,
                "precip_spread": 0.0,
                "models": [{"name": k, "data": v} for k, v in models_data.items()],
                "note": "Not enough models to compare."
            }
            
        temps = [m.get("temperature", 0) for m in models_data.values()]
        precips = [m.get("precipitation", 0) for m in models_data.values()]
        
        temp_spread = max(temps) - min(temps)
        precip_spread = max(precips) - min(precips)
        
        temp_agreement = "HIGH"
        if temp_spread > 1.5: temp_agreement = "LOW"
        elif temp_spread > 0.5: temp_agreement = "MODERATE"
        
        precip_agreement = "HIGH"
        if precip_spread > 2.0: precip_agreement = "LOW"
        elif precip_spread > 0.5: precip_agreement = "MODERATE"
        
        # Overall agreement is the worst of the two
        agreements = {"LOW": 1, "MODERATE": 2, "HIGH": 3}
        overall = temp_agreement if agreements[temp_agreement] < agreements[precip_agreement] else precip_agreement
        
        return {
            "agreement": overall,
            "models_compared": len(models_data),
            "temperature_spread": round(temp_spread, 2),
            "precip_spread": round(precip_spread, 2),
            "models": [{"name": k, "data": v} for k, v in models_data.items()],
            "note": "Comparison successful."
        }
