import React, { useEffect, useState } from 'react';
import { useAppContext } from '../store/appStore';
import { weatherApi } from '../api/weather';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { VerificationMetrics } from '../types';

export const Verification: React.FC = () => {
  const { state } = useAppContext();
  const [metrics, setMetrics] = useState<VerificationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.selectedLocation) {
      setMetrics(null);
      return;
    }

    setLoading(true);
    setError(null);
    weatherApi.getVerificationMetrics(state.selectedLocation.latitude, state.selectedLocation.longitude)
      .then(response => setMetrics(response.data))
      .catch(() => setError('Verification metrics could not be loaded.'))
      .finally(() => setLoading(false));
  }, [state.selectedLocation]);

  if (!state.selectedLocation) {
    return <div className="p-8 text-center text-slate-400">Please select a location.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Forecast Verification</h1>
      <p className="text-slate-400 mb-8">Historical accuracy for {state.selectedLocation.name}.</p>

      {loading && <LoadingSpinner />}
      {error && <div className="glass-card p-8 text-center text-red-300">{error}</div>}
      {!loading && !error && metrics && metrics.records_count === 0 && (
        <div className="glass-card p-12 text-center text-slate-400 border-dashed">{metrics.message}</div>
      )}
      {!loading && !error && metrics && metrics.records_count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric label="Temperature MAE" value={metrics.temp_mae} unit="°C" />
          <Metric label="Temperature bias" value={metrics.temp_bias} unit="°C" />
          <Metric label="Precipitation error" value={metrics.precip_error} unit="mm" />
          <Metric label="Forecast skill" value={metrics.forecast_skill === null ? null : metrics.forecast_skill * 100} unit="%" />
          <div className="sm:col-span-2 lg:col-span-4 text-sm text-slate-500">Based on {metrics.records_count} verified forecast records.</div>
        </div>
      )}
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number | null; unit: string }> = ({ label, value, unit }) => (
  <div className="glass-card p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value === null ? '—' : `${value.toFixed(2)} ${unit}`}</p>
  </div>
);
