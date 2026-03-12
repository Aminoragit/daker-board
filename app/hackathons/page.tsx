'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useHackathonStore } from '@/store/hackathonStore';
import { useTeamStore } from '@/store/teamStore';
import type { HackathonStatus } from '@/data/types';
import HackathonCard from '@/components/hackathon/HackathonCard';
import HackathonFilter from '@/components/hackathon/HackathonFilter';
import SectionTitle from '@/components/ui/SectionTitle';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import PageTransition from '@/components/layout/PageTransition';

function HackathonsContent() {
  const { hackathons, initialized, init } = useHackathonStore();
  const teamStore = useTeamStore();
  const searchParams = useSearchParams();

  const [activeStatus, setActiveStatus] = useState<HackathonStatus | 'all'>('all');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      init();
      teamStore.init();
      const status = searchParams.get('status');
      if (status && ['ongoing', 'upcoming', 'ended'].includes(status)) {
        setActiveStatus(status as HackathonStatus);
      }
    } catch {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach(h => h.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [hackathons]);

  const filtered = useMemo(() => {
    let result = hackathons;
    if (activeStatus !== 'all') {
      result = result.filter(h => h.status === activeStatus);
    }
    if (activeTags.length > 0) {
      result = result.filter(h => activeTags.some(t => h.tags.includes(t)));
    }
    return result;
  }, [hackathons, activeStatus, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (error) return <ErrorState message="FAILED TO LOAD EVENTS" onRetry={() => { setError(false); init(); teamStore.init(); }} />;
  if (!initialized || !teamStore.initialized) return <LoadingState />;

  return (
    <PageTransition>
      <div className="flex items-center gap-3 mb-6">
        <SectionTitle>HACKATHON EVENTS</SectionTitle>
        <span className="font-mono text-xs text-[--text-primary] bg-[--accent] px-2 py-0.5 rounded-sm shadow-neon-amber font-bold">
          TOTAL: {filtered.length}
        </span>
      </div>

      <HackathonFilter
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        allTags={allTags}
        activeTags={activeTags}
        onTagToggle={toggleTag}
      />

      {filtered.length === 0 ? (
        <EmptyState message="NO EVENTS MATCHING QUERY" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}

export default function HackathonsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HackathonsContent />
    </Suspense>
  );
}
