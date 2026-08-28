import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudLightning, Home, MessageSquare, Map as MapIcon, BarChart3, AlertCircle, User, Settings } from 'lucide-react';
import { useAppContext } from '../../store/appStore';
import { LocationSearch } from '../shared/LocationSearch';
import { useGeolocation } from '../../hooks/useGeolocation';
import { weatherApi } from '../../api/weather';

export const Navbar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { getLocation, location, loading, error } = useGeolocation();

  const handleLocationSelect = (loc: any) => {
    dispatch({ type: 'SET_LOCATION', payload: loc });
  };

  const toggleMode = () => {
    dispatch({ type: 'SET_MODE', payload: state.mode === 'live' ? 'demo' : 'live' });
  };

  const handleGPS = () => {
    getLocation();
  };

  React.useEffect(() => {
    if (location) {
      weatherApi.reverseGeocode(location.latitude, location.longitude)
        .then((res) => {
          if (res.data) {
            dispatch({ type: 'SET_LOCATION', payload: res.data });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [location, dispatch]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-bg/80 backdrop-blur-lg border-b border-white/5">
      {state.mode === 'demo' && (
        <div className="bg-red-500/90 text-white text-xs font-bold text-center py-1 tracking-widest uppercase">
          ⚠ HACKATHON SIMULATION MODE ACTIVE — NOT REAL WEATHER DATA ⚠
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                <CloudLightning className="text-white" size={20} />
              </div>
              <div>
                <div className="font-bold text-xl tracking-tight text-white leading-none">WeatherGPT</div>
                <div className="text-[10px] text-accent-secondary font-medium tracking-widest uppercase mt-0.5">AI Intelligence</div>
              </div>
            </NavLink>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <LocationSearch onSelect={handleLocationSelect} className="w-full" />
            <button 
              onClick={handleGPS}
              disabled={loading}
              className="ml-2 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Use current location"
            >
              <MapIcon size={20} />
            </button>
            {error && <span className="sr-only" role="alert">{error}</span>}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMode}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                state.mode === 'live' 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                  : 'border-amber-500/50 text-amber-400 bg-amber-500/20 animate-pulse-glow'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${state.mode === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              {state.mode === 'live' ? 'LIVE MODE' : 'DEMO MODE'}
            </button>
            
            <NavLink to="/settings" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings size={20} />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
