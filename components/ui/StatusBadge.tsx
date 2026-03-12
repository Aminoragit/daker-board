'use client';

import type { HackathonStatus } from '@/data/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<HackathonStatus, { label: string; color: string; border: string; glow: string }> = {
  ongoing: { label: 'ONGOING', color: 'text-green-400', border: 'border-green-400/50', glow: 'shadow-[0_0_8px_rgba(74,222,128,0.3)] bg-green-400/15' },
  ended: { label: 'ENDED', color: 'text-red-400', border: 'border-red-400/50', glow: 'shadow-[0_0_8px_rgba(248,113,113,0.3)] bg-red-400/15' },
  upcoming: { label: 'UPCOMING', color: 'text-blue-400', border: 'border-blue-400/50', glow: 'shadow-[0_0_8px_rgba(96,165,250,0.3)] bg-blue-400/15' },
};

export default function StatusBadge({ status }: { status: HackathonStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-mono uppercase text-xs px-2 py-0.5 rounded-sm font-bold tracking-widest border',
      config.color,
      config.border,
      config.glow
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status === 'ongoing' ? 'bg-green-400 animate-pulse' : (status === 'ended' ? 'bg-red-400' : 'bg-blue-400'))} />
      {config.label}
    </span>
  );
}
