import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-accent-primary/30">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
