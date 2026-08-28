import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/appStore';
import { ClimateChart } from '../components/charts/ClimateChart';
import { weatherApi } from '../api/weather';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';

export const Climate: React.FC = () => {
  const { state } = useAppContext();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'temp' | 'precip'>('temp');

  useEffect(() => {
    if (state.selectedLocation) {
      setLoading(true);
      weatherApi.getClimateTrend(state.selectedLocation.latitude, state.selectedLocation.longitude)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [state.selectedLocation]);

  if (!state.selectedLocation) {
    return <div className="p-8 text-center text-slate-400">Please select a location.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">Climate Intelligence</h1>
      <p className="text-slate-400 mb-6">Historical trends for {state.selectedLocation.name}</p>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setTab('temp')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'temp' ? 'bg-accent-primary text-white' : 'bg-white/5 text-slate-400'}`}
        >
          Temperature Trend
        </button>
        <button 
          onClick={() => setTab('precip')} 
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'precip' ? 'bg-accent-primary text-white' : 'bg-white/5 text-slate-400'}`}
        >
          Precipitation
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : data.length > 0 ? (
        <ClimateChart 
          data={data} 
          title={`Historical ${tab === 'temp' ? 'Temperature' : 'Precipitation'}`} 
          type={tab === 'temp' ? 'temperature' : 'precipitation'} 
          avgLine={tab === 'temp' ? data[0]?.temperature : undefined}
        />
      ) : (
        <div className="p-8 text-center text-slate-400">No climate data available for this location.</div>
      )}
    </div>
  );
};
