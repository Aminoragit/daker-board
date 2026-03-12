'use client';

import { cn } from '@/lib/utils';

const tabs = [
  { key: 'overview', label: '개요' },
  { key: 'eval', label: '평가' },
  { key: 'schedule', label: '일정' },
  { key: 'prize', label: '상금' },
  { key: 'teams', label: '팀' },
  { key: 'submit', label: '제출' },
  { key: 'leaderboard', label: '리더보드' },
];

interface DetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DetailTabs({ activeTab, onTabChange }: DetailTabsProps) {
  return (
    <div className="border-b border-[--border] mb-8 overflow-x-auto">
      <div className="flex gap-0 min-w-max">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'font-mono text-xs uppercase tracking-widest px-4 py-3 transition-all relative',
              activeTab === tab.key
                ? 'text-[--accent]'
                : 'text-[--text-secondary] hover:text-[--text-primary]'
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
