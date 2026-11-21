import React from 'react';
import { X, Code2, User, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { WorkflowNodeData } from '../../types';

interface NodeDetailDrawerProps {
  node: WorkflowNodeData | null;
  onClose: () => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute right-4 top-4 bottom-4 w-80 bg-[#0e1322]/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col z-20 overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
            {node.type || 'NODE'}
          </span>
          <h3 className="font-semibold text-sm text-slate-100 mt-1">{node.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
            Node Purpose
          </label>
          <p className="text-slate-300 mt-1 leading-relaxed">{node.description}</p>
        </div>

        {node.relevant_function && (
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              Python Implementation
            </label>
            <div className="mt-1 font-mono text-[11px] bg-black/40 border border-white/5 rounded p-2 text-violet-300">
              def {node.relevant_function}(...):
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          <div className="p-2 bg-white/5 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block font-mono">EXECUTION</span>
            <span className="font-medium text-slate-200 capitalize">{node.status || 'Idle'}</span>
          </div>
          <div className="p-2 bg-white/5 rounded border border-white/5">
            <span className="text-[10px] text-slate-400 block font-mono">NODE ID</span>
            <span className="font-mono text-slate-300 text-[11px] truncate block">{node.id}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-300">
          <p className="leading-snug">
            This graph represents the actual programmatic workflow executed in the original Python agent code.
          </p>
        </div>
      </div>
    </div>
  );
};
