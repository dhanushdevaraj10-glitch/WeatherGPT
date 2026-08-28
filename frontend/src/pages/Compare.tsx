import React from 'react';
import { useAppContext } from '../store/appStore';
import { GitCompare } from 'lucide-react';

export const Compare: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto text-center space-y-6">
      <GitCompare size={48} className="text-accent-secondary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Compare Locations</h1>
      <p className="text-slate-400 mb-8">Compare weather conditions and risks between multiple locations.</p>
      
      <div className="glass-card p-12 text-slate-400">
        Comparison feature is under construction.
      </div>
    </div>
  );
};
