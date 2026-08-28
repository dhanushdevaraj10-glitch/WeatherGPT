import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, ComposedChart
} from 'recharts';
import { HourlyForecast } from '../../types';
import { format } from 'date-fns';

interface HourlyChartProps {
  hourly: HourlyForecast[];
}

export const HourlyChart: React.FC<HourlyChartProps> = ({ hourly }) => {
  const data = useMemo(() => {
    return hourly.slice(0, 24).map(h => ({
      ...h,
      timeLabel: format(new Date(h.time), 'ha')
    }));
  }, [hourly]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/10 shadow-xl !bg-dark-card/90">
          <p className="text-sm font-semibold text-white mb-2">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: p.color }}>{p.name}:</span>
              <span className="font-medium text-white">{p.value}{p.name === 'Temp' ? '°' : 'mm'}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 animate-fade-in w-full h-[300px]">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">24-Hour Forecast</h3>
      
      <div className="w-full h-full -ml-4">
        <ResponsiveContainer width="100%" height="85%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timeLabel" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              interval="preserveStartEnd"
            />
            <YAxis 
              yAxisId="temp" 
              orientation="left" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <YAxis 
              yAxisId="rain" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              hide={true} 
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar 
              yAxisId="rain" 
              dataKey="precipitation" 
              name="Rain" 
              fill="#06b6d4" 
              opacity={0.5} 
              radius={[4, 4, 0, 0]} 
              barSize={8}
            />
            
            <Area 
              yAxisId="temp" 
              type="monotone" 
              dataKey="temperature" 
              name="Temp" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#tempGradient)" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
