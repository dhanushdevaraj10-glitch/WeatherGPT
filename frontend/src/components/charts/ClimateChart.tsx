import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';

interface ClimateChartProps {
  data: any[];
  title: string;
  type: 'temperature' | 'precipitation' | 'both';
  avgLine?: number;
}

export const ClimateChart: React.FC<ClimateChartProps> = ({ data, title, type, avgLine }) => {
  return (
    <div className="w-full h-[400px] glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">{title}</h3>
      <div className="w-full h-[320px] -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            
            {(type === 'temperature' || type === 'both') && (
              <YAxis yAxisId="temp" orientation="left" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            )}
            
            {(type === 'precipitation' || type === 'both') && (
              <YAxis yAxisId="precip" orientation="right" domain={[0, 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} hide={type === 'both'} />
            )}
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {(type === 'precipitation' || type === 'both') && (
              <Bar yAxisId={type === 'both' ? 'temp' : 'precip'} dataKey="precipitation" name="Precipitation (mm)" fill="#0ea5e9" opacity={0.7} radius={[4, 4, 0, 0]} />
            )}
            
            {(type === 'temperature' || type === 'both') && (
              <Line yAxisId="temp" type="monotone" dataKey="temperature" name="Avg Temp (°C)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            )}
            
            {avgLine !== undefined && (
              <ReferenceLine yAxisId="temp" y={avgLine} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Historical Avg', fill: '#94a3b8', fontSize: 10 }} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
