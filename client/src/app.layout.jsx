import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#12191C] text-slate-100 flex flex-col font-sans selection:bg-[#E4593F] selection:text-white">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs font-mono text-[#B9B2A0]/60">
        PulseVoice &copy; {new Date().getFullYear()} • Conversational Voice AI Health Screening Assessment
      </footer>
    </div>
  );
};

export default AppLayout;


