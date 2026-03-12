'use client';

import type { HackathonDetail } from '@/data/types';
import SectionTitle from '@/components/ui/SectionTitle';

export default function EvalSection({ detail }: { detail: HackathonDetail }) {
  const { eval: evalData } = detail.sections;

  return (
    <div className="space-y-6">
      <SectionTitle>EVALUATION</SectionTitle>

      <div className="bg-[--bg-elevated] border border-[--border] rounded-lg p-4">
        <p className="font-mono text-lg text-[--accent] font-bold mb-2">
          {evalData.metricName}
        </p>
        <p className="text-sm text-[--text-secondary] font-sans">
          {evalData.description}
        </p>
      </div>

      {evalData.limits && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[--bg-surface] border border-[--border] rounded p-3">
            <p className="font-mono text-xs text-[--text-secondary] mb-1">MAX RUNTIME</p>
            <p className="font-mono text-sm text-[--text-primary]">{evalData.limits.maxRuntimeSec}s</p>
          </div>
          <div className="bg-[--bg-surface] border border-[--border] rounded p-3">
            <p className="font-mono text-xs text-[--text-secondary] mb-1">DAILY SUBMISSIONS</p>
            <p className="font-mono text-sm text-[--text-primary]">{evalData.limits.maxSubmissionsPerDay}</p>
          </div>
        </div>
      )}

      {evalData.scoreDisplay && (
        <div className="space-y-3">
          <p className="font-mono text-xs text-[--text-secondary] uppercase tracking-wider">
            {evalData.scoreDisplay.label}
          </p>
          {evalData.scoreDisplay.breakdown.map(b => (
            <div key={b.key} className="space-y-1">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-[--text-secondary]">{b.label}</span>
                <span className="text-[--accent]">{b.weightPercent}%</span>
              </div>
              <div className="w-full bg-[--bg-base] rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[--accent] transition-all duration-500"
                  style={{ width: `${b.weightPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
