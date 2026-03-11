'use client';

import type { HackathonDetail } from '@/data/types';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useTeamStore } from '@/store/teamStore';
import SectionTitle from '@/components/ui/SectionTitle';
import EmptyState from '@/components/ui/EmptyState';
import CountUp from '@/components/ui/CountUp';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ExternalLink, FileText, MinusCircle } from 'lucide-react';

export default function LeaderboardSection({ detail }: { detail: HackathonDetail }) {
  const leaderboard = useLeaderboardStore(s => s.getLeaderboard(detail.slug));
  const teams = useTeamStore(s => s.teams).filter(t => t.hackathonSlug === detail.slug);

  const { eval: evalSection } = detail.sections;
  const isVoteBased = evalSection.scoreSource === 'vote';
  const scoreBreakdownConfig = evalSection.scoreDisplay?.breakdown;

  const submittedTeamNames = new Set(leaderboard?.entries.map(e => e.teamName) ?? []);
  const unsubmittedTeams = teams.filter(t => !submittedTeamNames.has(t.name));

  const hasAnyData = (leaderboard && leaderboard.entries.length > 0) || unsubmittedTeams.length > 0;

  if (!hasAnyData) {
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

      {leaderboard && (
        <p className="font-mono text-xs text-[--text-muted] mb-2">
          LAST UPDATED: {formatDate(leaderboard.updatedAt)}
        </p>
      )}

      <p className="text-xs text-[--text-secondary] font-sans mb-2">
        {detail.sections.leaderboard.note}
      </p>

      {isVoteBased && scoreBreakdownConfig && (
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="font-mono text-xs text-[--text-muted]">SCORE TYPE: VOTE</span>
          {scoreBreakdownConfig.map(b => (
            <span key={b.key} className="font-mono text-xs text-[--text-secondary] bg-[--bg-elevated] border border-[--border] rounded px-2 py-0.5">
              {b.label} {b.weightPercent}%
            </span>
          ))}
        </div>
      )}

      {!isVoteBased && evalSection.limits && (
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="font-mono text-xs text-[--text-muted]">SCORE TYPE: AUTO</span>
          <span className="font-mono text-xs text-[--text-secondary] bg-[--bg-elevated] border border-[--border] rounded px-2 py-0.5">
            Max Runtime: {evalSection.limits.maxRuntimeSec}s
          </span>
          <span className="font-mono text-xs text-[--text-secondary] bg-[--bg-elevated] border border-[--border] rounded px-2 py-0.5">
            Max Submissions/Day: {evalSection.limits.maxSubmissionsPerDay}
          </span>
        </div>
      )}

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
            {leaderboard?.entries.map(entry => (
              <tr key={entry.rank} className={cn('border-b border-[--border]/40 hover:bg-[--bg-elevated] transition-colors', getRankStyle(entry.rank))}>
                <td className="font-mono text-sm text-[--accent] py-3 px-3 font-bold">
                  #{entry.rank}
                </td>
                <td className="font-sans text-sm text-[--text-primary] py-3 px-3 font-bold">
                  {entry.teamName}
                  {isVoteBased && entry.scoreBreakdown && scoreBreakdownConfig && (
                    <span className="block font-mono text-xs text-[--text-muted] mt-0.5">
                      {scoreBreakdownConfig.map(b => {
                        const val = entry.scoreBreakdown?.[b.key as keyof typeof entry.scoreBreakdown];
                        return val !== undefined ? `${b.label}: ${val}` : null;
                      }).filter(Boolean).join(' / ')}
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

            {unsubmittedTeams.map(team => (
              <tr key={team.teamCode} className="border-b border-[--border]/40 opacity-50">
                <td className="font-mono text-sm text-[--text-muted] py-3 px-3">
                  <MinusCircle size={14} className="inline" />
                </td>
                <td className="font-sans text-sm text-[--text-muted] py-3 px-3">
                  {team.name}
                </td>
                <td className="font-mono text-xs text-red-400/80 py-3 px-3" colSpan={3}>
                  미제출
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
