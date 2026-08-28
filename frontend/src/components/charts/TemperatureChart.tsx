import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

interface TemperatureChartProps {
  data: any[];
  xKey?: string;
  yKey?: string;
  isDaily?: boolean;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, xKey = 'time', yKey = 'temperature', isDaily = false }) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      displayTime: isDaily ? format(new Date(d[xKey]), 'MMM d') : format(new Date(d[xKey]), 'ha')
    }));
  }, [data, xKey, isDaily]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/10 shadow-xl !bg-dark-card/90">
          <p className="text-sm font-semibold text-white mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span style={{ color: payload[0].color }}>Temperature:</span>
            <span className="font-medium text-white">{payload[0].value}°C</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Temperature Trend</h3>
      <div className="w-full h-[220px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="displayTime" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={yKey} 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#111827', strokeWidth: 2, stroke: '#3b82f6' }}
              activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
