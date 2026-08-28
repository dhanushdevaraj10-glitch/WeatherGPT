from typing import Dict, Any, List

class RiskLevel:
    NORMAL = "NORMAL"
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"

class RiskEngine:
    def _get_level_for_score(self, score: int) -> str:
        if score < 20: return RiskLevel.NORMAL
        if score < 40: return RiskLevel.LOW
        if score < 60: return RiskLevel.MODERATE
        if score < 80: return RiskLevel.HIGH
        return RiskLevel.SEVERE

    def calculate_rain_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        precip = weather.get("precipitation", 0)
        prob = weather.get("precip_probability", 0) or 0
        
        score = 0
        if prob > 80: score += 40
        elif prob > 60: score += 30
        elif prob > 40: score += 20
        elif prob > 20: score += 10
        
        if precip > 10: score += 50
        elif precip > 5: score += 30
        elif precip > 1: score += 10
        
        score = min(100, score)
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [
                {"name": "Precipitation", "value": precip, "unit": "mm", "contribution": "High" if precip > 5 else "Low"},
                {"name": "Probability", "value": prob, "unit": "%", "contribution": "High" if prob > 50 else "Low"}
            ],
            "explanation": f"Rain risk is {self._get_level_for_score(score)} based on precipitation levels."
        }

    def calculate_heat_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        temp = weather.get("apparent_temp", weather.get("temperature", 0))
        score = 0
        if temp >= 42: score = 100
        elif temp >= 37: score = 80
        elif temp >= 32: score = 60
        elif temp >= 27: score = 40
        elif temp < 0: score = 60 # Cold risk
        elif temp < -10: score = 90
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [
                {"name": "Apparent Temperature", "value": temp, "unit": "°C", "contribution": "Primary"}
            ],
            "explanation": f"Heat/Cold risk is {self._get_level_for_score(score)}."
        }

    def calculate_wind_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        wind = weather.get("wind_speed", 0)
        gusts = weather.get("wind_gusts", wind)
        score = 0
        max_wind = max(wind, gusts)
        
        if max_wind >= 70: score = 100
        elif max_wind >= 50: score = 80
        elif max_wind >= 35: score = 60
        elif max_wind >= 20: score = 40
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [
                {"name": "Wind Speed", "value": wind, "unit": "km/h", "contribution": "High" if wind > 35 else "Low"},
                {"name": "Wind Gusts", "value": gusts, "unit": "km/h", "contribution": "High" if gusts > 50 else "Low"}
            ],
            "explanation": f"Wind risk is {self._get_level_for_score(score)}."
        }

    def calculate_storm_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        code = weather.get("weather_code", 0)
        score = 0
        if code in [95, 96, 99]: score = 90
        elif code in [80, 81, 82]: score = 50
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [
                {"name": "Weather Code", "value": code, "unit": "", "contribution": "Primary"}
            ],
            "explanation": f"Storm risk is {self._get_level_for_score(score)}."
        }

    def calculate_travel_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        rain = self.calculate_rain_risk(weather)["score"]
        wind = self.calculate_wind_risk(weather)["score"]
        storm = self.calculate_storm_risk(weather)["score"]
        vis = weather.get("visibility", 10000)
        
        score = max(rain, wind, storm)
        if vis < 1000: score = max(score, 80)
        elif vis < 3000: score = max(score, 50)
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [],
            "explanation": f"Travel risk is {self._get_level_for_score(score)}."
        }

    def calculate_outdoor_risk(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        rain = self.calculate_rain_risk(weather)["score"]
        heat = self.calculate_heat_risk(weather)["score"]
        wind = self.calculate_wind_risk(weather)["score"]
        uv = weather.get("uv_index", 0)
        
        score = max(rain, heat, wind)
        if uv > 8: score = max(score, 80)
        elif uv > 5: score = max(score, 50)
        
        return {
            "level": self._get_level_for_score(score),
            "score": score,
            "factors": [],
            "explanation": f"Outdoor risk is {self._get_level_for_score(score)}."
        }

    def calculate_all_risks(self, weather: Dict[str, Any]) -> Dict[str, Any]:
        rain = self.calculate_rain_risk(weather)
        heat = self.calculate_heat_risk(weather)
        wind = self.calculate_wind_risk(weather)
        storm = self.calculate_storm_risk(weather)
        travel = self.calculate_travel_risk(weather)
        outdoor = self.calculate_outdoor_risk(weather)
        
        max_score = max(
            rain["score"], heat["score"], wind["score"], 
            storm["score"], travel["score"], outdoor["score"]
        )
        
        overall = {
            "level": self._get_level_for_score(max_score),
            "score": max_score,
            "factors": [],
            "explanation": f"Overall risk is {self._get_level_for_score(max_score)}."
        }
        
        return {
            "rain_risk": rain,
            "heat_risk": heat,
            "wind_risk": wind,
            "storm_risk": storm,
            "travel_risk": travel,
            "outdoor_risk": outdoor,
            "overall_risk": overall
        }
