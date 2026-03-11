'use client';

import { cn } from '@/lib/utils';

interface TagBadgeProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}

export default function TagBadge({ tag, active, onClick }: TagBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-mono uppercase text-xs px-2 py-0.5 rounded-sm transition-all',
        'border',
        active
          ? 'border-[--accent] text-[--accent] bg-[--accent]/10'
          : 'border-[--border] text-[--text-secondary] hover:border-[--text-secondary]',
        onClick ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {tag}
    </button>
  );
}
