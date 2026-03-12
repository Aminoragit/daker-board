'use client';

import Link from 'next/link';
import type { Hackathon } from '@/data/types';
import StatusBadge from '@/components/ui/StatusBadge';
import TagBadge from '@/components/ui/TagBadge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTeamStore } from '@/store/teamStore';
import { Calendar } from 'lucide-react';

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const teams = useTeamStore(s => s.teams).filter(t => t.hackathonSlug === hackathon.slug);

  return (
    <Link href={`/hackathons/${hackathon.slug}`} className="block h-full outline-none">
      <div className={cn(
        'group bg-[--term-surface] border border-[--border] rounded-sm p-5 transition-all duration-300 h-full flex flex-col relative overflow-hidden tech-border',
        'hover:-translate-y-0.5 hover:border-[--accent] hover:shadow-neon-amber focus:border-[--accent]',
        hackathon.status === 'ended' && 'opacity-60'
      )}>
        {/* Decorative corner brackets */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[--border] group-hover:border-[--accent] transition-colors" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[--border] group-hover:border-[--accent] transition-colors" />

        <div className="flex items-start justify-between gap-4 mb-4 z-10">
          <StatusBadge status={hackathon.status} />
          <span className="font-mono text-[10px] text-[--text-muted] tracking-widest uppercase">
            ID: {hackathon.slug.split('-')[0]}
          </span>
        </div>
        
        <h3 className="font-sans font-bold text-[--text-primary] text-sm leading-tight mb-4 group-hover:text-glow transition-all flex-1 z-10 line-clamp-2 break-keep">
          {hackathon.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-5 z-10">
          {hackathon.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <div className="bg-[#000]/30 rounded-sm p-3 border border-[--border]/50 mb-4 z-10 group-hover:bg-[#000]/50 transition-colors">
          <div className="grid grid-cols-1 gap-1.5">
            <div className="flex items-center gap-2 font-mono text-xs whitespace-nowrap">
              <Calendar size={12} className="text-[--text-muted]" />
              <span className="text-[--text-muted] w-14 text-right">START</span>
              <span className="text-[--border] mx-1">|</span>
              <span className="text-[--text-primary] truncate">{formatDate(hackathon.period.startAt)}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs whitespace-nowrap">
              <Calendar size={12} className="text-[--text-muted]" />
              <span className="text-[--text-muted] w-14 text-right">END</span>
              <span className="text-[--border] mx-1">|</span>
              <span className="text-[--text-primary] truncate">{formatDate(hackathon.period.endAt)}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs mt-1 pt-1 border-t border-[--border]/30 whitespace-nowrap">
              <Calendar size={12} className="text-[--text-muted]" />
              <span className="text-[--text-muted] w-14 text-right">DEADLINE</span>
              <span className="text-[--border] mx-1">|</span>
              <span className="text-[--text-muted] truncate">{formatDate(hackathon.period.submissionDeadlineAt)}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[--border]/40 z-10">
          <span className="font-mono text-xs text-[--text-muted]">
            {teams.length} TEAMS
          </span>
          <span className="font-mono text-xs font-bold text-[--accent] flex items-center gap-1">
            VIEW →
          </span>
        </div>
      </div>
    </Link>
  );
}
