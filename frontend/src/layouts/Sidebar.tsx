import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  GitBranch,
  Wrench,
  BookOpen,
  Database,
  History,
  CheckCircle2,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { cn } from '../utils/cn';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Lab Explorer', path: '/labs', icon: FlaskConical, badge: '14' },
  { name: 'Workflow Visualizer', path: '/workflows', icon: GitBranch },
  { name: 'Tools Registry', path: '/tools', icon: Wrench, badge: '16' },
  { name: 'Skills Registry', path: '/skills', icon: BookOpen, badge: '7' },
  { name: 'Memory Explorer', path: '/memory', icon: Database },
  { name: 'Execution History', path: '/history', icon: History },
  { name: 'Evaluations', path: '/evaluations', icon: CheckCircle2 },
  { name: 'System Architecture', path: '/architecture', icon: Cpu },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-white/5 dark:border-white/5 light:border-slate-200 bg-[#0c101c]/95 dark:bg-[#0c101c]/95 light:bg-white transition-all duration-300 z-30 select-none backdrop-blur-md',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header in Sidebar */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/5 dark:border-white/5 light:border-slate-200">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-glow-violet flex-shrink-0">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <h2 className="font-extrabold text-xs tracking-wider text-white light:text-slate-900 font-mono">
                COMMAND CENTER
              </h2>
              <p className="text-[10px] text-violet-400 font-mono tracking-tight">AGENTIC AI</p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-glow-violet">
            <Terminal className="w-4 h-4 text-white" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors',
            sidebarCollapsed && 'hidden'
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: matchActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 relative',
                  matchActive || isActive
                    ? 'bg-violet-600/15 text-violet-300 font-semibold border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )
              }
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-violet-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />

              {!sidebarCollapsed && (
                <span className="truncate flex-1">{item.name}</span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                  {item.badge}
                </span>
              )}

              {/* Active glow pip */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-violet-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle at Bottom */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors text-xs gap-2 font-mono"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
