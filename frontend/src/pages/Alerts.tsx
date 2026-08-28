import React, { useState, useEffect } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { weatherApi } from '../api/weather';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  // Simple mock for hackathon
  useEffect(() => {
    setAlerts([
      { id: '1', type: 'Rain', threshold: '50%', location: 'Current', active: true }
    ]);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-2">Custom Alerts</h1>
      <p className="text-slate-400 mb-8">Set up personalized weather notifications.</p>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="text-accent-primary" /> Active Alerts
        </h3>
        
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <div className="font-bold text-white">{alert.type} Alert</div>
                  <div className="text-sm text-slate-400">Trigger when {alert.type} &gt; {alert.threshold}</div>
                </div>
                <button className="text-red-400 hover:bg-red-400/20 p-2 rounded-full transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400">No active alerts.</div>
        )}
      </div>
      
      <div className="text-xs text-slate-500 italic">
        * WeatherGPT alerts are AI estimates and do not replace official emergency warnings.
      </div>
    </div>
  );
};
