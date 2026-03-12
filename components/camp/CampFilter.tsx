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
    <div className="space-y-3 mb-6 pt-2">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[--text-secondary]">
          <span>해커톤:</span>
          <div className="relative">
            <select
              value={selectedHackathon}
              onChange={e => onHackathonChange(e.target.value)}
              className="bg-transparent border-none p-0 pr-4 font-mono text-xs text-[--text-primary] focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="" className="bg-[--bg-surface]">[전체]</option>
              {hackathons.map(h => (
                <option key={h.slug} value={h.slug} className="bg-[--bg-surface]">[{h.title}]</option>
              ))}
            </select>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▾</span>
          </div>
        </label>

        <button
          onClick={() => onOpenOnlyChange(!openOnly)}
          className={cn(
            'font-mono text-xs transition-all',
            openOnly
              ? 'text-green-400 font-bold'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
        >
          [{openOnly ? '☑' : '☐'} OPEN만]
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => onRoleToggle(role)}
            className={cn(
              'font-mono text-xs uppercase tracking-wider transition-all',
              selectedRoles.includes(role)
                ? 'text-[--accent] font-bold'
                : 'text-[--text-secondary] hover:text-[--text-primary]'
            )}
          >
            [{role}]
          </button>
        ))}
      </div>
    </div>
  );
}
