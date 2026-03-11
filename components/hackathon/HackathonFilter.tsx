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
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => onStatusChange(s.value)}
            className={cn(
              'font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-all',
              activeStatus === s.value
                ? 'border-[--accent] text-[--accent] bg-[--accent]/10'
                : 'border-[--border] text-[--text-secondary] hover:border-[--text-secondary]'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      {allTags.length > 0 && (
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
      )}
    </div>
  );
}
