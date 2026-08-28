import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Map as MapIcon, AlertCircle, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/map', icon: MapIcon, label: 'Map' },
    { to: '/risk', icon: AlertCircle, label: 'Risk' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-accent-primary' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
