'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import RankingTable from '@/components/rankings/RankingTable';
import SectionTitle from '@/components/ui/SectionTitle';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import PageTransition from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';

const periods = [
  { value: 'recent7', label: 'RECENT 7D', days: 7 },
  { value: 'recent30', label: 'RECENT 30D', days: 30 },
  { value: 'all', label: 'ALL TIME', days: 0 },
];

export default function RankingsPage() {
  const { globalRankings, leaderboards, initialized, init } = useLeaderboardStore();
  const [period, setPeriod] = useState('all');
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      init();
    } catch {
      setError(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRankings = useMemo(() => {
    const selected = periods.find(p => p.value === period);
    if (!selected || selected.days === 0) return globalRankings;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selected.days);

    const recentTeamNames = new Set<string>();
    leaderboards.forEach(lb => {
      lb.entries.forEach(entry => {
        if (new Date(entry.submittedAt) >= cutoff) {
          recentTeamNames.add(entry.teamName);
        }
      });
    });

    if (recentTeamNames.size === 0) return [];

    return globalRankings
      .filter(r => {
        const nick = r.nickname.toLowerCase();
        return Array.from(recentTeamNames).some(tn => nick.includes(tn.toLowerCase().replace(/\s+/g, '_')));
      })
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [globalRankings, leaderboards, period]);

  if (error) return <ErrorState message="FAILED TO LOAD RANKINGS" onRetry={() => { setError(false); init(); }} />;
  if (!initialized) return <LoadingState />;

  return (
    <PageTransition>
      <div className="flex items-center gap-3 mb-6">
        <SectionTitle>GLOBAL RANKINGS</SectionTitle>
      </div>

      <div className="flex flex-col gap-2 mb-8 bg-[#000]/30 p-4 border border-[--border] tech-border">
        <span className="font-mono text-[10px] text-[--text-secondary] uppercase tracking-widest flex items-center gap-2">
          <span className="text-[--purple]">&gt;</span> TEMPORAL_FILTER:
        </span>
        <div className="flex flex-wrap gap-2">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'font-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-sm border transition-all',
                period === p.value
                  ? 'border-[--purple] text-[--purple] bg-[--purple]/10 shadow-[inset_0_0_8px_rgba(168,85,247,0.3)] text-glow'
                  : 'border-[--border] text-[--text-secondary] hover:border-[--text-primary] hover:text-[--text-primary]'
              )}
            >
              <span className={cn("opacity-50 mr-1", period === p.value && "text-[--purple] opacity-100")}>[</span>
              {p.label}
              <span className={cn("opacity-50 ml-1", period === p.value && "text-[--purple] opacity-100")}>]</span>
            </button>
          ))}
        </div>
      </div>

      {filteredRankings.length === 0 ? (
        <EmptyState message={period === 'all' ? 'NO RANKING DATA FOUND IN MATRIX' : `NO DATA FOR TIME PERIOD: ${periods.find(p => p.value === period)?.label}`} />
      ) : (
        <RankingTable rankings={filteredRankings} />
      )}
    </PageTransition>
  );
}
