'use client';

import { useState } from 'react';
import type { HackathonDetail } from '@/data/types';
import { useSubmissionStore } from '@/store/submissionStore';
import SectionTitle from '@/components/ui/SectionTitle';

export default function SubmitSection({ detail }: { detail: HackathonDetail }) {
  const { submit } = detail.sections;
  const addSubmission = useSubmissionStore(s => s.addSubmission);
  const [teamName, setTeamName] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [itemInputs, setItemInputs] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    if (submit.submissionItems) {
      submit.submissionItems.forEach(item => {
        addSubmission({
          id: `${Date.now()}-${item.key}`,
          hackathonSlug: detail.slug,
          teamName: teamName.trim(),
          submittedAt: new Date().toISOString(),
          artifactType: item.format,
          content: itemInputs[item.key] || '',
          notes: notes || undefined,
        });
      });
    } else {
      addSubmission({
        id: String(Date.now()),
        hackathonSlug: detail.slug,
        teamName: teamName.trim(),
        submittedAt: new Date().toISOString(),
        artifactType: submit.allowedArtifactTypes[0] || 'text',
        content: content.trim(),
        notes: notes || undefined,
      });
    }

    setSubmitted(true);
    setTeamName('');
    setContent('');
    setNotes('');
    setItemInputs({});
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionTitle>SUBMISSION GUIDE</SectionTitle>

      <div className="space-y-2">
        {submit.guide.map((g, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="font-mono text-xs text-[--accent] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-sm font-sans text-[--text-primary]">{g}</p>
          </div>
        ))}
      </div>

      {submit.submissionItems && (
        <div className="space-y-2">
          <SectionTitle>SUBMISSION ITEMS</SectionTitle>
          {submit.submissionItems.map((item, i) => (
            <div key={item.key} className="bg-[--bg-elevated] border border-[--border] rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-[--accent]">STEP {i + 1}</span>
                <span className="font-mono text-xs text-[--text-muted]">({item.format})</span>
              </div>
              <p className="text-sm font-sans text-[--text-primary]">{item.title}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[--border] pt-6">
        <SectionTitle>SUBMIT</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">TEAM NAME *</label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
              placeholder="팀 이름 입력"
            />
          </div>

          {submit.submissionItems ? (
            submit.submissionItems.map(item => (
              <div key={item.key}>
                <label className="font-mono text-xs text-[--text-secondary] block mb-1">
                  {item.title} ({item.format})
                </label>
                <input
                  type={item.format.includes('url') ? 'url' : 'text'}
                  value={itemInputs[item.key] || ''}
                  onChange={e => setItemInputs(prev => ({ ...prev, [item.key]: e.target.value }))}
                  className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
                  placeholder={item.format.includes('url') ? 'https://...' : '내용 입력'}
                />
              </div>
            ))
          ) : (
            <div>
              <label className="font-mono text-xs text-[--text-secondary] block mb-1">
                {submit.allowedArtifactTypes.includes('zip') ? 'FILE NAME' :
                 submit.allowedArtifactTypes.includes('url') ? 'URL' : 'CONTENT'}
              </label>
              {submit.allowedArtifactTypes.includes('text') ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors resize-none"
                  placeholder="내용 입력"
                />
              ) : (
                <input
                  type="text"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
                  placeholder={submit.allowedArtifactTypes.includes('url') ? 'https://...' : '파일명 입력'}
                />
              )}
            </div>
          )}

          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">NOTES (OPTIONAL)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors resize-none"
              placeholder="추가 메모"
            />
          </div>

          <button
            type="submit"
            className="bg-[--accent] text-black font-mono font-bold text-sm px-6 py-2 rounded hover:brightness-110 transition-all"
          >
            제출
          </button>

          {submitted && (
            <p className="font-mono text-xs text-green-400">✓ SUBMISSION RECORDED SUCCESSFULLY</p>
          )}
        </form>
      </div>
    </div>
  );
}
