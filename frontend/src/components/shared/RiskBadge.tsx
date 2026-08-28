import React from 'react';
import { ShieldAlert, Shield, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: 'NORMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const colors = {
    NORMAL: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    MODERATE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    SEVERE: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = { sm: 12, md: 16, lg: 20 };

  const Icon = level === 'SEVERE' || level === 'HIGH' ? AlertTriangle : (level === 'NORMAL' ? Shield : ShieldAlert);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colors[level]} ${sizes[size]} font-medium`}>
      {showIcon && <Icon size={iconSizes[size]} />}
      {level}
    </span>
  );
};
