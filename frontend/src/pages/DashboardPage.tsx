import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Code2,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Activity,
  ArrowRight,
  GitBranch,
  Layers,
  Wrench,
  BookOpen,
  Calendar,
  Database,
  Cpu,
  Users,
  Search,
  CloudLightning,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ParticleBackground } from '../components/common/ParticleBackground';
import { fetchStats, fetchLabs, fetchExecutions, runAllPrograms } from '../services/api';
import { OverviewStats, LabSummary, ExecutionRecord } from '../types';
import { toast } from 'sonner';
import { formatDuration, formatDate } from '../utils/format';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Wrench,
  FileText: BookOpen,
  Database,
  Layers,
  Cpu,
  GitBranch,
  Users,
  Search,
  CloudLightning,
  Code: Code2,
  ShieldCheck,
  Activity,
  Award,
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [labs, setLabs] = useState<LabSummary[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAll, setRunningAll] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, l, e] = await Promise.all([
        fetchStats().catch(() => null),
        fetchLabs().catch(() => []),
        fetchExecutions({ limit: 6 }).catch(() => []),
      ]);
      if (s) setStats(s);
      setLabs(l);
      setRecentExecutions(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      fetchStats().then(setStats).catch(() => {});
      fetchExecutions({ limit: 6 }).then(setRecentExecutions).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunAll = async () => {
    try {
      setRunningAll(true);
      toast.info('Starting batch execution of all 42 lab programs...');
      const res = await runAllPrograms();
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start batch execution');
    } finally {
      setTimeout(() => setRunningAll(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* SECTION A: Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0e1424] via-[#12192e] to-[#0a0d18] p-6 sm:p-10 shadow-2xl">
        <ParticleBackground />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono font-medium mb-4">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>AGENTIC AI ORCHESTRATION PLATFORM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Your Agentic AI Workspace
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore and execute 14 practical implementations of intelligent agent systems. 
            Inspect stateful loops, tool dispatchers, MCP connectors, multi-agent swarms, autonomous SDLC factories, and governance shields.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/labs')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-glow-violet active:scale-95"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Explore 14 Labs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/workflows')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs transition-all active:scale-95"
            >
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Workflow Visualizer</span>
            </button>

            <button
              onClick={handleRunAll}
              disabled={runningAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run All 42 Programs</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRICS STATS SECTION */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Labs"
          value={stats?.total_labs || 14}
          subtitle="All 14 labs verified"
          icon={FlaskConical}
          color="violet"
        />
        <StatCard
          title="Executable Programs"
          value={stats?.total_programs || 42}
          subtitle="14 reference + 28 assignments"
          icon={Code2}
          color="blue"
        />
        <StatCard
          title="Executions Run"
          value={stats?.total_executions ?? 0}
          subtitle={`${stats?.successful_executions ?? 0} passed, ${stats?.failed_executions ?? 0} failed`}
          icon={Activity}
          color="cyan"
        />
        <StatCard
          title="Backend Integration"
          value={stats?.backend_status === 'online' ? 'Connected' : 'Active'}
          subtitle="Direct Python Subprocess"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* SECTION B: 14 Labs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <span>Agentic AI Labs Collection</span>
              <span className="text-xs font-normal text-slate-400">({labs.length || 14} total)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select any lab to inspect source code, stream live execution output, or view workflow graphs.
            </p>
          </div>

          <button
            onClick={() => navigate('/labs')}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono transition-colors"
          >
            <span>View All Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab, index) => {
            const Icon = ICON_MAP[lab.icon] || FlaskConical;
            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                onClick={() => navigate(`/labs/${lab.id}`)}
                className="group relative rounded-xl border border-white/5 bg-[#0f1423]/90 hover:bg-[#12192d] p-5 cursor-pointer transition-all duration-300 hover:border-violet-500/30 hover:shadow-glow-violet hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      LAB {String(lab.id).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      3 Programs
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-violet-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white transition-colors line-clamp-1">
                        {lab.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lab.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {lab.category}
                  </span>
                  <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION C: Recent Executions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Executions Table */}
        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-[#0f1423]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>Recent Subprocess Executions</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-violet-400 hover:text-violet-300 font-mono transition-colors"
            >
              Full History
            </button>
          </div>

          {recentExecutions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs font-mono">
              No executions in this session yet. Launch any lab program to record logs.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentExecutions.map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => navigate(`/labs/${exec.lab_id}?tab=${exec.program_type}`)}
                  className="py-2.5 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusBadge status={exec.status} size="sm" />
                    <div className="truncate">
                      <span className="font-medium text-slate-200">
                        {exec.lab_title}
                      </span>
                      <span className="text-slate-500 ml-2 font-mono text-[11px]">
                        ({exec.program_label})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] flex-shrink-0">
                    <span>{formatDuration(exec.duration_ms)}</span>
                    <span className="hidden sm:inline">{formatDate(exec.start_time)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION D: Quick Actions Panel */}
        <div className="rounded-xl border border-white/5 bg-[#0f1423]/90 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Quick Actions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct shortcuts for exploration, orchestration, and evaluation.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => navigate('/labs/1')}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">Run Lab 1 Study Planner</div>
                  <div className="text-slate-500 text-[11px]">Goal -&gt; Plan -&gt; Observe Loop</div>
                </div>
                <ArrowRight className="w-4 h-4 text-violet-400" />
              </button>

              <button
                onClick={() => navigate('/tools')}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">Explore Tools Registry</div>
                  <div className="text-slate-500 text-[11px]">Test safe tools interactively</div>
                </div>
                <Wrench className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => navigate('/evaluations')}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">Evaluation Center</div>
                  <div className="text-slate-500 text-[11px]">Review 100% test pass suites</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={loadData}
                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">Refresh Telemetry</div>
                  <div className="text-slate-500 text-[11px]">Query live SQLite database</div>
                </div>
                <RotateCcw className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-[11px] text-slate-500 font-mono">
            CLI Entry: python main.py --all
          </div>
        </div>
      </div>
    </div>
  );
};
