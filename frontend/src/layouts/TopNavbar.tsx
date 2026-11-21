import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sun,
  Moon,
  Search,
  ExternalLink,
  Activity,
  Terminal,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useExecutionStore } from '../stores/useExecutionStore';
import { fetchHealth } from '../services/api';
import { formatDuration } from '../utils/format';

export const TopNavbar: React.FC = () => {
  const { theme, toggleTheme, globalSearch, setGlobalSearch } = useAppStore();
  const { isRunning, status, durationMs } = useExecutionStore();
  const location = useLocation();

  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [pythonVersion, setPythonVersion] = useState<string>('');

  // Live backend health check every 10 seconds
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetchHealth();
        if (isMounted) {
          setBackendOnline(true);
          setPythonVersion(res.python_version);
        }
      } catch {
        if (isMounted) {
          setBackendOnline(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 border-b border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0c101c]/80 dark:bg-[#0c101c]/80 light:bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <h1 className="font-extrabold text-sm tracking-tight text-white light:text-slate-900 font-mono flex items-center gap-2">
            <span>AGENTIC AI COMMAND CENTER</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 light:text-slate-500 italic">
            Explore. Orchestrate. Execute. Observe.
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search across 14 labs, 42 programs, tools, skills..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 dark:border-white/10 light:border-slate-200 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: Health, Execution Status, Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Backend Health Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              backendOnline === true
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : backendOnline === false
                ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                : 'bg-amber-400 animate-pulse'
            }`}
          />
          <span className="text-[11px] text-slate-300 hidden sm:inline">
            {backendOnline === true ? `Backend: Python ${pythonVersion}` : backendOnline === false ? 'Backend Offline' : 'Connecting...'}
          </span>
        </div>

        {/* Current Execution State Badge */}
        {isRunning && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono animate-pulse">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline">Subprocess Active</span>
          </div>
        )}

        {/* API Docs Link */}
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors hidden lg:flex items-center gap-1 text-xs font-mono"
          title="Open FastAPI Swagger API Docs"
        >
          <span>API Docs</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
        </button>
      </div>
    </header>
  );
};
