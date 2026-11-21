import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Play,
  Square,
  FileCode,
  GitBranch,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { fetchLabDetail, fetchSourceCode, launchExecution, stopExecution, fetchLabArchitecture } from '../services/api';
import { LabDetail, ProgramMetadata, LabArchitecture } from '../types';
import { useExecutionStore } from '../stores/useExecutionStore';
import { ExecutionConsole } from '../components/console/ExecutionConsole';
import { CodeViewer } from '../components/common/CodeViewer';
import { WorkflowVisualizer } from '../components/graph/WorkflowVisualizer';
import { subscribeToExecutionStream } from '../services/sse';
import { toast } from 'sonner';

export const LabDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const labId = parseInt(id || '1', 10);
  const tabParam = (searchParams.get('tab') as 'main' | 'assignment_1' | 'assignment_2') || 'main';

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [architecture, setArchitecture] = useState<LabArchitecture | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'assignment_1' | 'assignment_2'>(tabParam);
  const [activeView, setActiveView] = useState<'console' | 'code' | 'workflow' | 'readme'>('console');
  const [sourceCode, setSourceCode] = useState<string>('');
  const [sourceFilename, setSourceFilename] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const {
    currentExecutionId,
    isRunning,
    startExecution,
    appendLog,
    finishExecution,
    clearConsole,
  } = useExecutionStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Load lab details and architecture
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchLabDetail(labId),
      fetchLabArchitecture(labId).catch(() => null),
    ])
      .then(([l, arch]) => {
        setLab(l);
        if (arch) setArchitecture(arch);
      })
      .catch((err) => {
        toast.error('Failed to load lab data');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [labId]);

  // Sync tab with URL search parameter
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Load source code when active tab changes or code view opened
  useEffect(() => {
    fetchSourceCode(labId, activeTab)
      .then((data) => {
        setSourceCode(data.source_code);
        setSourceFilename(data.filename);
      })
      .catch(() => {});
  }, [labId, activeTab]);

  const handleTabChange = (tab: 'main' | 'assignment_1' | 'assignment_2') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleRunProgram = async () => {
    if (isRunning) {
      toast.warning('A program is already running. Please wait or stop it.');
      return;
    }

    try {
      clearConsole();
      setActiveView('console');
      toast.info(`Launching ${activeTab === 'main' ? 'Reference Program' : activeTab === 'assignment_1' ? 'Assignment 1' : 'Assignment 2'}...`);

      const resp = await launchExecution(labId, activeTab);
      startExecution(resp.execution_id);

      // Clean prior stream
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Subscribe to real SSE stream from Python subprocess
      unsubscribeRef.current = subscribeToExecutionStream(resp.execution_id, {
        onEvent: (event) => {
          if (event.type === 'stdout' && event.content) {
            appendLog('stdout', event.content);
          } else if (event.type === 'stderr' && event.content) {
            appendLog('stderr', event.content);
          } else if (event.type === 'end') {
            finishExecution(
              (event.status as any) || 'success',
              event.exit_code,
              event.duration_ms
            );
            if (event.status === 'success') {
              toast.success(`Lab ${labId} execution completed successfully`);
            } else if (event.status === 'stopped') {
              toast.warning('Execution stopped by user');
            } else {
              toast.error(`Execution failed (exit code: ${event.exit_code})`);
            }
          }
        },
        onError: () => {
          // SSE closed or dropped
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Execution error');
      finishExecution('failed', -1, 0);
    }
  };

  const handleStopProgram = async () => {
    if (!currentExecutionId) return;
    try {
      await stopExecution(currentExecutionId);
      toast.info('Termination signal dispatched to Python process');
    } catch (err: any) {
      toast.error('Failed to stop process');
    }
  };

  if (loading || !lab) {
    return (
      <div className="flex items-center justify-center py-24 text-xs font-mono text-slate-400">
        Loading Lab {labId} metadata...
      </div>
    );
  }

  const currentProgram = lab.programs.find((p) => p.key === activeTab) || lab.programs[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <button
          onClick={() => navigate('/labs')}
          className="hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Labs Directory</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-violet-400">Lab {String(lab.id).padStart(2, '0')}</span>
      </div>

      {/* Lab Header Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1423]/95 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                LAB {String(lab.id).padStart(2, '0')}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {lab.category}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Offline &amp; Deterministic
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              {lab.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lab.description}
            </p>

            <div className="pt-2 text-xs text-slate-400 border-t border-white/5 mt-3">
              <span className="font-semibold text-slate-200">Learning Objective: </span>
              <span>{lab.learning_objective}</span>
            </div>
          </div>

          {/* Quick Actions & Navigation to Next/Prev Lab */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                disabled={labId <= 1}
                onClick={() => navigate(`/labs/${labId - 1}`)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-xs font-mono disabled:opacity-30 transition-colors"
              >
                &larr; Prev Lab
              </button>
              <button
                disabled={labId >= 14}
                onClick={() => navigate(`/labs/${labId + 1}`)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-xs font-mono disabled:opacity-30 transition-colors"
              >
                Next Lab &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THREE EXECUTION TABS (Reference Program, Assignment 1, Assignment 2) */}
      <div className="border-b border-white/10 flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {lab.programs.map((prog) => {
            const isTabActive = activeTab === prog.key;
            return (
              <button
                key={prog.key}
                onClick={() => handleTabChange(prog.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-mono font-medium border-t border-x transition-all duration-200 whitespace-nowrap ${
                  isTabActive
                    ? 'bg-[#0e1322] border-violet-500/30 text-white shadow-sm font-semibold'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                <FlaskConical className={`w-3.5 h-3.5 ${isTabActive ? 'text-violet-400' : 'text-slate-500'}`} />
                <span>{prog.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">({prog.filename})</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Selectors (Console, Code, Workflow Graph, Readme) */}
        <div className="flex items-center p-1 rounded-lg bg-[#0e1322] border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveView('console')}
            className={`px-3 py-1 rounded transition-colors ${
              activeView === 'console' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Console
          </button>
          <button
            onClick={() => setActiveView('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeView === 'code' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveView('workflow')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeView === 'workflow' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow</span>
          </button>
          {lab.readme_content && (
            <button
              onClick={() => setActiveView('readme')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                activeView === 'readme' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* Program Summary Card */}
      {currentProgram && (
        <div className="p-4 rounded-xl border border-white/5 bg-[#0e1322]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-200 font-semibold">{currentProgram.description}</div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              Target Output: {currentProgram.expected_output_summary}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isRunning ? (
              <button
                onClick={handleStopProgram}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Subprocess</span>
              </button>
            ) : (
              <button
                onClick={handleRunProgram}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-glow-violet active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Program</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN VIEW AREA: CONSOLE / CODE / WORKFLOW / README */}
      <div className="space-y-4">
        {activeView === 'console' && (
          <ExecutionConsole
            onRun={handleRunProgram}
            onStop={handleStopProgram}
            programTitle={`Lab ${labId} — ${currentProgram?.title || 'Program'}`}
          />
        )}

        {activeView === 'code' && (
          <CodeViewer
            code={sourceCode}
            filename={sourceFilename}
            height="540px"
          />
        )}

        {activeView === 'workflow' && architecture && (
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400">
              Interactive Workflow Graph: Drag nodes to rearrange. Click any node to inspect implementation function and contract.
            </div>
            <WorkflowVisualizer architecture={architecture} height="560px" />
          </div>
        )}

        {activeView === 'readme' && lab.readme_content && (
          <div className="rounded-xl border border-white/10 bg-[#0c101d] p-6 max-h-[560px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {lab.readme_content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
