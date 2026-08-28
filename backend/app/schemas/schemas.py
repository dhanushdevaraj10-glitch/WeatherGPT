from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class LocationResult(BaseModel):
    name: str
    country: Optional[str] = None
    region: Optional[str] = None
    latitude: float
    longitude: float
    timezone: Optional[str] = None
    elevation: Optional[float] = None
    distance_km: Optional[float] = None

class CurrentWeather(BaseModel):
    temperature: float
    apparent_temp: float
    precipitation: float
    precip_probability: Optional[float] = None
    humidity: float
    wind_speed: float
    wind_direction: float
    wind_gusts: float
    cloud_cover: float
    visibility: float
    uv_index: float
    weather_code: int
    weather_description: str
    pressure: float
    data_status: str
    updated_at: datetime
    provider: str
    location: LocationResult

class HourlyForecast(BaseModel):
    time: datetime
    temperature: float
    apparent_temp: float
    precipitation: float
    precip_probability: float
    humidity: float
    wind_speed: float
    wind_gusts: float
    cloud_cover: float
    weather_code: int
    weather_description: str

class DailyForecast(BaseModel):
    date: datetime
    temp_max: float
    temp_min: float
    temp_mean: float
    precipitation_sum: float
    precip_probability_max: float
    wind_speed_max: float
    wind_gusts_max: float
    weather_code: int
    weather_description: str
    sunrise: Optional[datetime] = None
    sunset: Optional[datetime] = None
    uv_index_max: Optional[float] = None

class WeatherForecastResponse(BaseModel):
    location: LocationResult
    hourly: List[HourlyForecast]
    daily: List[DailyForecast]
    provider: str
    generated_at: datetime

class RiskFactor(BaseModel):
    name: str
    value: float
    unit: str
    contribution: str

class RiskDetail(BaseModel):
    level: str
    score: int
    factors: List[RiskFactor]
    explanation: str

class RiskAssessmentResponse(BaseModel):
    location: LocationResult
    rain_risk: RiskDetail
    heat_risk: RiskDetail
    wind_risk: RiskDetail
    storm_risk: RiskDetail
    travel_risk: RiskDetail
    outdoor_risk: RiskDetail
    overall_risk: RiskDetail
    assessed_at: datetime

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    mode: str = "live"

class ChatResponse(BaseModel):
    response: str
    intent: str
    weather_data: Optional[Dict[str, Any]] = None
    risk_data: Optional[Dict[str, Any]] = None
    session_id: str
    sources: List[Dict[str, Any]]

class ScenarioRequest(BaseModel):
    location: Dict[str, Any]
    baseline: Dict[str, Any]
    modifications: Dict[str, Any]

class ScenarioResponse(BaseModel):
    baseline: Dict[str, Any]
    scenario: Dict[str, Any]
    risk_change: Dict[str, Any]
    impacts: List[str]
    recommendation: str
    disclaimer: str

class AlertCreate(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    alert_type: str
    threshold: float
    time_period: str

class AlertResponse(BaseModel):
    id: int
    location_name: str
    alert_type: str
    threshold: float
    time_period: str
    is_active: bool
    created_at: datetime

class VerificationMetrics(BaseModel):
    location: Dict[str, Any]
    temp_mae: Optional[float] = None
    temp_bias: Optional[float] = None
    precip_error: Optional[float] = None
    forecast_skill: Optional[float] = None
    records_count: int
    message: str

class ForecastVerificationRequest(BaseModel):
    forecast_data: Dict[str, Any]
    model_name: str = "best_match"

class CompareRequest(BaseModel):
    locations: List[Dict[str, Any]]

class CompareResponse(BaseModel):
    locations: List[Dict[str, Any]]

class OfficialWarning(BaseModel):
    source: str
    warning_type: str
    severity: str
    issued_at: datetime
    valid_from: datetime
    valid_to: datetime
    description: str
    is_connected: bool

class ReliabilityDetail(BaseModel):
    score: int
    grade: str
    checks: List[Dict[str, Any]]
    label: str = "WeatherGPT Data Reliability"

class ModelAgreementDetail(BaseModel):
    agreement: str
    models_compared: int
    temperature_spread: float
    precip_spread: float
    models: List[Dict[str, Any]]
    note: str
