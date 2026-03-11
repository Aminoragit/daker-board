'use client';

import type { HackathonStatus } from '@/data/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<HackathonStatus, { label: string; color: string; bg: string }> = {
  ongoing: { label: 'ONGOING', color: 'text-green-400', bg: 'bg-green-400/15' },
  ended: { label: 'ENDED', color: 'text-red-400', bg: 'bg-red-400/15' },
  upcoming: { label: 'UPCOMING', color: 'text-blue-400', bg: 'bg-blue-400/15' },
};

export default function StatusBadge({ status }: { status: HackathonStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'font-mono uppercase text-xs px-2 py-0.5 rounded-sm font-bold tracking-wider',
      config.color,
      config.bg
    )}>
      {config.label}
    </span>
  );
}
