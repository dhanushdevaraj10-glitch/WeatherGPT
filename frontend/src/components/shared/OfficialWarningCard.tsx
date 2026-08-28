import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { OfficialWarning } from '../../types';
import { format } from 'date-fns';

interface OfficialWarningCardProps {
  warnings?: OfficialWarning[];
}

export const OfficialWarningCard: React.FC<OfficialWarningCardProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="glass-card p-4 border-dashed border-white/20 flex items-center gap-3">
        <Info className="text-slate-400" size={20} />
        <div className="text-sm text-slate-400">
          No official warnings are currently active for this location.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {warnings.map((warning, idx) => {
        const isSevere = warning.severity.toLowerCase() === 'severe' || warning.severity.toLowerCase() === 'extreme';
        const bgClass = isSevere ? 'bg-red-950/40 border-red-500/30' : 'bg-orange-950/40 border-orange-500/30';
        const iconClass = isSevere ? 'text-red-500' : 'text-orange-500';
        
        return (
          <div key={idx} className={`rounded-xl border p-4 backdrop-blur-sm ${bgClass}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`shrink-0 mt-0.5 ${iconClass}`} size={20} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white uppercase tracking-wide text-sm flex items-center gap-2">
                    OFFICIAL WARNING
                    {!warning.is_connected && (
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded normal-case font-normal">SIMULATED</span>
                    )}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSevere ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {warning.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-lg font-semibold text-white mb-2">{warning.warning_type}</div>
                <p className="text-sm text-slate-300 mb-3">{warning.description}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <div>Source: <span className="font-medium text-slate-300">{warning.source}</span></div>
                  <div>Issued: {format(new Date(warning.issued_at), 'MMM d, h:mm a')}</div>
                  <div>Valid until: {format(new Date(warning.valid_to), 'MMM d, h:mm a')}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
