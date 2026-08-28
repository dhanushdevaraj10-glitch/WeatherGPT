import React from 'react';
import { useAppContext } from '../store/appStore';
import { Settings as SettingsIcon, Server, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
        <SettingsIcon className="text-slate-400" /> Settings
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">Application Mode</h2>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => dispatch({ type: 'SET_MODE', payload: 'live' })}
              className={`p-4 rounded-xl border text-left transition-all ${state.mode === 'live' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}
            >
              <div className="font-bold text-emerald-400 mb-1">Live Mode</div>
              <div className="text-xs text-slate-400">Uses real-time data from Open-Meteo.</div>
            </button>
            
            <button 
              onClick={() => dispatch({ type: 'SET_MODE', payload: 'demo' })}
              className={`p-4 rounded-xl border text-left transition-all ${state.mode === 'demo' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10'}`}
            >
              <div className="font-bold text-amber-400 mb-1">Demo Mode (Hackathon)</div>
              <div className="text-xs text-slate-400">Simulates extreme weather scenarios for demonstration purposes.</div>
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-white mb-4">System Status</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Server size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Weather Provider</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Connected
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-slate-400" />
                <span className="text-sm font-medium">AI Service (Gemini)</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
