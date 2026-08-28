import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RiskDetail } from '../../types';
import { RiskBadge } from '../shared/RiskBadge';

interface RiskDetailCardProps {
  title: string;
  detail: RiskDetail;
}

export const RiskDetailCard: React.FC<RiskDetailCardProps> = ({ title, detail }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card border-white/5 transition-all">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-white uppercase tracking-wide">{title}</h3>
          <RiskBadge level={detail.level} size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-dark-bg rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  detail.score > 75 ? 'bg-red-500' : 
                  detail.score > 50 ? 'bg-orange-500' : 
                  detail.score > 25 ? 'bg-amber-500' : 
                  'bg-blue-500'
                }`}
                style={{ width: `${detail.score}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400 font-mono w-8 text-right">{detail.score}/100</span>
          </div>
          {expanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-5 border-t border-white/5 bg-black/20">
          <p className="text-sm text-slate-300 mb-5 leading-relaxed">{detail.explanation}</p>
          
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contributing Factors</h4>
          <div className="space-y-3">
            {detail.factors.map((factor, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    factor.contribution === 'high' ? 'bg-red-500' :
                    factor.contribution === 'medium' ? 'bg-orange-500' :
                    'bg-slate-500'
                  }`}></div>
                  <span className="text-slate-300">{factor.name}</span>
                </div>
                <span className="font-medium text-white">{factor.value} <span className="text-slate-500 font-normal">{factor.unit}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
