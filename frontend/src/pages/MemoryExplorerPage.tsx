import React, { useEffect, useState } from 'react';
import {
  Database,
  Layers,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  Tag,
  ArrowRight,
  Info,
} from 'lucide-react';
import { fetchAllMemory } from '../services/api';
import { LabMemoryOverview } from '../types';

export const MemoryExplorerPage: React.FC = () => {
  const [memorySystems, setMemorySystems] = useState<LabMemoryOverview[]>([]);
  const [selectedLabId, setSelectedLabId] = useState<number>(4); // Default to Lab 4 Project Memory
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMemory()
      .then((data) => {
        setMemorySystems(data);
        if (data.length > 0) setSelectedLabId(data[0].lab_id);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentMem = memorySystems.find((m) => m.lab_id === selectedLabId) || memorySystems[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-medium mb-1 border border-cyan-500/20">
            <Database className="w-3.5 h-3.5" />
            <span>STATE & RETRIEVAL LAYER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Memory Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect working session context, persistent fact stores, topic-scoped retrieval, and conflict policies.
          </p>
        </div>
      </div>

      {/* Lab Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {memorySystems.map((m) => (
          <button
            key={m.lab_id}
            onClick={() => setSelectedLabId(m.lab_id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedLabId === m.lab_id
                ? 'bg-violet-600 border-violet-500 text-white font-semibold shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            <span>Lab {String(m.lab_id).padStart(2, '0')}</span>
            <span className="text-[11px] opacity-80 truncate max-w-[150px]">{m.lab_title.split('—')[1] || m.lab_title}</span>
          </button>
        ))}
      </div>

      {currentMem && (
        <div className="space-y-6">
          {/* Memory Architecture Info Box */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1423] p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20">
                  {currentMem.lab_title}
                </span>
                <h2 className="text-xl font-bold text-white font-mono mt-2">
                  {currentMem.memory_type}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {currentMem.persistence}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{currentMem.persistence_note}</span>
            </div>

            {/* Mechanism Policies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Conflict Resolution Policy
                </span>
                <p className="text-xs text-slate-200 font-mono">{currentMem.conflict_policy}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Retrieval Strategy
                </span>
                <p className="text-xs text-slate-200 font-mono">{currentMem.retrieval_strategy}</p>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              {currentMem.features.map((feat, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Stored Memory Records Timeline */}
          <div className="rounded-2xl border border-white/10 bg-[#0e1322] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Memory Records Timeline ({currentMem.sample_records.length} items)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Source-Tagged Ground Truth
              </span>
            </div>

            <div className="space-y-3">
              {currentMem.sample_records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-white/5 bg-black/30 hover:bg-black/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                        {rec.id}
                      </span>
                      <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        topic: {rec.topic}
                      </span>
                      {rec.is_stale && (
                        <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          STALE EXPIRED
                        </span>
                      )}
                      {rec.is_session && (
                        <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          WORKING SESSION
                        </span>
                      )}
                      {rec.is_long_term && (
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          PERSISTENT STORE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 font-mono mt-1">
                      {rec.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{rec.author}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rec.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
