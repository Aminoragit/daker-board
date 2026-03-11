'use client';

import { useEffect, useState } from 'react';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import RankingTable from '@/components/rankings/RankingTable';
import SectionTitle from '@/components/ui/SectionTitle';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import PageTransition from '@/components/layout/PageTransition';
import { cn } from '@/lib/utils';

const periods = [
  { value: 'recent7', label: 'RECENT 7D' },
  { value: 'recent30', label: 'RECENT 30D' },
  { value: 'all', label: 'ALL TIME' },
];

export default function RankingsPage() {
  const { globalRankings, initialized, init } = useLeaderboardStore();
  const [period, setPeriod] = useState('all');

  useEffect(() => { init(); }, [init]);

  if (!initialized) return <LoadingState />;

  return (
    <PageTransition>
      <div className="flex items-center gap-3 mb-6">
        <SectionTitle>GLOBAL RANKINGS</SectionTitle>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {periods.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              'font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border transition-all',
              period === p.value
                ? 'border-[--accent] text-[--accent] bg-[--accent]/10'
                : 'border-[--border] text-[--text-secondary] hover:border-[--text-secondary]'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {globalRankings.length === 0 ? (
        <EmptyState message="NO RANKING DATA" />
      ) : (
        <RankingTable rankings={globalRankings} />
      )}
    </PageTransition>
  );
}
