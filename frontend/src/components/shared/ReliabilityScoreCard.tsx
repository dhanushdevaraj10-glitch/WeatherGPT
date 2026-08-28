import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ReliabilityDetail } from '../../types';

interface ReliabilityScoreCardProps {
  reliability: ReliabilityDetail;
}

export const ReliabilityScoreCard: React.FC<ReliabilityScoreCardProps> = ({ reliability }) => {
  const percentage = (reliability.score / 100) * 100;
  const strokeDasharray = `${percentage} 100`;

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4 tracking-wide uppercase">
        <ShieldCheck className="text-accent-primary" size={18} />
        WEATHERGPT DATA RELIABILITY
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <path
              className="text-white/10"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-accent-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
              strokeDasharray={strokeDasharray}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{reliability.score}</span>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-slate-400 mb-1">Grade</div>
          <div className="text-3xl font-black text-accent-secondary drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            {reliability.grade}
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">{reliability.label} Quality</div>
        </div>
      </div>

      <div className="space-y-3">
        {reliability.checks.map((check, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm border-t border-white/5 pt-2 first:border-0 first:pt-0">
            <div className="flex items-center gap-2">
              {check.passed ? (
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">✓</div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</div>
              )}
              <span className="text-slate-300">{check.name}</span>
            </div>
            <span className="text-slate-400 font-mono text-xs">{check.points}/{check.max_points}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
