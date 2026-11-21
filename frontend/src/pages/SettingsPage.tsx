import React from 'react';
import { Settings, Sun, Moon, Database, Terminal, Shield, RotateCcw } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { useExecutionStore } from '../stores/useExecutionStore';
import { clearExecutions } from '../services/api';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useAppStore();
  const { autoScroll, setAutoScroll } = useExecutionStore();

  const handleClearHistory = async () => {
    if (window.confirm('Clear all historical execution records from SQLite database?')) {
      try {
        await clearExecutions();
        toast.success('Database history cleared');
      } catch (err) {
        toast.error('Failed to clear database');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-white/5 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-medium mb-1 border border-violet-500/20">
          <Settings className="w-3.5 h-3.5" />
          <span>PREFERENCES &amp; CONFIGURATION</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize UI theme, console streaming preferences, and backend database storage.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0e1322] divide-y divide-white/5 shadow-xl">
        {/* Theme Settings */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm text-slate-100 font-mono">Interface Theme</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select dark-first command center or light desktop theme.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                theme === 'dark'
                  ? 'bg-violet-600 border-violet-500 text-white font-semibold shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark Theme
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                theme === 'light'
                  ? 'bg-violet-600 border-violet-500 text-white font-semibold shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light Theme
            </button>
          </div>
        </div>

        {/* Console Behavior */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm text-slate-100 font-mono">Console Auto-Scroll</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automatically keep terminal viewport pinned to latest stdout line during execution.
            </p>
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              autoScroll
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {autoScroll ? 'Enabled (Auto-follow)' : 'Disabled (Manual)'}
          </button>
        </div>

        {/* Database Management */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-sm text-slate-100 font-mono">SQLite Execution Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clear persisted executions, logs, and telemetry from the backend SQLite database.
            </p>
          </div>

          <button
            onClick={handleClearHistory}
            className="px-4 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-mono transition-colors"
          >
            Clear History Table
          </button>
        </div>

        {/* Platform Info */}
        <div className="p-6 space-y-2 text-xs font-mono text-slate-400">
          <div className="text-slate-300 font-semibold mb-1">Architecture Environment:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>Frontend: React 18 + Vite + TypeScript</div>
            <div>Styling: Tailwind CSS + Framer Motion</div>
            <div>Backend: FastAPI + Python 3.13</div>
            <div>Subprocess: Asyncio Isolated Subprocess</div>
            <div>Database: SQLite 3 (WAL mode)</div>
            <div>Telemetry: Server-Sent Events (SSE)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
