'use client';

import type { Team } from '@/data/types';
import { useHackathonStore } from '@/store/hackathonStore';
import TagBadge from '@/components/ui/TagBadge';
import { ExternalLink } from 'lucide-react';

export default function TeamCard({ team }: { team: Team }) {
  const hackathonMeta = useHackathonStore(s => team.hackathonSlug ? s.getHackathonMeta(team.hackathonSlug) : undefined);

  return (
    <div className="bg-[--bg-surface] border border-[--border] rounded-lg p-4 transition-all duration-200 hover:border-[--border-glow] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-sans font-bold text-[--text-primary]">{team.name}</h3>
          {hackathonMeta ? (
            <p className="font-mono text-xs text-[--text-muted] mt-0.5">{hackathonMeta.title}</p>
          ) : (
            <p className="font-mono text-xs text-[--text-muted] mt-0.5">독립 팀</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-[--text-muted]">{team.teamCode}</span>
          <span className={`font-mono text-xs px-2 py-0.5 rounded-sm font-bold ${team.isOpen ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
            {team.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
      </div>

      <p className="text-sm text-[--text-secondary] font-sans mb-3">{team.intro}</p>

      <div className="mb-3">
        <div className="flex justify-between font-mono text-xs text-[--text-muted] mb-1">
          <span>MEMBERS</span>
          <span>{team.memberCount} / 5</span>
        </div>
        <div className="w-full bg-[--bg-base] rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-[--accent] transition-all"
            style={{ width: `${(team.memberCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {team.lookingFor.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {team.lookingFor.map(role => (
            <TagBadge key={role} tag={role} />
          ))}
        </div>
      )}

      <a
        href={team.contact.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 border border-[--border] text-[--text-secondary] hover:border-[--border-glow] hover:text-[--accent] font-mono text-xs px-3 py-1.5 rounded transition-all"
      >
        <ExternalLink size={12} />
        CONTACT
      </a>
    </div>
  );
}
