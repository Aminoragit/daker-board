'use client';

import type { HackathonDetail } from '@/data/types';
import { formatDate } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

export default function ScheduleSection({ detail }: { detail: HackathonDetail }) {
  const { schedule } = detail.sections;
  const now = new Date();

  return (
    <div>
      <SectionTitle>SCHEDULE</SectionTitle>
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[--border]" />

        <div className="space-y-4">
          {schedule.milestones.map((m, i) => {
            const date = new Date(m.at);
            const isPast = date < now;
            const isNext = !isPast && (i === 0 || new Date(schedule.milestones[i - 1].at) < now);

            return (
              <div key={i} className="relative flex items-start gap-3">
                <div className="absolute -left-6 mt-0.5">
                  {isPast ? (
                    <div className="w-[18px] h-[18px] rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check size={12} className="text-green-400" />
                    </div>
                  ) : (
                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${
                      isNext ? 'border-[--accent] shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'border-[--border]'
                    }`}>
                      <Circle size={6} className={isNext ? 'text-[--accent] fill-[--accent]' : 'text-transparent'} />
                    </div>
                  )}
                </div>
                <div>
                  <p className={`font-mono text-xs ${isPast ? 'text-[--text-muted]' : isNext ? 'text-[--accent]' : 'text-[--text-secondary]'}`}>
                    {formatDate(m.at)}
                  </p>
                  <p className={`text-sm font-sans ${isPast ? 'text-[--text-muted]' : 'text-[--text-primary]'}`}>
                    {m.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
