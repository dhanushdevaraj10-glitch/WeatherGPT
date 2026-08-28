from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Location(Base):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String)
    region = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    timezone = Column(String)
    elevation = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    temperature = Column(Float)
    apparent_temp = Column(Float)
    precipitation = Column(Float)
    precip_probability = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(Float)
    wind_gusts = Column(Float)
    cloud_cover = Column(Float)
    visibility = Column(Float)
    uv_index = Column(Float)
    weather_code = Column(Integer)
    pressure = Column(Float)
    data_status = Column(String)
    provider = Column(String)
    observed_at = Column(DateTime)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ForecastRecord(Base):
    __tablename__ = "forecast_records"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    forecast_date = Column(DateTime)
    horizon_hours = Column(Integer)
    temperature = Column(Float)
    precipitation = Column(Float)
    precip_probability = Column(Float)
    wind_speed = Column(Float)
    humidity = Column(Float)
    weather_code = Column(Integer)
    model_name = Column(String)
    provider = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    rain_risk = Column(String)
    heat_risk = Column(String)
    wind_risk = Column(String)
    storm_risk = Column(String)
    travel_risk = Column(String)
    outdoor_risk = Column(String)
    overall_risk = Column(String)
    reliability_score = Column(Integer)
    model_agreement = Column(String)
    assessment_data = Column(Text)
    assessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ConversationSession(Base):
    __tablename__ = "conversation_sessions"
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    user_location = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("conversation_sessions.session_id"))
    role = Column(String)
    content = Column(Text)
    intent = Column(String)
    weather_data = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AlertPreference(Base):
    __tablename__ = "alert_preferences"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    alert_type = Column(String)
    threshold = Column(Float)
    time_period = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ForecastVerification(Base):
    __tablename__ = "forecast_verification"
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    forecast_date = Column(DateTime)
    verification_date = Column(DateTime)
    predicted_temp = Column(Float)
    observed_temp = Column(Float)
    predicted_precip = Column(Float)
    observed_precip = Column(Float)
    predicted_wind = Column(Float)
    observed_wind = Column(Float)
    temp_error = Column(Float)
    precip_error = Column(Float)
    wind_error = Column(Float)
    horizon_hours = Column(Integer)
    model_name = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ScenarioSimulation(Base):
    __tablename__ = "scenario_simulations"
    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    baseline_data = Column(Text)
    scenario_params = Column(Text)
    result_data = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
