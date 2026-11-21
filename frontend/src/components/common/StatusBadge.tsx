import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'running' | 'success' | 'failed' | 'stopped' | 'idle' | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className }) => {
  const normalized = status.toLowerCase();

  const config = {
    running: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
      label: 'Running',
      dot: 'bg-blue-400 animate-pulse',
    },
    success: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: 'Success',
      dot: 'bg-emerald-400',
    },
    failed: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: 'Failed',
      dot: 'bg-rose-400',
    },
    stopped: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Stopped',
      dot: 'bg-amber-400',
    },
    idle: {
      bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Ready',
      dot: 'bg-slate-400',
    },
  }[normalized] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    icon: <Clock className="w-3.5 h-3.5" />,
    label: status,
    dot: 'bg-slate-400',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        isSmall ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
        config.bg,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
};
