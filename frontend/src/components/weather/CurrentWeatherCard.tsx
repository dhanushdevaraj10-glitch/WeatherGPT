import React from 'react';
import { CurrentWeather } from '../../types';
import { WeatherIcon } from '../shared/WeatherIcon';
import { LiveIndicator } from '../shared/LiveIndicator';
import { DataProvenance } from '../shared/DataProvenance';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{weather.location.name}</h2>
          <p className="text-slate-400">{weather.location.country}</p>
        </div>
        <LiveIndicator status={weather.data_status} updatedAt={weather.updated_at} />
      </div>

      <div className="flex items-center gap-6 md:gap-10 mt-8 mb-10 relative z-10">
        <WeatherIcon code={weather.weather_code} size={80} className="drop-shadow-lg" />
        <div>
          <div className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            {Math.round(weather.temperature)}°
          </div>
          <div className="text-lg md:text-xl text-slate-300 font-medium capitalize mt-2">
            {weather.weather_description}
          </div>
          <div className="text-sm text-slate-400 mt-1">
            Feels like {Math.round(weather.apparent_temp)}°
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10 border-t border-white/10 pt-6">
        <div>
          <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Humidity</div>
          <div className="text-lg font-semibold text-white">{Math.round(weather.humidity)}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Wind</div>
          <div className="text-lg font-semibold text-white">{Math.round(weather.wind_speed)} km/h</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Rain Prob.</div>
          <div className="text-lg font-semibold text-white">{Math.round(weather.precip_probability)}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">UV Index</div>
          <div className="text-lg font-semibold text-white">{Math.round(weather.uv_index)}</div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4">
        <DataProvenance source={weather.provider} updatedAt={weather.updated_at} type="Live observation" />
      </div>
    </div>
  );
};
