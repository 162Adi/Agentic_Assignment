import React, { useEffect, useState } from 'react';
import {
  Wrench,
  Search,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Clock,
  X,
  Sliders,
} from 'lucide-react';
import { fetchTools, testTool } from '../services/api';
import { ToolMetadata } from '../types';
import { toast } from 'sonner';

export const ToolsRegistryPage: React.FC = () => {
  const [tools, setTools] = useState<ToolMetadata[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'readonly' | 'sideeffects'>('all');
  const [loading, setLoading] = useState(true);

  // Testing modal state
  const [activeTestTool, setActiveTestTool] = useState<ToolMetadata | null>(null);
  const [testParams, setTestParams] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchTools()
      .then(setTools)
      .finally(() => setLoading(false));
  }, []);

  const openTestModal = (tool: ToolMetadata) => {
    setActiveTestTool(tool);
    setTestParams(tool.sample_input || {});
    setTestResult(null);
  };

  const handleExecuteTest = async () => {
    if (!activeTestTool) return;
    try {
      setTesting(true);
      const res = await testTool(activeTestTool.id, testParams);
      setTestResult(res);
      if (res.success) {
        toast.success(`Tool '${activeTestTool.name}' executed in ${res.execution_time_ms}ms`);
      } else {
        toast.error(`Tool error: ${res.error}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Test execution failed');
    } finally {
      setTesting(false);
    }
  };

  const filteredTools = tools.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.lab_title.toLowerCase().includes(search.toLowerCase());

    const matchType =
      filterType === 'all' ||
      (filterType === 'readonly' && t.is_read_only) ||
      (filterType === 'sideeffects' && t.has_side_effects);

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-medium mb-1 border border-amber-500/20">
            <Wrench className="w-3.5 h-3.5" />
            <span>AGENT CAPABILITIES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Tools Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discovered tool interfaces across all 14 labs. Test safe standalone tools in isolated sandbox.
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'all' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({tools.length})
            </button>
            <button
              onClick={() => setFilterType('readonly')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'readonly' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Read-Only
            </button>
            <button
              onClick={() => setFilterType('sideeffects')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'sideeffects' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-Effects
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 w-52 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-xl border border-white/5 bg-[#0e1322]/90 hover:bg-[#11182c] p-5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {tool.lab_title}
                </span>

                <div className="flex items-center gap-1.5">
                  {tool.is_read_only ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      READ-ONLY
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      SIDE-EFFECTS
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-100 font-mono truncate">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Function Signature */}
              <div className="mt-3 p-2 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-violet-300 truncate">
                def {tool.function_name}({tool.parameters.map((p) => p.name).join(', ')}) -&gt; {tool.return_type}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500 text-[11px]">
                {tool.parameters.length} parameter{tool.parameters.length !== 1 ? 's' : ''}
              </span>

              {tool.can_test_standalone && (
                <button
                  onClick={() => openTestModal(tool)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Tool</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tool Test Modal */}
      {activeTestTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1423] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white font-mono">
                  Test Tool: {activeTestTool.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveTestTool(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">{activeTestTool.description}</p>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Input Parameters
                </label>
                {activeTestTool.parameters.length === 0 ? (
                  <div className="p-2.5 rounded bg-white/5 text-slate-400 text-xs font-mono">
                    This tool takes no required parameters.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeTestTool.parameters.map((param) => (
                      <div key={param.name}>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-0.5">
                          <span>{param.name} ({param.type})</span>
                          <span>{param.description}</span>
                        </div>
                        <input
                          type="text"
                          value={testParams[param.name] ?? ''}
                          onChange={(e) =>
                            setTestParams({ ...testParams, [param.name]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleExecuteTest}
                  disabled={testing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono transition-all shadow-glow-violet disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{testing ? 'Executing...' : 'Run Test Call'}</span>
                </button>
              </div>

              {testResult && (
                <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Execution Succeeded
                    </span>
                    <span className="text-slate-400">{testResult.execution_time_ms}ms</span>
                  </div>
                  <pre className="p-2.5 rounded bg-[#070a12] text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(testResult.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
