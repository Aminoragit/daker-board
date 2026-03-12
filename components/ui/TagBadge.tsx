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
        'font-mono uppercase text-xs px-2 py-0.5 transition-all border rounded-sm',
        active
          ? 'text-[--accent] border-[--accent] bg-[--accent]/10 text-glow font-bold'
          : 'text-[--text-secondary] border-[--border] hover:text-[--text-primary] hover:border-[--text-muted]',
        onClick ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      {tag}
    </button>
  );
}
