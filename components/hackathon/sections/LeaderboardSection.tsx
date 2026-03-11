'use client';

import type { HackathonDetail } from '@/data/types';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import SectionTitle from '@/components/ui/SectionTitle';
import EmptyState from '@/components/ui/EmptyState';
import CountUp from '@/components/ui/CountUp';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ExternalLink, FileText } from 'lucide-react';

export default function LeaderboardSection({ detail }: { detail: HackathonDetail }) {
  const leaderboard = useLeaderboardStore(s => s.getLeaderboard(detail.slug));

  if (!leaderboard || leaderboard.entries.length === 0) {
    return (
      <div>
        <SectionTitle>LEADERBOARD</SectionTitle>
        <EmptyState message="NO SUBMISSIONS YET" />
      </div>
    );
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/5 border-l-2 border-l-yellow-500';
    if (rank === 2) return 'bg-gray-400/5 border-l-2 border-l-gray-400';
    if (rank === 3) return 'bg-amber-700/5 border-l-2 border-l-amber-700';
    return '';
  };

  return (
    <div>
      <SectionTitle>LEADERBOARD</SectionTitle>

      <p className="font-mono text-xs text-[--text-muted] mb-4">
        LAST UPDATED: {formatDate(leaderboard.updatedAt)}
      </p>

      <p className="text-xs text-[--text-secondary] font-sans mb-4">
        {detail.sections.leaderboard.note}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Rank</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Team</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Score</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider hidden sm:table-cell">Submitted At</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Links</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.map(entry => (
              <tr key={entry.rank} className={cn('border-b border-[--border]/40 hover:bg-[--bg-elevated] transition-colors', getRankStyle(entry.rank))}>
                <td className="font-mono text-sm text-[--accent] py-3 px-3 font-bold">
                  #{entry.rank}
                </td>
                <td className="font-sans text-sm text-[--text-primary] py-3 px-3 font-bold">
                  {entry.teamName}
                  {entry.scoreBreakdown && (
                    <span className="block font-mono text-xs text-[--text-muted] mt-0.5">
                      참가자: {entry.scoreBreakdown.participant} / 심사위원: {entry.scoreBreakdown.judge}
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <CountUp
                    target={entry.score}
                    decimals={entry.score < 1 ? 4 : 1}
                    className="font-mono text-sm text-[--text-primary] font-bold"
                  />
                </td>
                <td className="font-mono text-xs text-[--text-secondary] py-3 px-3 hidden sm:table-cell">
                  {formatDate(entry.submittedAt)}
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    {entry.artifacts?.webUrl && (
                      <a href={entry.artifacts.webUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[--accent] hover:text-[--text-primary] transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {entry.artifacts?.pdfUrl && (
                      <a href={entry.artifacts.pdfUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[--accent] hover:text-[--text-primary] transition-colors">
                        <FileText size={14} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
