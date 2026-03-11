'use client';

import { cn } from '@/lib/utils';
import type { Hackathon } from '@/data/types';

const roles = ['Backend', 'Frontend', 'Designer', 'ML Engineer', 'PM', 'Other'];

interface CampFilterProps {
  hackathons: Hackathon[];
  selectedHackathon: string;
  onHackathonChange: (slug: string) => void;
  openOnly: boolean;
  onOpenOnlyChange: (v: boolean) => void;
  selectedRoles: string[];
  onRoleToggle: (role: string) => void;
}

export default function CampFilter({
  hackathons, selectedHackathon, onHackathonChange,
  openOnly, onOpenOnlyChange,
  selectedRoles, onRoleToggle,
}: CampFilterProps) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedHackathon}
          onChange={e => onHackathonChange(e.target.value)}
          className="bg-[--bg-base] border border-[--border] rounded px-3 py-1.5 font-mono text-xs text-[--text-primary] focus:border-[--accent] focus:outline-none"
        >
          <option value="">ALL HACKATHONS</option>
          {hackathons.map(h => (
            <option key={h.slug} value={h.slug}>{h.title}</option>
          ))}
        </select>

        <button
          onClick={() => onOpenOnlyChange(!openOnly)}
          className={cn(
            'font-mono text-xs px-3 py-1.5 rounded border transition-all',
            openOnly
              ? 'border-green-400 text-green-400 bg-green-400/10'
              : 'border-[--border] text-[--text-secondary] hover:border-[--text-secondary]'
          )}
        >
          OPEN ONLY
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => onRoleToggle(role)}
            className={cn(
              'font-mono text-xs px-2 py-0.5 rounded-sm border transition-all',
              selectedRoles.includes(role)
                ? 'border-[--accent] text-[--accent] bg-[--accent]/10'
                : 'border-[--border] text-[--text-secondary] hover:border-[--text-secondary]'
            )}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
