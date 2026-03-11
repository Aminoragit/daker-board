'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, BarChart2 } from 'lucide-react';
import { useHackathonStore } from '@/store/hackathonStore';
import { useTeamStore } from '@/store/teamStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useSubmissionStore } from '@/store/submissionStore';
import HackathonCard from '@/components/hackathon/HackathonCard';
import SectionTitle from '@/components/ui/SectionTitle';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import PageTransition from '@/components/layout/PageTransition';

const ctaCards = [
  { href: '/hackathons', icon: Trophy, label: 'HACKATHONS', desc: '대회 목록 보기', accent: 'border-[--accent]', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]' },
  { href: '/camp', icon: Users, label: 'FIND TEAM', desc: '팀원 모집 캠프', accent: 'border-[--blue]', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' },
  { href: '/rankings', icon: BarChart2, label: 'RANKINGS', desc: '글로벌 랭킹 확인', accent: 'border-[--purple]', glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]' },
];

export default function HomePage() {
  const hackathonStore = useHackathonStore();
  const teamStore = useTeamStore();
  const leaderboardStore = useLeaderboardStore();
  const submissionStore = useSubmissionStore();
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

  if (error) {
    return <ErrorState message="FAILED TO INITIALIZE" onRetry={() => {
      setError(false);
      hackathonStore.init();
      teamStore.init();
      leaderboardStore.init();
      submissionStore.init();
    }} />;
  }

  if (!hackathonStore.initialized) return <LoadingState />;

  const ongoingCount = hackathonStore.hackathons.filter(h => h.status === 'ongoing').length;

  return (
    <PageTransition>
      {/* Hero */}
      <div className="relative py-16 sm:py-24 mb-12"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}>
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
          <span className="font-mono text-xs text-green-400 uppercase tracking-wider">SYSTEM STATUS: OPERATIONAL</span>
        </div>

        <h1 className="font-mono font-bold text-3xl sm:text-5xl lg:text-6xl text-[--accent] leading-tight mb-4">
          HACKATHON{'\n'}
          <br />
          CONTROL CENTER<span className="cursor-blink">_</span>
        </h1>

        <p className="font-sans text-[--text-secondary] text-base sm:text-lg mb-6 max-w-xl">
          바이브 코딩으로 세상을 바꾸는 개발자들의 경쟁 플랫폼
        </p>

        <div className="inline-flex items-center gap-2 bg-[--bg-surface] border border-[--border] rounded px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[--accent]" />
          <span className="font-mono text-xs text-[--accent]">{ongoingCount + hackathonStore.hackathons.length} ACTIVE EVENTS</span>
        </div>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {ctaCards.map(card => (
          <Link key={card.href} href={card.href}>
            <div className={`bg-[--bg-surface] border ${card.accent} rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 ${card.glow} text-center`}>
              <card.icon size={28} className="mx-auto mb-3 text-[--text-primary]" />
              <h3 className="font-mono font-bold text-sm text-[--text-primary] mb-1">{card.label}</h3>
              <p className="font-sans text-xs text-[--text-secondary]">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Events */}
      <SectionTitle>RECENT EVENTS</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathonStore.hackathons.slice(0, 3).map(h => (
          <HackathonCard key={h.slug} hackathon={h} />
        ))}
      </div>
    </PageTransition>
  );
}
