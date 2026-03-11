'use client';

import Link from 'next/link';
import type { HackathonDetail } from '@/data/types';
import { useTeamStore } from '@/store/teamStore';
import SectionTitle from '@/components/ui/SectionTitle';
import { Users } from 'lucide-react';

export default function TeamsSection({ detail }: { detail: HackathonDetail }) {
  const teams = useTeamStore(s => s.getTeamsByHackathon(detail.slug));

  return (
    <div>
      <SectionTitle>TEAMS</SectionTitle>

      <Link
        href={`/camp?hackathon=${detail.slug}`}
        className="inline-flex items-center gap-2 bg-[--accent] text-black font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all mb-4"
      >
        <Users size={14} />
        팀 구성 / 모집 보기
      </Link>

      {teams.length > 0 ? (
        <div className="space-y-2 mt-4">
          {teams.slice(0, 3).map(team => (
            <div key={team.teamCode} className="bg-[--bg-elevated] border border-[--border] rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-sans font-bold text-sm text-[--text-primary]">{team.name}</p>
                <p className="font-mono text-xs text-[--text-muted]">{team.memberCount} members</p>
              </div>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${team.isOpen ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
                {team.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          ))}
          {teams.length > 3 && (
            <Link
              href={`/camp?hackathon=${detail.slug}`}
              className="block text-center font-mono text-xs text-[--accent] hover:underline py-2"
            >
              더보기 ({teams.length - 3}+) →
            </Link>
          )}
        </div>
      ) : (
        <p className="font-mono text-sm text-[--text-muted] mt-4">[ NO TEAMS YET ]</p>
      )}
    </div>
  );
}
