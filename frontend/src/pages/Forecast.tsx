import React from 'react';
import { useAppContext } from '../store/appStore';
import { DailyForecastCard } from '../components/weather/DailyForecastCard';
import { HourlyChart } from '../components/weather/HourlyChart';
import { TemperatureChart } from '../components/charts/TemperatureChart';
import { PrecipitationChart } from '../components/charts/PrecipitationChart';
import { AlertTriangle } from 'lucide-react';

export const Forecast: React.FC = () => {
  const { state } = useAppContext();

  if (!state.selectedLocation || !state.forecast) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a location to view the forecast.
      </div>
    );
  }

  const isLowAgreement = state.modelAgreement?.agreement === 'LOW';

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">Extended Forecast</h1>
      <p className="text-slate-400 mb-6">Detailed predictions for {state.selectedLocation.name}</p>

      {isLowAgreement && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <div className="font-bold text-red-400 text-sm">HIGH UNCERTAINTY</div>
            <div className="text-sm text-slate-300 mt-1">Weather models strongly disagree on the forecast for this period. Confidence in these predictions is lower than usual.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DailyForecastCard forecast={state.forecast.daily} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <HourlyChart hourly={state.forecast.hourly} />
          <TemperatureChart data={state.forecast.hourly} />
          <PrecipitationChart data={state.forecast.hourly} />
        </div>
      </div>
    </div>
  );
};
