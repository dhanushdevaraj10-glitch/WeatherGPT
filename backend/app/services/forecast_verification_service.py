from datetime import datetime, timezone
from typing import Dict, Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import ForecastRecord, ForecastVerification, WeatherObservation

class ForecastVerificationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def store_forecast(self, location_id: int, forecast_data: Dict[str, Any], model_name: str):
        records = []
        forecasts = forecast_data.get("daily", forecast_data.get("forecasts", []))
        if isinstance(forecasts, dict):
            forecasts = [forecasts]

        for forecast in forecasts:
            forecast_date = forecast.get("date", forecast.get("forecast_date"))
            if not forecast_date:
                continue
            if isinstance(forecast_date, str):
                forecast_date = datetime.fromisoformat(forecast_date.replace("Z", "+00:00"))
            records.append(ForecastRecord(
                location_id=location_id,
                forecast_date=forecast_date,
                horizon_hours=forecast.get("horizon_hours"),
                temperature=forecast.get("temperature", forecast.get("temp_mean")),
                precipitation=forecast.get("precipitation", forecast.get("precipitation_sum")),
                precip_probability=forecast.get("precip_probability", forecast.get("precip_probability_max")),
                wind_speed=forecast.get("wind_speed", forecast.get("wind_speed_max")),
                humidity=forecast.get("humidity"),
                weather_code=forecast.get("weather_code"),
                model_name=model_name,
                provider=forecast_data.get("provider", "unknown"),
            ))

        self.db.add_all(records)
        await self.db.commit()
        return {"status": "stored", "records_count": len(records)}

    async def verify_forecast(self, location_id: int, date: str):
        target_date = datetime.fromisoformat(date).date()
        forecasts = (await self.db.execute(
            select(ForecastRecord).where(
                ForecastRecord.location_id == location_id,
                func.date(ForecastRecord.forecast_date) == target_date,
            )
        )).scalars().all()
        observation = (await self.db.execute(
            select(WeatherObservation).where(
                WeatherObservation.location_id == location_id,
                func.date(WeatherObservation.observed_at) == target_date,
            ).order_by(WeatherObservation.observed_at.desc())
        )).scalars().first()
        if not observation:
            return []

        results = []
        for forecast in forecasts:
            verification = ForecastVerification(
                location_id=location_id,
                forecast_date=forecast.forecast_date,
                verification_date=observation.observed_at or datetime.now(timezone.utc),
                predicted_temp=forecast.temperature,
                observed_temp=observation.temperature,
                predicted_precip=forecast.precipitation,
                observed_precip=observation.precipitation,
                predicted_wind=forecast.wind_speed,
                observed_wind=observation.wind_speed,
                temp_error=self._error(forecast.temperature, observation.temperature),
                precip_error=self._error(forecast.precipitation, observation.precipitation),
                wind_error=self._error(forecast.wind_speed, observation.wind_speed),
                horizon_hours=forecast.horizon_hours,
                model_name=forecast.model_name,
            )
            self.db.add(verification)
            results.append(verification)
        await self.db.commit()
        return results

    @staticmethod
    def _error(predicted: float | None, observed: float | None) -> float | None:
        if predicted is None or observed is None:
            return None
        return predicted - observed

    async def get_verification_metrics(self, location_id: int) -> Dict[str, Any]:
        records = (await self.db.execute(
            select(ForecastVerification).where(ForecastVerification.location_id == location_id)
        )).scalars().all()
        temp_errors = [record.temp_error for record in records if record.temp_error is not None]
        precip_errors = [abs(record.precip_error) for record in records if record.precip_error is not None]
        temp_mae = sum(abs(error) for error in temp_errors) / len(temp_errors) if temp_errors else None
        temp_bias = sum(temp_errors) / len(temp_errors) if temp_errors else None
        precip_error = sum(precip_errors) / len(precip_errors) if precip_errors else None
        forecast_skill = max(0.0, 1.0 - temp_mae / 10) if temp_mae is not None else None
        return {
            "location": {"id": location_id},
            "temp_mae": temp_mae,
            "temp_bias": temp_bias,
            "precip_error": precip_error,
            "forecast_skill": forecast_skill,
            "records_count": len(records),
            "message": "Metrics calculated successfully." if records else "No verified forecast records yet."
        }
