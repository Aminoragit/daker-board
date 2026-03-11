'use client';

import type { HackathonDetail } from '@/data/types';
import SectionTitle from '@/components/ui/SectionTitle';
import CountUp from '@/components/ui/CountUp';
import { cn } from '@/lib/utils';

const placeConfig: Record<string, { emoji: string; border: string; glow: string }> = {
  '1st': { emoji: '🥇', border: 'border-yellow-500/50', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
  '2nd': { emoji: '🥈', border: 'border-gray-400/50', glow: 'shadow-[0_0_15px_rgba(156,163,175,0.15)]' },
  '3rd': { emoji: '🥉', border: 'border-amber-700/50', glow: 'shadow-[0_0_15px_rgba(180,83,9,0.15)]' },
};

export default function PrizeSection({ detail }: { detail: HackathonDetail }) {
  const { prize } = detail.sections;

  if (!prize) {
    return (
      <div>
        <SectionTitle>PRIZE</SectionTitle>
        <p className="font-mono text-sm text-[--text-muted]">{'// PRIZE INFO NOT AVAILABLE'}</p>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle>PRIZE</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {prize.items.map(item => {
          const config = placeConfig[item.place] || { emoji: '🏅', border: 'border-[--border]', glow: '' };
          return (
            <div key={item.place} className={cn(
              'bg-[--bg-surface] border rounded-lg p-4 text-center transition-all',
              config.border, config.glow
            )}>
              <span className="text-3xl">{config.emoji}</span>
              <p className="font-mono text-xs text-[--text-secondary] mt-2 mb-1 uppercase">{item.place} Place</p>
              <CountUp
                target={item.amountKRW}
                suffix=" KRW"
                className="font-mono text-lg font-bold text-[--accent]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
