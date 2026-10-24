import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherMap } from '../components/map/WeatherMap';
import { useAppContext } from '../store/appStore';
import { useWeather } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { LocationSearch } from '../components/shared/LocationSearch';
import { Location } from '../types';
import { Navigation, Loader2, MapPin, ArrowRight, ShieldAlert, Thermometer, Wind, Droplets } from 'lucide-react';
import { weatherApi } from '../api/weather';

export const Map: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { fetchWeather } = useWeather();
  const { getLocation, loading: isLocating } = useGeolocation();
  const navigate = useNavigate();
  const [isClickFetching, setIsClickFetching] = useState(false);

  const defaultCenter: [number, number] = [11.0168, 76.9558]; // Coimbatore default
  const center: [number, number] = state.selectedLocation 
    ? [state.selectedLocation.latitude, state.selectedLocation.longitude]
    : defaultCenter;

  const handleLocationSelect = (loc: Location) => {
    dispatch({ type: 'SET_LOCATION', payload: loc });
    fetchWeather(loc.latitude, loc.longitude, loc);
  };

  const handleGPS = () => {
    getLocation((loc) => {
      dispatch({ type: 'SET_LOCATION', payload: loc });
      fetchWeather(loc.latitude, loc.longitude, loc);
    });
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setIsClickFetching(true);
    let resolvedLoc: Location = {
      name: `Point (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      country: '',
      region: '',
      latitude: lat,
      longitude: lon,
      timezone: 'UTC',
      elevation: 0,
    };

    try {
      const res = await weatherApi.reverseGeocode(lat, lon);
      if (res.data && res.data.name && !res.data.name.startsWith('Location (')) {
        resolvedLoc = {
          name: res.data.name,
          country: res.data.country || '',
          region: res.data.region || '',
          latitude: lat,
          longitude: lon,
          timezone: res.data.timezone || 'UTC',
          elevation: res.data.elevation || 0,
        };
      } else {
        // Client fallback
        const resp = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (resp.ok) {
          const d = await resp.json();
          const n = d.city || d.locality || d.principalSubdivision || d.countryName;
          if (n) {
            resolvedLoc = {
              name: n,
              country: d.countryName || '',
              region: d.principalSubdivision || '',
              latitude: lat,
              longitude: lon,
              timezone: 'UTC',
              elevation: 0,
            };
          }
        }
      }
    } catch {
      // Keep fallback coords
    } finally {
      setIsClickFetching(false);
    }

    dispatch({ type: 'SET_LOCATION', payload: resolvedLoc });
    fetchWeather(lat, lon, resolvedLoc);
  };

  const QUICK_CITIES: Location[] = [
    { name: 'Coimbatore', region: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata', elevation: 411 },
    { name: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', elevation: 25 },
    { name: 'Tokyo', region: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', elevation: 40 },
    { name: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', elevation: 10 },
    { name: 'Sydney', region: 'NSW', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', elevation: 19 },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative flex flex-col overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-[95%] max-w-3xl flex flex-col sm:flex-row items-center gap-2">
        <div className="flex-1 w-full">
          <LocationSearch 
            onSelect={handleLocationSelect} 
            className="w-full shadow-2xl" 
            placeholder="Search city to fly to on map..."
            onUseLocation={handleGPS}
            isLocating={isLocating}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleGPS}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-dark-card/90 hover:bg-dark-card border border-white/15 text-accent-secondary text-xs font-bold transition-all shadow-xl backdrop-blur-md hover:border-accent-primary/50"
            title="Use current location"
          >
            {isLocating ? (
              <Loader2 className="animate-spin text-accent-primary" size={16} />
            ) : (
              <Navigation size={16} className="text-accent-primary" />
            )}
            <span>{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </div>

      {/* Quick Location Pills under Search */}
      <div className="hidden md:flex absolute top-20 left-1/2 -translate-x-1/2 z-[400] items-center gap-1.5 bg-dark-bg/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">Quick:</span>
        {QUICK_CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => handleLocationSelect(c)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all ${
              state.selectedLocation?.name === c.name 
                ? 'bg-accent-primary text-white font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Map Interactive Banner */}
      <div className="hidden lg:block absolute bottom-4 left-4 z-[400] bg-dark-bg/85 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-xs text-slate-300 shadow-xl pointer-events-none">
        💡 <span className="font-semibold text-white">Interactive Map:</span> Click anywhere in the world to get instant weather intelligence.
      </div>

      {/* Main Map */}
      <WeatherMap 
        center={center}
        zoom={state.selectedLocation ? 10 : 5}
        location={state.selectedLocation || { name: 'World Map', country: '', region: '', latitude: center[0], longitude: center[1], timezone: 'UTC', elevation: 0 }}
        temperature={state.currentWeather?.temperature}
        weatherDescription={state.currentWeather?.weather_description}
        rainProbability={state.currentWeather?.precip_probability}
        windSpeed={state.currentWeather?.wind_speed}
        riskLevel={state.riskAssessment?.overall_risk.level}
        onMapClick={handleMapClick}
      />
      
      {/* Floating Weather Info Card */}
      {state.selectedLocation && state.currentWeather && (
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 z-[400] glass-card p-5 bg-[#0c1222]/95 border border-white/15 w-[300px] sm:w-[320px] rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-accent-secondary" />
                <h3 className="font-extrabold text-white text-base leading-tight">{state.selectedLocation.name}</h3>
              </div>
              <div className="text-xs text-slate-400 ml-5">
                {[state.selectedLocation.region, state.selectedLocation.country].filter(Boolean).join(', ')}
              </div>
            </div>

            {state.riskAssessment?.overall_risk.level && (
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                state.riskAssessment.overall_risk.level === 'SEVERE' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                state.riskAssessment.overall_risk.level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                state.riskAssessment.overall_risk.level === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {state.riskAssessment.overall_risk.level}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 my-3">
            <span className="text-4xl font-black text-blue-400 tracking-tight">
              {Math.round(state.currentWeather.temperature)}°C
            </span>
            <div className="text-sm text-slate-300 font-medium capitalize">
              {state.currentWeather.weather_description}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-white/5 rounded-xl border border-white/5 mb-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Droplets size={12} className="text-blue-400" /> Rain
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {Math.round(state.currentWeather.precip_probability)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Wind size={12} className="text-teal-400" /> Wind
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {Math.round(state.currentWeather.wind_speed)} km/h
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Thermometer size={12} className="text-amber-400" /> Feels
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {Math.round(state.currentWeather.apparent_temp)}°
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              <span>Full Intelligence</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              Ask AI
            </button>
          </div>
        </div>
      )}

      {isClickFetching && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[400] bg-dark-bg/90 backdrop-blur-md border border-accent-primary/40 text-accent-secondary px-4 py-2 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Loader2 className="animate-spin text-accent-primary" size={14} />
          <span>Retrieving location intelligence...</span>
        </div>
      )}
    </div>
  );
};
