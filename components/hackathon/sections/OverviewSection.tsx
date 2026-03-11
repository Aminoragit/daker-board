'use client';

import type { HackathonDetail } from '@/data/types';
import { Users, User } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

export default function OverviewSection({ detail }: { detail: HackathonDetail }) {
  const { overview, info } = detail.sections;

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>OVERVIEW</SectionTitle>
        <p className="text-[--text-primary] text-sm leading-relaxed font-sans">
          {overview.summary}
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[--bg-elevated] px-3 py-2 rounded border border-[--border]">
          <Users size={16} className="text-[--accent]" />
          <span className="font-mono text-xs text-[--text-secondary]">
            MAX TEAM: {overview.teamPolicy.maxTeamSize}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[--bg-elevated] px-3 py-2 rounded border border-[--border]">
          <User size={16} className="text-[--accent]" />
          <span className="font-mono text-xs text-[--text-secondary]">
            SOLO: {overview.teamPolicy.allowSolo ? 'ALLOWED' : 'NOT ALLOWED'}
          </span>
        </div>
      </div>

      {info.notice.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>NOTICE</SectionTitle>
          {info.notice.map((n, i) => (
            <div key={i} className="flex gap-2 text-sm text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded px-3 py-2">
              <span className="font-mono text-yellow-400 shrink-0">&gt;</span>
              <span className="font-sans">{n}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
