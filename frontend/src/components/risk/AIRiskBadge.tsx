import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { RiskAssessment } from '../../types';

interface AIRiskBadgeProps {
  assessment: RiskAssessment | null;
}

export const AIRiskBadge: React.FC<AIRiskBadgeProps> = ({ assessment }) => {
  if (!assessment) return null;

  const level = assessment.overall_risk.level;
  const isHighRisk = level === 'HIGH' || level === 'SEVERE';

  return (
    <div className={`glass-card p-5 animate-fade-in ${isHighRisk ? 'border-orange-500/30' : 'border-blue-500/30'}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 tracking-wide uppercase mb-3">
        <BrainCircuit className={isHighRisk ? 'text-orange-400' : 'text-blue-400'} size={18} />
        WEATHERGPT AI RISK
      </div>
      
      <div className="text-2xl font-bold text-white mb-2">{level} RISK</div>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{assessment.overall_risk.explanation}</p>
      
      <div className="text-[10px] text-slate-500 bg-white/5 p-2 rounded italic">
        * AI estimated risk based on weather models. Does not replace official government warnings.
      </div>
    </div>
  );
};
