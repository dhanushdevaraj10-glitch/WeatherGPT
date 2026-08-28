import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Eye } from 'lucide-react';

interface WeatherIconProps {
  code: number;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 24, className = '' }) => {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return <Sun size={size} className={`text-yellow-400 ${className}`} />;
  if (code >= 1 && code <= 3) return <Cloud size={size} className={`text-gray-300 ${className}`} />;
  if (code >= 45 && code <= 48) return <Eye size={size} className={`text-gray-400 ${className}`} />;
  if (code >= 51 && code <= 67) return <CloudRain size={size} className={`text-blue-400 ${className}`} />;
  if (code >= 71 && code <= 77) return <CloudSnow size={size} className={`text-white ${className}`} />;
  if (code >= 80 && code <= 82) return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
  if (code >= 95 && code <= 99) return <CloudLightning size={size} className={`text-yellow-500 ${className}`} />;
  
  return <Cloud size={size} className={`text-gray-400 ${className}`} />; // fallback
};
