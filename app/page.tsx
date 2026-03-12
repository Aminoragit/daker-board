'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, BarChart2, Server, Terminal, Activity } from 'lucide-react';
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
  { href: '/hackathons', icon: Trophy, label: 'HACKATHONS', desc: '대회 보기', accent: 'border-[--accent]', glow: 'hover:shadow-neon-amber text-[--accent]', text: 'text-[--accent]' },
  { href: '/camp', icon: Users, label: 'FIND TEAM', desc: '팀원 모집', accent: 'border-[--blue]', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:border-[--blue] text-[--blue]', text: 'text-[--blue]' },
  { href: '/rankings', icon: BarChart2, label: 'RANKINGS', desc: '랭킹 확인', accent: 'border-[--purple]', glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:border-[--purple] text-[--purple]', text: 'text-[--purple]' },
];

export default function HomePage() {
  const hackathonStore = useHackathonStore();
  const teamStore = useTeamStore();
  const leaderboardStore = useLeaderboardStore();
  const submissionStore = useSubmissionStore();
  const [error, setError] = useState(false);
  const [typedText, setTypedText] = useState('');

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

  useEffect(() => {
    const text = "바이브 코딩으로 세상을 바꾸는...";
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <ErrorState message="FAILED TO INITIALIZE SYSTEM KERNEL" onRetry={() => {
      setError(false);
      hackathonStore.init();
      teamStore.init();
      leaderboardStore.init();
      submissionStore.init();
    }} />;
  }

  if (!hackathonStore.initialized) return <LoadingState />;

  return (
    <PageTransition>
      {/* Hero */}
      <div className="relative py-16 sm:py-24 mb-12 tech-border bg-[--term-surface]/50"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}>
        <div className="absolute top-4 left-4 font-mono text-xs text-[--text-muted] opacity-50 flex items-center gap-2">
          <Activity size={14} className="text-green-500 animate-pulse" />
          <span>V 2.0.4.88 // HANDOVER_PROTOCOL</span>
        </div>
        
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-3 mb-8 bg-[--term-green-dim]/30 border border-[--term-green]/50 rounded-sm px-4 py-2 shadow-neon-green">
            <span className="w-2.5 h-2.5 rounded-full bg-[--term-green] pulse-dot" />
            <span className="font-mono text-sm text-[--term-green] font-bold uppercase tracking-[0.2em] text-glow-green">SYSTEM STATUS: OPERATIONAL</span>
          </div>

          <h1 className="font-mono font-bold text-4xl sm:text-6xl lg:text-7xl text-[--accent] leading-tight mb-6 text-glow tracking-tighter break-keep">
            HACKATHON<br/>CONTROL CENTER<span className="cursor-blink">_</span>
          </h1>

          <div className="font-mono text-[--text-secondary] text-sm sm:text-base mb-8 max-w-2xl bg-[#000]/40 p-4 border border-[--border] rounded-sm flex items-start gap-3 text-left w-full sm:w-auto mx-auto">
            <Terminal size={18} className="mt-0.5 text-[--text-secondary] shrink-0" />
            <div className="flex-1">
              <p className="text-[--text-primary] mb-1">{typedText}</p>
              <p className="text-xs text-[--text-secondary] mt-2 border-t border-[--border]/50 pt-2">
                &gt; LOADING MODULES... [OK]<br/>
                &gt; DECRYPTING HACKATHON DATA... [OK]<br/>
                &gt; READY FOR DEPLOYMENT.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-4 bg-[--term-bg] border border-[--accent]/30 rounded-sm px-6 py-3">
            <Server size={18} className="text-[--accent]" />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] text-[--text-secondary] uppercase">Active Events</span>
              <span className="font-mono text-lg font-bold text-[--text-primary] leading-none">
                {hackathonStore.hackathons.length}
              </span>
            </div>
            <div className="w-px h-8 bg-[--border] mx-2" />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[10px] text-[--text-secondary] uppercase">Total Teams</span>
              <span className="font-mono text-lg font-bold text-[--text-primary] leading-none">
                {teamStore.teams.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {ctaCards.map(card => (
          <Link key={card.href} href={card.href} className="group">
            <div className={`relative bg-[--term-surface] border border-[--border] rounded-sm p-8 transition-all duration-200 hover:-translate-y-1 ${card.glow} h-full tech-border`}>
              <div className={`absolute top-0 right-0 p-2 opacity-10 font-mono text-[64px] font-bold leading-none ${card.text}`}>
                {card.label.charAt(0)}
              </div>
              <card.icon size={36} className={`mb-5 transition-colors duration-300 ${card.text} group-hover:scale-110`} />
              <h3 className={`font-mono font-bold text-lg mb-2 tracking-wide ${card.text}`}>{card.label}</h3>
              <p className="font-sans text-sm text-[--text-secondary] font-light">{card.desc}</p>
              
              <div className="mt-6 flex items-center font-mono text-xs font-bold uppercase tracking-widest text-[--text-secondary] group-hover:text-[--text-primary] transition-colors">
                Initialize <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Events */}
      <SectionTitle>RECENT EVENTS</SectionTitle>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathonStore.hackathons.slice(0, 3).map(h => (
          <HackathonCard key={h.slug} hackathon={h} />
        ))}
      </div>
    </PageTransition>
  );
}
