import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LiveIndicatorProps {
  status: 'LIVE' | 'CACHED';
  updatedAt: string;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({ status, updatedAt }) => {
  const timeAgo = updatedAt ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true }) : 'unknown';

  if (status === 'LIVE') {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <Activity size={14} />
        LIVE DATA
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
      <Clock size={14} />
      CACHED • {timeAgo}
    </div>
  );
};
