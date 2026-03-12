'use client';

import type { HackathonStatus } from '@/data/types';
import { cn } from '@/lib/utils';
import TagBadge from '@/components/ui/TagBadge';

const statuses: { value: HackathonStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'ongoing', label: 'ONGOING' },
  { value: 'upcoming', label: 'UPCOMING' },
  { value: 'ended', label: 'ENDED' },
];

interface HackathonFilterProps {
  activeStatus: HackathonStatus | 'all';
  onStatusChange: (status: HackathonStatus | 'all') => void;
  allTags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function HackathonFilter({ activeStatus, onStatusChange, allTags, activeTags, onTagToggle }: HackathonFilterProps) {
  return (
    <div className="space-y-4 mb-8 bg-[#000]/30 p-4 border border-[--border] tech-border">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
          <span className="text-[--accent]">&gt;</span> FILTER_BY_STATE:
        </span>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              className={cn(
                'font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-all',
                activeStatus === s.value
                  ? 'border-[--accent] text-[--accent] bg-[--accent]/10 text-glow shadow-[inset_0_0_8px_rgba(245,158,11,0.2)]'
                  : 'border-[--border] text-[--text-secondary] hover:border-[--text-primary] hover:text-[--text-primary]'
              )}
            >
              <span className={cn("opacity-50 mr-1", activeStatus === s.value && "text-[--accent] opacity-100")}>[</span>
              {s.label}
              <span className={cn("opacity-50 ml-1", activeStatus === s.value && "text-[--accent] opacity-100")}>]</span>
            </button>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-col gap-2 pt-3 border-t border-[--border]/50">
          <span className="font-mono text-[10px] text-[--text-muted] uppercase tracking-widest flex items-center gap-2">
            <span className="text-[--accent]">&gt;</span> FILTER_BY_SPEC:
          </span>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <TagBadge
                key={tag}
                tag={tag}
                active={activeTags.includes(tag)}
                onClick={() => onTagToggle(tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
