import React from 'react';
import { RiskAssessment } from '../../types';
import { RiskDetailCard } from './RiskDetailCard';
import { RiskBadge } from '../shared/RiskBadge';

interface RiskDashboardProps {
  assessment: RiskAssessment;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ assessment }) => {
  const risks = [
    { title: 'Rain & Flooding', data: assessment.rain_risk },
    { title: 'Heat & Health', data: assessment.heat_risk },
    { title: 'Wind & Storm', data: assessment.wind_risk },
    { title: 'Travel & Road', data: assessment.travel_risk },
    { title: 'Outdoor Activities', data: assessment.outdoor_risk },
    { title: 'Severe Storm', data: assessment.storm_risk }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6 md:p-8 text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${
          assessment.overall_risk.level === 'SEVERE' ? 'bg-red-500' :
          assessment.overall_risk.level === 'HIGH' ? 'bg-orange-500' :
          assessment.overall_risk.level === 'MODERATE' ? 'bg-amber-500' :
          assessment.overall_risk.level === 'LOW' ? 'bg-blue-500' : 'bg-slate-500'
        }`}></div>
        
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Weather Risk</h2>
        <div className="flex flex-col items-center gap-4">
          <RiskBadge level={assessment.overall_risk.level} size="lg" />
          <p className="text-lg md:text-xl text-white max-w-2xl mt-2">{assessment.overall_risk.explanation}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {risks.map((risk, idx) => (
          <RiskDetailCard key={idx} title={risk.title} detail={risk.data} />
        ))}
      </div>
    </div>
  );
};
