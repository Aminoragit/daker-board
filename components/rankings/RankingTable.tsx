'use client';

import type { GlobalRankingEntry } from '@/data/types';
import CountUp from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';


export default function RankingTable({ rankings }: { rankings: GlobalRankingEntry[] }) {
  const top3 = rankings.slice(0, 3);
  // Podium order: 2nd - 1st - 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  const getRankBorder = (rank: number) => {
    if (rank === 1) return 'border-l-2 border-l-yellow-500 bg-yellow-500/5';
    if (rank === 2) return 'border-l-2 border-l-gray-400 bg-gray-400/5';
    if (rank === 3) return 'border-l-2 border-l-amber-600 bg-amber-700/5';
    return 'border-l-2 border-l-transparent';
  };

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <span className="text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="font-mono text-sm text-[--accent]">#{rank}</span>;
  };

  return (
    <div className="space-y-12">
      {/* Podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 py-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)] pointer-events-none" />
        {podiumOrder.map((entry) => {
          const isFirst = entry.rank === 1;
          const height = isFirst ? 'h-36' : entry.rank === 2 ? 'h-28' : 'h-24';
          const color = isFirst ? 'yellow-500' : entry.rank === 2 ? 'gray-400' : 'amber-600';
          
          return (
            <div key={entry.rank} className="flex flex-col items-center relative z-10 w-28 sm:w-36">
              <div className="mb-4 flex flex-col items-center animate-pulse-dot" style={{ animationDelay: `${entry.rank * 0.2}s` }}>
                <RankIcon rank={entry.rank} />
              </div>
              <p className="font-sans text-xs sm:text-sm text-[--text-primary] font-bold mb-1 text-center truncate w-full px-2">{entry.nickname}</p>
              <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[--accent] mb-3 bg-[#000]/50 px-2 py-0.5 rounded-sm border border-[--border]">
                <CountUp target={entry.points} /> <span>PTS</span>
              </div>
              <div className={cn(
                'w-full rounded-t-sm relative overflow-hidden tech-border',
                height,
                isFirst
                  ? 'bg-yellow-500/20 border border-yellow-500/50 shadow-[0_-10px_30px_rgba(234,179,8,0.15)]'
                  : entry.rank === 2
                    ? 'bg-gray-400/15 border border-gray-400/40'
                    : 'bg-amber-700/15 border border-amber-700/40'
              )}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-white/20 to-transparent" />
                <div className="flex items-center justify-center h-full opacity-30 font-mono text-4xl sm:text-5xl font-bold" style={{ color: `var(--${color}, currentColor)` }}>
                  {entry.rank}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="overflow-x-auto bg-[#000]/30 border border-[--border] tech-border rounded-sm">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[--border]/80 bg-[--term-surface]/50">
              <th className="font-mono text-[10px] text-[--text-muted] py-3 px-4 uppercase tracking-widest w-16">Rank</th>
              <th className="font-mono text-[10px] text-[--text-muted] py-3 px-4 uppercase tracking-widest">Nickname</th>
              <th className="font-mono text-[10px] text-[--text-muted] py-3 px-4 uppercase tracking-widest text-right">Points</th>
              <th className="font-mono text-[10px] text-[--text-muted] py-3 px-4 uppercase tracking-widest text-right hidden sm:table-cell">Entries</th>
              <th className="font-mono text-[10px] text-[--text-muted] py-3 px-4 uppercase tracking-widest text-right hidden sm:table-cell">Best Rank</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm whitespace-nowrap">
            {rankings.map(entry => (
              <tr key={entry.rank}
                className={cn(
                  'border-b border-[--border]/40 hover:bg-[--border]/20 transition-all group',
                  getRankBorder(entry.rank),
                  entry.rank > 10 && 'opacity-60 hover:opacity-100'
                )}>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center w-8">
                    {entry.rank <= 3 ? <RankIcon rank={entry.rank} /> : <span className="text-[--text-muted] group-hover:text-[--accent] transition-colors">[{entry.rank.toString().padStart(2, '0')}]</span>}
                  </div>
                </td>
                <td className="py-3 px-4 max-w-[120px] sm:max-w-[200px] truncate">
                  <span className="text-[--text-primary] group-hover:text-glow transition-all">{entry.nickname}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[--text-primary] font-bold bg-[#000]/50 px-2 py-1 rounded-sm border border-[--border] group-hover:border-[--accent]/50 transition-colors">
                    <CountUp target={entry.points} />
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-[--text-secondary] hidden sm:table-cell">{entry.hackathonsEntered}</td>
                <td className="py-3 px-4 text-right text-[--text-secondary] hidden sm:table-cell">#{entry.bestRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
