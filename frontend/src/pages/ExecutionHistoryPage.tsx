import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Download,
  Copy,
  Trash2,
  ExternalLink,
  RotateCcw,
  X,
  Terminal,
} from 'lucide-react';
import { fetchExecutions, clearExecutions } from '../services/api';
import { ExecutionRecord } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDuration, formatDate } from '../utils/format';
import { toast } from 'sonner';

export const ExecutionHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedExecution, setSelectedExecution] = useState<ExecutionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await fetchExecutions({ limit: 100 });
      setExecutions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear the entire execution history from SQLite?')) {
      return;
    }
    try {
      await clearExecutions();
      setExecutions([]);
      setSelectedExecution(null);
      toast.success('Execution history cleared');
    } catch (err: any) {
      toast.error('Failed to clear history');
    }
  };

  const handleCopyLog = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Log copied to clipboard');
  };

  const handleDownloadLog = (exec: ExecutionRecord) => {
    const content = `EXECUTION LOG\nID: ${exec.id}\nLab: ${exec.lab_title}\nProgram: ${exec.program_label}\nDuration: ${exec.duration_ms}ms\nExit Code: ${exec.exit_code}\n\nSTDOUT:\n${exec.stdout}\n\nSTDERR:\n${exec.stderr}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_${exec.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Log file downloaded');
  };

  const filtered = executions.filter((e) => {
    const matchSearch =
      e.lab_title.toLowerCase().includes(search.toLowerCase()) ||
      e.program_label.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      `lab ${e.lab_id}`.includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-medium mb-1 border border-violet-500/20">
            <History className="w-3.5 h-3.5" />
            <span>SQLITE AUDIT PERSISTENCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Execution History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical records of all Python subprocess runs with stdout, stderr, timestamps, and exit codes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadHistory}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Refresh from DB"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            disabled={executions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-mono transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 w-52 font-mono"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e1322] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090d18] border-b border-white/5 text-slate-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Lab &amp; Program</th>
                <th className="px-4 py-3 font-semibold">Start Time</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Exit Code</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedExecution(item)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-200 truncate max-w-xs">
                      {item.lab_title}
                    </div>
                    <div className="text-[11px] text-violet-400">
                      {item.program_label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {formatDate(item.start_time)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {formatDuration(item.duration_ms)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      item.exit_code === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.exit_code ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExecution(item);
                      }}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-violet-300 text-xs transition-colors"
                    >
                      Inspect Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-xs font-mono">
            No execution records found.
          </div>
        )}
      </div>

      {/* Detail / Log Inspection Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0e1322] p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  EXECUTION ID: {selectedExecution.id}
                </span>
                <h3 className="font-bold text-sm text-white font-mono mt-1">
                  {selectedExecution.lab_title} — {selectedExecution.program_label}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLog(selectedExecution.stdout)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
                  title="Copy log"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadLog(selectedExecution)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
                  title="Download log"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5">
              <span>Status: <strong className="text-emerald-400">{selectedExecution.status}</strong></span>
              <span>Duration: {formatDuration(selectedExecution.duration_ms)}</span>
              <span>Exit Code: {selectedExecution.exit_code}</span>
              <span>Started: {formatDate(selectedExecution.start_time)}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#070a12] border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-wrap select-text">
              {selectedExecution.stdout || (
                <span className="text-slate-500">No stdout captured.</span>
              )}
              {selectedExecution.stderr && (
                <div className="mt-4 pt-4 border-t border-rose-500/20 text-rose-400">
                  <div className="font-bold uppercase text-[10px] text-rose-500 mb-1">STDERR:</div>
                  {selectedExecution.stderr}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs font-mono text-slate-500">
              <button
                onClick={() => navigate(`/labs/${selectedExecution.lab_id}?tab=${selectedExecution.program_type}`)}
                className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <span>Open Lab Detail View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedExecution(null)}
                className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
