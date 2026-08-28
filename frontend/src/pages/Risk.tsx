import React from 'react';
import { useAppContext } from '../store/appStore';
import { RiskDashboard } from '../components/risk/RiskDashboard';

export const Risk: React.FC = () => {
  const { state } = useAppContext();

  if (!state.selectedLocation || !state.riskAssessment) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a location to view the risk assessment.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Weather Risk Analysis</h1>
      <p className="text-slate-400 mb-8">AI-driven hazard assessment for {state.selectedLocation.name}</p>

      <RiskDashboard assessment={state.riskAssessment} />
    </div>
  );
};
