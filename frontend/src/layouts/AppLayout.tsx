import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Toaster } from 'sonner';
import { useAppStore } from '../stores/useAppStore';

export const AppLayout: React.FC = () => {
  const theme = useAppStore((s) => s.theme);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0d14] dark:bg-[#0a0d14] light:bg-[#f8fafc] text-slate-100 light:text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors />
    </div>
  );
};
