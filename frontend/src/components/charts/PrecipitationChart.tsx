import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { format } from 'date-fns';

interface PrecipitationChartProps {
  data: any[];
  xKey?: string;
  yKey?: string;
  isDaily?: boolean;
}

export const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ data, xKey = 'time', yKey = 'precipitation', isDaily = false }) => {
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
            <span className="text-blue-400">Precipitation:</span>
            <span className="font-medium text-white">{payload[0].value} mm</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (val: number) => {
    if (val > 10) return '#3b82f6'; // Heavy
    if (val > 2) return '#0ea5e9'; // Moderate
    return '#38bdf8'; // Light
  };

  return (
    <div className="w-full h-[300px] glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Precipitation</h3>
      <div className="w-full h-[220px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="displayTime" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry[yKey])} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
