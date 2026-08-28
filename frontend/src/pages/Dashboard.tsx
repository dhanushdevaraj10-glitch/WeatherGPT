import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudLightning, Search, ArrowRight, ShieldCheck, Database, BrainCircuit, Globe } from 'lucide-react';
import { useAppContext } from '../store/appStore';
import { useWeather } from '../hooks/useWeather';
import { LocationSearch } from '../components/shared/LocationSearch';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { CurrentWeatherCard } from '../components/weather/CurrentWeatherCard';
import { DailyForecastCard } from '../components/weather/DailyForecastCard';
import { HourlyChart } from '../components/weather/HourlyChart';
import { WeatherDetailsGrid } from '../components/weather/WeatherDetailsGrid';
import { WeatherMap } from '../components/map/WeatherMap';
import { ReliabilityScoreCard } from '../components/shared/ReliabilityScoreCard';
import { ModelAgreementCard } from '../components/shared/ModelAgreementCard';
import { AIRiskBadge } from '../components/risk/AIRiskBadge';
import { OfficialWarningCard } from '../components/shared/OfficialWarningCard';

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { fetchWeather, isLoading, error } = useWeather();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.selectedLocation) {
      fetchWeather(state.selectedLocation.latitude, state.selectedLocation.longitude, state.selectedLocation);
    }
  }, [state.selectedLocation, fetchWeather, state.mode]); // Refetch when mode changes

  const handleLocationSelect = (loc: any) => {
    dispatch({ type: 'SET_LOCATION', payload: loc });
  };

  if (!state.selectedLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-pulse-glow">
          <CloudLightning className="text-white" size={40} />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          WeatherGPT
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
          The next generation of weather intelligence. Real-time data combined with AI risk assessment for smarter decisions.
        </p>
        
        <div className="w-full max-w-lg mb-12 relative z-20">
          <LocationSearch onSelect={handleLocationSelect} className="w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mt-8">
          <div className="glass-card p-6 text-left">
            <Database className="text-accent-primary mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Real Data</h3>
            <p className="text-sm text-slate-400">Powered by Open-Meteo for accurate, reliable global forecasting.</p>
          </div>
          <div className="glass-card p-6 text-left">
            <BrainCircuit className="text-accent-secondary mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">AI Risk</h3>
            <p className="text-sm text-slate-400">Advanced AI analyzes conditions to warn you of potential hazards.</p>
          </div>
          <div className="glass-card p-6 text-left">
            <ShieldCheck className="text-emerald-400 mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Verification</h3>
            <p className="text-sm text-slate-400">Built-in reliability scoring and model agreement checking.</p>
          </div>
          <div className="glass-card p-6 text-left">
            <Globe className="text-purple-400 mb-4" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Global Coverage</h3>
            <p className="text-sm text-slate-400">Detailed climate intelligence for any location on Earth.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !state.currentWeather) {
    return <LoadingSpinner message="Analyzing atmospheric data..." size="lg" />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p className="text-xl font-bold">Error loading weather data</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!state.currentWeather || !state.forecast) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header section handled by CurrentWeatherCard */}
      <CurrentWeatherCard weather={state.currentWeather} />
      
      {/* Risk & Reliability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {state.reliability && <ReliabilityScoreCard reliability={state.reliability} />}
        {state.modelAgreement && <ModelAgreementCard agreement={state.modelAgreement} />}
        <AIRiskBadge assessment={state.riskAssessment} />
      </div>

      {/* Warnings Row */}
      <OfficialWarningCard warnings={[]} /> {/* Empty for hackathon default, can add mock data */}

      {/* Forecast Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HourlyChart hourly={state.forecast.hourly} />
        </div>
        <div>
          <DailyForecastCard forecast={state.forecast.daily} />
        </div>
      </div>

      {/* Details & Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WeatherDetailsGrid weather={state.currentWeather} />
          
          <div className="glass-card p-6 bg-gradient-to-br from-accent-primary/10 to-transparent">
            <h3 className="text-lg font-bold text-white mb-2">AI Recommendation</h3>
            <p className="text-slate-300 mb-4">
              {state.riskAssessment?.overall_risk.level === 'SEVERE' || state.riskAssessment?.overall_risk.level === 'HIGH' 
                ? 'Weather conditions are unfavorable. Limit outdoor activities and exercise caution.'
                : 'Current conditions are generally suitable for most activities. Stay hydrated if outdoors.'}
            </p>
            <button 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 text-accent-primary text-sm font-medium hover:text-white transition-colors"
            >
              Ask WeatherGPT for details <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-[400px]">
          <WeatherMap 
            center={[state.selectedLocation.latitude, state.selectedLocation.longitude]} 
            location={state.selectedLocation}
            temperature={state.currentWeather.temperature}
          />
        </div>
      </div>
    </div>
  );
};
