import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CloudLightning, Navigation, Settings, Loader2 } from 'lucide-react';
import { useAppContext } from '../../store/appStore';
import { LocationSearch } from '../shared/LocationSearch';
import { useGeolocation } from '../../hooks/useGeolocation';

export const Navbar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { getLocation, loading, error } = useGeolocation();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleLocationSelect = (loc: any) => {
    dispatch({ type: 'SET_LOCATION', payload: loc });
  };

  const toggleMode = () => {
    dispatch({ type: 'SET_MODE', payload: state.mode === 'live' ? 'demo' : 'live' });
  };

  const handleGPS = () => {
    getLocation((loc) => {
      dispatch({ type: 'SET_LOCATION', payload: loc });
      setToastMsg(`Location set to ${loc.name}`);
      setTimeout(() => setToastMsg(null), 3000);
    });
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-bg/80 backdrop-blur-lg border-b border-white/5">
      {state.mode === 'demo' && (
        <div className="bg-red-500/90 text-white text-xs font-bold text-center py-1 tracking-widest uppercase">
          ⚠ HACKATHON SIMULATION MODE ACTIVE — NOT REAL WEATHER DATA ⚠
        </div>
      )}

      {toastMsg && (
        <div className="bg-accent-primary/90 text-white text-xs font-medium text-center py-1 animate-fade-in">
          ✓ {toastMsg}
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

          <div className="hidden md:flex flex-1 max-w-md mx-8 items-center">
            <LocationSearch onSelect={handleLocationSelect} className="w-full" onUseLocation={handleGPS} isLocating={loading} />
            <button 
              onClick={handleGPS}
              disabled={loading}
              className={`ml-2 p-2 rounded-xl border border-white/10 hover:border-accent-primary/50 transition-all ${
                loading 
                  ? 'bg-accent-primary/20 text-accent-primary' 
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Detect my current location"
            >
              {loading ? (
                <Loader2 className="animate-spin text-accent-primary" size={18} />
              ) : (
                <Navigation size={18} className="text-accent-secondary" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile GPS quick button */}
            <button 
              onClick={handleGPS}
              disabled={loading}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-accent-secondary hover:bg-white/10"
              title="Detect my current location"
            >
              {loading ? <Loader2 className="animate-spin text-accent-primary" size={16} /> : <Navigation size={16} />}
            </button>

            <button
              onClick={toggleMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                state.mode === 'live' 
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                  : 'border-amber-500/50 text-amber-400 bg-amber-500/20 animate-pulse-glow'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${state.mode === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className="hidden sm:inline">{state.mode === 'live' ? 'LIVE MODE' : 'DEMO MODE'}</span>
              <span className="sm:hidden">{state.mode === 'live' ? 'LIVE' : 'DEMO'}</span>
            </button>
            
            <NavLink to="/settings" className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings size={20} />
            </NavLink>
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-red-500/20 text-red-300 text-xs text-center py-0.5 border-t border-red-500/30">
          Location: {error}
        </div>
      )}
    </nav>
  );
};
