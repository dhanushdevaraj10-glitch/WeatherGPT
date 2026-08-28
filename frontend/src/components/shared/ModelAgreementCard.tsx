import React from 'react';
import { GitCompare } from 'lucide-react';
import { ModelAgreementDetail } from '../../types';

interface ModelAgreementCardProps {
  agreement: ModelAgreementDetail;
}

export const ModelAgreementCard: React.FC<ModelAgreementCardProps> = ({ agreement }) => {
  const getBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'HIGH': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'MODERATE': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'LOW': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card p-5 animate-fade-in flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 tracking-wide uppercase">
          <GitCompare className="text-accent-secondary" size={18} />
          MODEL COMPARISON
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getBadgeColor(agreement.agreement)}`}>
          {agreement.agreement.toUpperCase()} AGREEMENT
        </span>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="text-sm text-slate-400">{agreement.models_compared} models compared</div>
          <div className="text-xs text-slate-500 mt-1">Temp spread: <span className="text-white font-medium">{agreement.temperature_spread.toFixed(1)}°C</span></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 border-b border-white/10 uppercase">
            <tr>
              <th className="py-2 px-1 font-medium">Model</th>
              <th className="py-2 px-1 font-medium text-right">Temp</th>
              <th className="py-2 px-1 font-medium text-right">Rain</th>
              <th className="py-2 px-1 font-medium text-right">Wind</th>
            </tr>
          </thead>
          <tbody>
            {agreement.models.map((model, idx) => (
              <tr key={idx} className="border-b border-white/5 last:border-0">
                <td className="py-2 px-1 font-medium text-slate-300">{model.name}</td>
                <td className="py-2 px-1 text-right">{model.temperature.toFixed(1)}°</td>
                <td className="py-2 px-1 text-right text-blue-400">{model.precipitation.toFixed(1)}mm</td>
                <td className="py-2 px-1 text-right text-slate-400">{model.wind_speed.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {agreement.note && (
        <div className="mt-4 text-xs text-slate-500 italic bg-white/5 p-2 rounded border border-white/5">
          {agreement.note}
        </div>
      )}
    </div>
  );
};
