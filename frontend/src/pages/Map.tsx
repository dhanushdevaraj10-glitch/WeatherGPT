import React from 'react';
import { WeatherMap } from '../components/map/WeatherMap';
import { useAppContext } from '../store/appStore';

export const Map: React.FC = () => {
  const { state } = useAppContext();

  const center: [number, number] = state.selectedLocation 
    ? [state.selectedLocation.latitude, state.selectedLocation.longitude]
    : [20, 0]; // Default center

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <WeatherMap 
        center={center}
        zoom={state.selectedLocation ? 10 : 3}
        location={state.selectedLocation || undefined}
        temperature={state.currentWeather?.temperature}
      />
      
      {state.selectedLocation && state.currentWeather && (
        <div className="absolute top-4 right-4 z-[400] glass-card p-4 bg-dark-card/90 w-64">
          <h3 className="font-bold text-white text-sm mb-1">{state.selectedLocation.name}</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-blue-400">{Math.round(state.currentWeather.temperature)}°</span>
            <span className="text-sm text-slate-400 mb-1 capitalize">{state.currentWeather.weather_description}</span>
          </div>
          <div className="text-xs text-slate-400 flex justify-between">
            <span>Rain: {Math.round(state.currentWeather.precip_probability)}%</span>
            <span>Wind: {Math.round(state.currentWeather.wind_speed)} km/h</span>
          </div>
        </div>
      )}
    </div>
  );
};
