'use client';

import type { HackathonStatus } from '@/data/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<HackathonStatus, { label: string; style: string }> = {
  ongoing: { label: 'ONGOING', style: 'text-green-400 bg-green-400/15' },
  ended: { label: 'ENDED', style: 'text-red-400 bg-red-400/15' },
  upcoming: { label: 'UPCOMING', style: 'text-blue-400 bg-blue-400/15' },
};

export default function StatusBadge({ status }: { status: HackathonStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'font-mono uppercase text-xs px-2 py-0.5 rounded-sm font-bold',
      config.style
    )}>
      {config.label}
    </span>
  );
}
