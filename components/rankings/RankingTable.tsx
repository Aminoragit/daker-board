'use client';

import type { GlobalRankingEntry } from '@/data/types';
import CountUp from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';

const medals = ['🥇', '🥈', '🥉'];

export default function RankingTable({ rankings }: { rankings: GlobalRankingEntry[] }) {
  const top3 = rankings.slice(0, 3);
  // Podium order: 2nd - 1st - 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const getRankBorder = (rank: number) => {
    if (rank === 1) return 'border-l-2 border-l-yellow-500';
    if (rank === 2) return 'border-l-2 border-l-gray-400';
    if (rank === 3) return 'border-l-2 border-l-amber-700';
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Podium */}
      <div className="flex items-end justify-center gap-4 py-6">
        {podiumOrder.map((entry) => {
          const isFirst = entry.rank === 1;
          const height = isFirst ? 'h-36' : entry.rank === 2 ? 'h-28' : 'h-24';
          return (
            <div key={entry.rank} className="flex flex-col items-center">
              <span className="text-2xl mb-2">{medals[entry.rank - 1]}</span>
              <p className="font-mono text-xs text-[--text-primary] font-bold mb-1">{entry.nickname}</p>
              <CountUp
                target={entry.points}
                suffix=" pts"
                className="font-mono text-xs text-[--accent]"
              />
              <div className={cn(
                'w-20 sm:w-28 mt-2 rounded-t',
                height,
                isFirst
                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                  : entry.rank === 2
                    ? 'bg-gray-400/15 border border-gray-400/20'
                    : 'bg-amber-700/15 border border-amber-700/20'
              )}>
                <div className="flex items-center justify-center h-full">
                  <span className="font-mono text-lg font-bold text-[--text-muted]">#{entry.rank}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Rank</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Nickname</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider">Points</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider hidden sm:table-cell">Entries</th>
              <th className="font-mono text-xs text-[--text-muted] text-left py-2 px-3 uppercase tracking-wider hidden sm:table-cell">Best Rank</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map(entry => (
              <tr key={entry.rank}
                className={cn(
                  'border-b border-[--border]/40 hover:bg-[--bg-elevated] transition-colors',
                  getRankBorder(entry.rank),
                  entry.rank > 10 && 'opacity-60'
                )}>
                <td className="font-mono text-sm text-[--accent] py-3 px-3 font-bold">
                  {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                </td>
                <td className="font-mono text-sm text-[--text-primary] py-3 px-3">{entry.nickname}</td>
                <td className="py-3 px-3">
                  <CountUp target={entry.points} className="font-mono text-sm text-[--text-primary] font-bold" />
                </td>
                <td className="font-mono text-sm text-[--text-secondary] py-3 px-3 hidden sm:table-cell">{entry.hackathonsEntered}</td>
                <td className="font-mono text-sm text-[--text-secondary] py-3 px-3 hidden sm:table-cell">#{entry.bestRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
