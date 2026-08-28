import React from 'react';
import { DailyForecast } from '../../types';
import { WeatherIcon } from '../shared/WeatherIcon';
import { format } from 'date-fns';
import { Droplets } from 'lucide-react';

interface DailyForecastCardProps {
  forecast: DailyForecast[];
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ forecast }) => {
  // Find min and max across the week for relative scaling
  const allTemps = forecast.flatMap(d => [d.temp_min, d.temp_max]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp || 1; // prevent div by 0

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">7-Day Forecast</h3>
      
      <div className="space-y-3">
        {forecast.map((day, idx) => {
          const isToday = idx === 0;
          const leftPercent = ((day.temp_min - minTemp) / tempRange) * 100;
          const widthPercent = ((day.temp_max - day.temp_min) / tempRange) * 100;
          
          return (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0 last:pb-0">
              <div className="w-16 shrink-0 text-sm font-medium text-slate-300">
                {isToday ? 'Today' : format(new Date(day.date), 'EEE')}
              </div>
              
              <div className="w-8 shrink-0 flex justify-center">
                <WeatherIcon code={day.weather_code} size={20} />
              </div>
              
              <div className="w-16 shrink-0 flex items-center gap-1 text-xs text-blue-400">
                {day.precip_probability_max > 20 && (
                  <>
                    <Droplets size={12} />
                    {Math.round(day.precip_probability_max)}%
                  </>
                )}
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="w-8 text-right text-sm text-slate-400 shrink-0">{Math.round(day.temp_min)}°</div>
                
                <div className="flex-1 h-1.5 bg-dark-bg rounded-full relative">
                  <div 
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400 opacity-80"
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  ></div>
                </div>
                
                <div className="w-8 text-left text-sm font-medium text-white shrink-0">{Math.round(day.temp_max)}°</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
