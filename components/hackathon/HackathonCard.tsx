'use client';

import Link from 'next/link';
import type { Hackathon } from '@/data/types';
import StatusBadge from '@/components/ui/StatusBadge';
import TagBadge from '@/components/ui/TagBadge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTeamStore } from '@/store/teamStore';

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const teams = useTeamStore(s => s.teams).filter(t => t.hackathonSlug === hackathon.slug);

  return (
    <Link href={`/hackathons/${hackathon.slug}`}>
      <div className={cn(
        'bg-[--bg-surface] border border-[--border] rounded-lg p-4 transition-all duration-200',
        'hover:border-[--border-glow] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5',
        hackathon.status === 'ended' && 'opacity-60'
      )}>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <StatusBadge status={hackathon.status} />
          {hackathon.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <h3 className="font-sans font-bold text-[--text-primary] mb-2 text-sm leading-snug">
          {hackathon.title}
        </h3>
        <div className="space-y-0.5 mb-2">
          <p className="font-mono text-xs text-[--text-secondary]">
            START: {formatDate(hackathon.period.startAt)}
          </p>
          <p className="font-mono text-xs text-[--text-secondary]">
            END: {formatDate(hackathon.period.endAt)}
          </p>
          <p className="font-mono text-xs text-[--text-muted]">
            DEADLINE: {formatDate(hackathon.period.submissionDeadlineAt)}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-[--border]/40 flex items-center justify-between">
          <span className="font-mono text-xs text-[--text-muted]">
            {teams.length} TEAM{teams.length !== 1 ? 'S' : ''}
          </span>
          <span className="font-mono text-xs text-[--accent]">VIEW →</span>
        </div>
      </div>
    </Link>
  );
}
