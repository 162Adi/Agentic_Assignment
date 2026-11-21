import React from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Database,
  Wrench,
  BookOpen,
  GitBranch,
  Terminal,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const SystemArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-medium mb-1 border border-violet-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>SYSTEM TOPOLOGY &amp; PRINCIPLES</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
          System Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Technical architecture, communication protocols, isolation boundaries, and runtime execution guarantees.
        </p>
      </div>

      {/* Layer Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-violet-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">1. Proactive Agent Loop</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike reactive chatbots that only respond to user prompts, autonomous agents maintain stateful goal satisfaction conditions, formulate plans, execute tool calls, and observe environmental feedback iteratively.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-violet-300">
            Goal -&gt; Plan -&gt; Act -&gt; Observe -&gt; Revise
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Wrench className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">2. Dynamic Tool Augmentation</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Agents dynamically select and invoke structured tools with parameter validation. Invocations are audited with justification logs and execute within restricted sandboxes without shell access.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-amber-300">
            Intent -&gt; Parameter Schema -&gt; Sandbox Call -&gt; Validation
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">3. Modular Skill Capsules</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Encapsulates reusable agent competencies with clear instructions, operational constraints, and input/output contracts. Can be reused across diverse applications without altering core models.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-blue-300">
            Contract Envelope -&gt; Execution Guard -&gt; Verified Output
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">4. Multi-Tier State &amp; Memory</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strict partitioning between ephemeral working session context and long-term persistent memory stores. Features topic-scoped retrieval, provenance tracking, and conflict detection.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-300">
            Session Context + Long-Term Facts + Topic Scoping
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <GitBranch className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">5. Multi-Agent Swarms</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Coordinated parallel execution of specialized role agents (Research, Logistics, Budget, Judging). Aggregates heterogeneous outputs and conducts distributed peer critique.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-rose-300">
            Coordinator -&gt; Concurrent Roles -&gt; Merge -&gt; Consensus
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#0e1322] space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white font-mono">6. Governance &amp; Safety Shield</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Defense-in-depth safety layer enforcing role-based permissions, financial cost caps, mandatory human approval gates for high-risk actions, and tamper-evident audit ledgers.
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300">
            RBAC -&gt; Risk Assessment -&gt; Human Gate -&gt; Audit Log
          </div>
        </div>
      </div>

      {/* Integration & Execution Pipeline */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1423] p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span>Execution Isolation &amp; Telemetry Architecture</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The Agentic AI Command Center enforces strict process-level isolation for all 42 executable programs:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
            <li>Each program runs in an isolated Python subprocess via <code className="text-violet-300">asyncio.create_subprocess_exec</code> (never <code className="text-rose-300">shell=True</code>).</li>
            <li>Working directory is set to the respective lab folder to preserve local relative imports and sample datasets.</li>
            <li>Stdout and Stderr streams are ingested asynchronously without blocking FastAPI&apos;s event loop.</li>
            <li>Real-time telemetry is broadcast to the React frontend using Server-Sent Events (SSE).</li>
            <li>All execution outputs, timestamps, exit codes, and durations are permanently recorded to SQLite.</li>
            <li>Hard execution timeout limit (120 seconds) prevents infinite loops, with safe cooperative cancellation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
