import React from 'react';
import { Info } from 'lucide-react';
import { format } from 'date-fns';

interface DataProvenanceProps {
  source: string;
  updatedAt: string;
  type: string;
}

export const DataProvenance: React.FC<DataProvenanceProps> = ({ source, updatedAt, type }) => {
  const formattedTime = updatedAt ? format(new Date(updatedAt), 'h:mm a') : '';
  
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider mt-2">
      <Info size={10} />
      <span>Source: {source}</span>
      <span className="opacity-50">•</span>
      <span>Updated: {formattedTime}</span>
      <span className="opacity-50">•</span>
      <span>Type: {type}</span>
    </div>
  );
};
