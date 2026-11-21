import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bot, Wrench, ShieldCheck, ArrowRightCircle, Cpu, BookOpen, UserCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CustomAgentNodeProps {
  data: {
    label: string;
    type?: 'default' | 'input' | 'output' | 'agent' | 'tool' | 'gate' | 'skill';
    description?: string;
    relevant_function?: string;
    status?: 'idle' | 'active' | 'completed' | 'failed' | 'approval_required';
  };
  selected?: boolean;
}

export const CustomAgentNode = memo(({ data, selected }: CustomAgentNodeProps) => {
  const nodeType = data.type || 'agent';

  const typeConfig = {
    input: {
      icon: <ArrowRightCircle className="w-4 h-4 text-cyan-400" />,
      border: 'border-cyan-500/30',
      badge: 'INPUT',
      badgeColor: 'bg-cyan-500/10 text-cyan-300',
    },
    output: {
      icon: <CheckCircleIcon className="w-4 h-4 text-emerald-400" />,
      border: 'border-emerald-500/30',
      badge: 'OUTPUT',
      badgeColor: 'bg-emerald-500/10 text-emerald-300',
    },
    agent: {
      icon: <Bot className="w-4 h-4 text-violet-400" />,
      border: 'border-violet-500/30',
      badge: 'AGENT',
      badgeColor: 'bg-violet-500/10 text-violet-300',
    },
    tool: {
      icon: <Wrench className="w-4 h-4 text-amber-400" />,
      border: 'border-amber-500/30',
      badge: 'TOOL',
      badgeColor: 'bg-amber-500/10 text-amber-300',
    },
    gate: {
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      border: 'border-rose-500/30',
      badge: 'GATE',
      badgeColor: 'bg-rose-500/10 text-rose-300',
    },
    skill: {
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      border: 'border-blue-500/30',
      badge: 'SKILL',
      badgeColor: 'bg-blue-500/10 text-blue-300',
    },
    default: {
      icon: <Cpu className="w-4 h-4 text-slate-400" />,
      border: 'border-slate-500/30',
      badge: 'STEP',
      badgeColor: 'bg-slate-500/10 text-slate-300',
    },
  }[nodeType] || {
    icon: <Bot className="w-4 h-4 text-violet-400" />,
    border: 'border-violet-500/30',
    badge: 'NODE',
    badgeColor: 'bg-violet-500/10 text-violet-300',
  };

  const statusClass = {
    idle: '',
    active: 'ring-2 ring-blue-500 animate-pulse',
    completed: 'ring-1 ring-emerald-500/80',
    failed: 'ring-2 ring-rose-500',
    approval_required: 'ring-2 ring-amber-500 animate-bounce',
  }[data.status || 'idle'];

  return (
    <div
      className={cn(
        'relative px-3.5 py-2.5 rounded-xl bg-[#0f1423] border shadow-lg min-w-[170px] max-w-[220px] transition-all duration-200 cursor-pointer',
        typeConfig.border,
        selected ? 'ring-2 ring-violet-500 shadow-glow-violet scale-[1.02]' : 'hover:border-white/20',
        statusClass
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 !bg-violet-400 !border-2 !border-[#0f1423]"
      />

      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          {typeConfig.icon}
          <span className={cn("text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-white/5", typeConfig.badgeColor)}>
            {typeConfig.badge}
          </span>
        </div>
      </div>

      <div className="font-semibold text-xs text-slate-100 truncate mb-1">
        {data.label}
      </div>

      {data.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
          {data.description}
        </p>
      )}

      {data.relevant_function && (
        <div className="mt-1.5 pt-1.5 border-t border-white/5 font-mono text-[10px] text-violet-400 truncate">
          ƒ {data.relevant_function}()
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 !bg-violet-400 !border-2 !border-[#0f1423]"
      />
    </div>
  );
});

CustomAgentNode.displayName = 'CustomAgentNode';

function CheckCircleIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
