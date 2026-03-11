'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHackathonStore } from '@/store/hackathonStore';
import { useTeamStore } from '@/store/teamStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { getTimeUntil } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import TagBadge from '@/components/ui/TagBadge';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import DetailTabs from '@/components/hackathon/DetailTabs';
import OverviewSection from '@/components/hackathon/sections/OverviewSection';
import EvalSection from '@/components/hackathon/sections/EvalSection';
import ScheduleSection from '@/components/hackathon/sections/ScheduleSection';
import PrizeSection from '@/components/hackathon/sections/PrizeSection';
import TeamsSection from '@/components/hackathon/sections/TeamsSection';
import SubmitSection from '@/components/hackathon/sections/SubmitSection';
import LeaderboardSection from '@/components/hackathon/sections/LeaderboardSection';
import PageTransition from '@/components/layout/PageTransition';

function CountdownDisplay({ deadline }: { deadline: string }) {
  const [time, setTime] = useState(getTimeUntil(deadline));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntil(deadline)), 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (time.isPast) {
    return <span className="font-mono text-sm text-red-400 font-bold">CLOSED</span>;
  }

  return (
    <span className="font-mono text-sm text-[--accent] font-bold">
      DEADLINE IN: {time.days}D {time.hours}H {time.minutes}M
    </span>
  );
}

export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const hackathonStore = useHackathonStore();
  const teamStore = useTeamStore();
  const leaderboardStore = useLeaderboardStore();
  const submissionStore = useSubmissionStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      hackathonStore.init();
      teamStore.init();
      leaderboardStore.init();
      submissionStore.init();
    } catch {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <ErrorState message="FAILED TO LOAD EVENT" onRetry={() => { setError(false); hackathonStore.init(); teamStore.init(); leaderboardStore.init(); submissionStore.init(); }} />;
  if (!hackathonStore.initialized) return <LoadingState />;

  const detail = hackathonStore.getHackathon(slug);
  const meta = hackathonStore.getHackathonMeta(slug);

  if (!detail || !meta) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="font-mono text-lg text-red-400 font-bold">ERROR 404: EVENT NOT FOUND</p>
          <p className="font-mono text-xs text-[--text-muted]">slug: {slug}</p>
          <Link href="/hackathons"
            className="border border-[--border] text-[--text-secondary] hover:border-[--border-glow] font-mono text-xs px-4 py-2 rounded transition-all">
            ← BACK TO EVENTS
          </Link>
        </div>
      </PageTransition>
    );
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection detail={detail} />;
      case 'eval': return <EvalSection detail={detail} />;
      case 'schedule': return <ScheduleSection detail={detail} />;
      case 'prize': return <PrizeSection detail={detail} />;
      case 'teams': return <TeamsSection detail={detail} />;
      case 'submit': return <SubmitSection detail={detail} />;
      case 'leaderboard': return <LeaderboardSection detail={detail} />;
      default: return <OverviewSection detail={detail} />;
    }
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={meta.status} />
          {meta.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          <span className="font-mono text-xs text-[--text-muted]">{slug}</span>
        </div>

        <h1 className="font-sans font-bold text-xl sm:text-2xl text-[--text-primary]">
          {detail.title}
        </h1>

        <CountdownDisplay deadline={meta.period.submissionDeadlineAt} />

        <div className="flex gap-2 pt-2">
          <a href={meta.links.rules} target="_blank" rel="noopener noreferrer"
            className="border border-[--border] text-[--text-secondary] hover:border-[--border-glow] font-mono text-xs px-3 py-1.5 rounded transition-all">
            RULES
          </a>
          <a href={meta.links.faq} target="_blank" rel="noopener noreferrer"
            className="border border-[--border] text-[--text-secondary] hover:border-[--border-glow] font-mono text-xs px-3 py-1.5 rounded transition-all">
            FAQ
          </a>
        </div>
      </div>

      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
}
