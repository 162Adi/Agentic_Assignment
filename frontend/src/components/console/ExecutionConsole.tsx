import React, { useEffect, useRef, useState } from 'react';
import { useExecutionStore, ConsoleLine } from '../../stores/useExecutionStore';
import { StatusBadge } from '../common/StatusBadge';
import {
  Terminal,
  Trash2,
  Copy,
  Download,
  Check,
  Play,
  Square,
  Clock,
  ArrowDown,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDuration } from '../../utils/format';

interface ExecutionConsoleProps {
  onRun?: () => void;
  onStop?: () => void;
  programTitle?: string;
  className?: string;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  onRun,
  onStop,
  programTitle,
  className,
}) => {
  const {
    logs,
    isRunning,
    status,
    durationMs,
    exitCode,
    clearConsole,
    autoScroll,
    setAutoScroll,
  } = useExecutionStore();

  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [liveElapsedMs, setLiveElapsedMs] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Live timer while running
  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now();
      setLiveElapsedMs(0);
      timerRef.current = setInterval(() => {
        setLiveElapsedMs(Date.now() - startTime);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const rawText = logs.map((l) => l.text).join('');
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    toast.success('Execution logs copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const rawText = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([rawText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution_log_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Log file downloaded');
  };

  const filteredLogs = filterText
    ? logs.filter((l) => l.text.toLowerCase().includes(filterText.toLowerCase()))
    : logs;

  const renderLogLine = (line: ConsoleLine, index: number) => {
    let colorClass = 'text-slate-300';
    if (line.type === 'stderr') colorClass = 'text-rose-400';
    if (line.type === 'system') colorClass = 'text-cyan-400 font-semibold';
    if (line.type === 'info') colorClass = 'text-violet-300';

    // Syntax heuristics
    const text = line.text;
    if (text.includes('[COMPLETED]') || text.includes('PASS') || text.includes('True')) {
      colorClass = 'text-emerald-400 font-medium';
    } else if (text.includes('[FAILED]') || text.includes('FAIL') || text.includes('Error')) {
      colorClass = 'text-rose-400 font-medium';
    } else if (text.startsWith('===') || text.startsWith('---')) {
      colorClass = 'text-violet-400 font-semibold';
    }

    return (
      <div key={line.id || index} className="flex items-start gap-2 py-0.5 leading-relaxed hover:bg-white/[0.02] px-1 rounded">
        <span className="text-[10px] text-slate-500 select-none font-mono pt-0.5 min-w-[55px]">
          {line.timestamp}
        </span>
        <pre className={`font-mono text-xs whitespace-pre-wrap flex-1 break-all ${colorClass}`}>
          {line.text}
        </pre>
      </div>
    );
  };

  return (
    <div className={`flex flex-col rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-[#090d16] overflow-hidden shadow-lg ${className}`}>
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0e1322] border-b border-white/5 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-violet-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              TERMINAL OUTPUT
            </span>
          </div>

          <StatusBadge status={status} size="sm" />

          {isRunning ? (
            <span className="flex items-center gap-1 text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              <Clock className="w-3 h-3 animate-spin" />
              {formatDuration(liveElapsedMs)}
            </span>
          ) : durationMs > 0 ? (
            <span className="text-xs font-mono text-slate-400">
              Duration: {formatDuration(durationMs)}
            </span>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search in log */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter output..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 w-28 sm:w-36 font-mono"
            />
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded text-xs transition-colors ${
              autoScroll ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-colors"
            title="Copy all output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            onClick={handleDownloadLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 transition-colors"
            title="Download log"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={clearConsole}
            disabled={logs.length === 0 || isRunning}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 disabled:opacity-40 transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Run / Stop Primary Action */}
          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-sm active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop
            </button>
          ) : (
            onRun && (
              <button
                onClick={onRun}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-glow-violet active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run
              </button>
            )
          )}
        </div>
      </div>

      {/* Terminal View Area */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs max-h-[480px] min-h-[260px] bg-[#070a12] select-text">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center select-none">
            <Terminal className="w-8 h-8 mb-2 opacity-30 text-violet-400" />
            <p className="font-mono text-xs">Ready for execution.</p>
            <p className="text-[11px] text-slate-600 mt-1">
              Click &quot;Run Program&quot; above to launch the Python subprocess and stream live stdout/stderr.
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredLogs.map(renderLogLine)}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#090d16] border-t border-white/5 text-[11px] font-mono text-slate-500">
        <div>
          {programTitle ? <span>Target: <span className="text-slate-300">{programTitle}</span></span> : <span>Process Shell (Python 3.13)</span>}
        </div>
        <div className="flex items-center gap-3">
          <span>Lines: {logs.length}</span>
          {exitCode !== null && <span>Exit: {exitCode}</span>}
        </div>
      </div>
    </div>
  );
};
