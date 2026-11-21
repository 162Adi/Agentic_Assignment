import React, { useEffect, useState } from 'react';
import { GitBranch, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { fetchAllArchitectures } from '../services/api';
import { LabArchitecture } from '../types';
import { WorkflowVisualizer } from '../components/graph/WorkflowVisualizer';

export const WorkflowVisualizerPage: React.FC = () => {
  const [architectures, setArchitectures] = useState<LabArchitecture[]>([]);
  const [selectedLabId, setSelectedLabId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllArchitectures()
      .then((data) => {
        setArchitectures(data);
        if (data.length > 0) setSelectedLabId(data[0].lab_id);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentArch = architectures.find((a) => a.lab_id === selectedLabId) || architectures[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-medium mb-1 border border-violet-500/20">
            <GitBranch className="w-3.5 h-3.5" />
            <span>AGENTIC WORKFLOW VISUALIZER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Interactive Agent Workflow Visualizer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore stateful execution loops, tool dispatch trees, swarm consensus, and safety approval gates.
          </p>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {architectures.map((arch) => (
          <button
            key={arch.lab_id}
            onClick={() => setSelectedLabId(arch.lab_id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedLabId === arch.lab_id
                ? 'bg-violet-600 border-violet-500 text-white font-semibold shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            <span className="font-bold">Lab {String(arch.lab_id).padStart(2, '0')}</span>
            <span className="text-[11px] opacity-80">{arch.pattern_name}</span>
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      {currentArch ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#0e1322] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{currentArch.lab_title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {currentArch.pattern_name}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentArch.pattern_description}
              </p>
            </div>

            <div className="text-slate-400 text-xs flex items-center gap-3">
              <span>{currentArch.nodes.length} Nodes</span>
              <span>•</span>
              <span>{currentArch.edges.length} Transitions</span>
            </div>
          </div>

          <WorkflowVisualizer architecture={currentArch} height="620px" />
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 font-mono text-xs">
          Loading workflow graphs...
        </div>
      )}
    </div>
  );
};
