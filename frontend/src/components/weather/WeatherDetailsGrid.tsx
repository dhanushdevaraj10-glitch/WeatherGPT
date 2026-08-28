import React from 'react';
import { Droplets, Wind, Sun, Eye, Cloud, Gauge, Thermometer } from 'lucide-react';
import { CurrentWeather } from '../../types';

interface WeatherDetailsGridProps {
  weather: CurrentWeather;
}

export const WeatherDetailsGrid: React.FC<WeatherDetailsGridProps> = ({ weather }) => {
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
    return directions[index];
  };

  const details = [
    { icon: Thermometer, label: 'Apparent Temp', value: `${Math.round(weather.apparent_temp)}°C` },
    { icon: Droplets, label: 'Humidity', value: `${Math.round(weather.humidity)}%` },
    { icon: Wind, label: 'Wind Direction', value: getWindDirection(weather.wind_direction) },
    { icon: Wind, label: 'Wind Gusts', value: `${Math.round(weather.wind_gusts)} km/h` },
    { icon: Sun, label: 'UV Index', value: weather.uv_index },
    { icon: Eye, label: 'Visibility', value: `${Math.round(weather.visibility / 1000)} km` },
    { icon: Cloud, label: 'Cloud Cover', value: `${weather.cloud_cover}%` },
    { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
      {details.map((detail, idx) => (
        <div key={idx} className="glass-card p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <detail.icon size={16} className="text-accent-secondary" />
            <span className="text-xs font-medium uppercase tracking-wider">{detail.label}</span>
          </div>
          <div className="text-xl font-semibold text-white">{detail.value}</div>
        </div>
      ))}
    </div>
  );
};
