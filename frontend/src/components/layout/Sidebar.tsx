import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Map as MapIcon, BarChart3, AlertCircle, User, GitCompare, CloudRain } from 'lucide-react';
import { useAppContext } from '../../store/appStore';

export const Sidebar: React.FC = () => {
  const { state } = useAppContext();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { to: '/forecast', icon: CloudRain, label: 'Forecast' },
    { to: '/map', icon: MapIcon, label: 'Live Map' },
    { to: '/risk', icon: AlertCircle, label: 'Risk Analysis' },
    { to: '/climate', icon: BarChart3, label: 'Climate Trends' },
    { to: '/compare', icon: GitCompare, label: 'Compare' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-white/5 bg-dark-bg/50 backdrop-blur-md">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary font-medium border border-accent-primary/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>
      
      {state.selectedLocation && (
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Active Location</div>
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center text-accent-secondary">
              <MapIcon size={14} />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-white truncate">{state.selectedLocation.name}</div>
              <div className="text-xs text-slate-400 truncate">{state.selectedLocation.country}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
