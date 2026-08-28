import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useAppContext } from '../store/appStore';
import { CloudRain, Navigation } from 'lucide-react';

export const Chat: React.FC = () => {
  const { state } = useAppContext();

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-dark-bg">
      {/* Optional sidebar info panel for desktop */}
      <div className="hidden lg:flex flex-col w-80 border-r border-white/5 p-6 bg-dark-card/30">
        <div className="flex items-center gap-2 text-accent-secondary mb-6">
          <Navigation size={20} />
          <h2 className="font-bold text-white">Context</h2>
        </div>

        {state.selectedLocation ? (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-white/5">
              <div className="text-sm text-slate-400 mb-1">Active Location</div>
              <div className="font-bold text-white">{state.selectedLocation.name}</div>
              <div className="text-xs text-slate-500">{state.selectedLocation.country}</div>
            </div>
            
            {state.currentWeather && (
              <div className="glass-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-slate-400">Current Weather</div>
                  <CloudRain className="text-blue-400" size={16} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{Math.round(state.currentWeather.temperature)}°C</div>
                <div className="text-sm text-slate-300 capitalize">{state.currentWeather.weather_description}</div>
              </div>
            )}
            
            {state.riskAssessment && (
              <div className="glass-card p-4">
                <div className="text-sm text-slate-400 mb-2">Risk Level</div>
                <div className={`font-bold ${
                  state.riskAssessment.overall_risk.level === 'HIGH' || state.riskAssessment.overall_risk.level === 'SEVERE' 
                    ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {state.riskAssessment.overall_risk.level}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-400 italic">
            Select a location in the navigation bar to provide weather context to the AI.
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatInterface />
      </div>
    </div>
  );
};
