import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';

interface HumidityWindChartProps {
  data: any[];
}

export const HumidityWindChart: React.FC<HumidityWindChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      displayTime: format(new Date(d.time), 'ha')
    }));
  }, [data]);

  return (
    <div className="w-full h-[300px] glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Humidity & Wind</h3>
      <div className="w-full h-[220px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="displayTime" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="wind_speed" name="Wind (km/h)" stroke="#94a3b8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
