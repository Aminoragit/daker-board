'use client';

import { useState } from 'react';
import type { Hackathon } from '@/data/types';
import { useTeamStore } from '@/store/teamStore';
import Modal from '@/components/ui/Modal';

const roleOptions = ['Backend', 'Frontend', 'Designer', 'ML Engineer', 'PM', 'Other'];

interface TeamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathons: Hackathon[];
}

export default function TeamCreateModal({ isOpen, onClose, hackathons }: TeamCreateModalProps) {
  const addTeam = useTeamStore(s => s.addTeam);
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [hackathonSlug, setHackathonSlug] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [contactUrl, setContactUrl] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [error, setError] = useState('');

  const toggleRole = (role: string) => {
    setLookingFor(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !intro.trim()) {
      setError('팀명과 소개는 필수입니다.');
      return;
    }

    addTeam({
      teamCode: `T-${Date.now().toString(36).toUpperCase()}`,
      hackathonSlug: hackathonSlug || null,
      name: name.trim(),
      isOpen: true,
      memberCount,
      lookingFor,
      intro: intro.trim(),
      contact: { type: 'link', url: contactUrl || '#' },
      createdAt: new Date().toISOString(),
    });

    setName('');
    setIntro('');
    setHackathonSlug('');
    setLookingFor([]);
    setContactUrl('');
    setMemberCount(1);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="CREATE TEAM">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="font-mono text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
            ERROR: {error}
          </p>
        )}

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">TEAM NAME *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
            placeholder="팀 이름" />
        </div>

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">HACKATHON (OPTIONAL)</label>
          <select value={hackathonSlug} onChange={e => setHackathonSlug(e.target.value)}
            className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-mono focus:border-[--accent] focus:outline-none">
            <option value="">전체 (독립 팀)</option>
            {hackathons.map(h => (
              <option key={h.slug} value={h.slug}>{h.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">MEMBER COUNT</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
              className="w-8 h-8 flex items-center justify-center border border-[--border] rounded text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] font-mono font-bold transition-all">
              -
            </button>
            <span className="font-mono text-sm text-[--text-primary] font-bold w-6 text-center">{memberCount}</span>
            <button type="button" onClick={() => setMemberCount(Math.min(5, memberCount + 1))}
              className="w-8 h-8 flex items-center justify-center border border-[--border] rounded text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] font-mono font-bold transition-all">
              +
            </button>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">INTRO *</label>
          <textarea value={intro} onChange={e => setIntro(e.target.value)} required rows={3}
            className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none resize-none"
            placeholder="팀 소개" />
        </div>

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">LOOKING FOR</label>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map(role => (
              <button key={role} type="button" onClick={() => toggleRole(role)}
                className={`font-mono text-xs px-2 py-0.5 rounded-sm border transition-all ${
                  lookingFor.includes(role)
                    ? 'border-[--accent] text-[--accent] bg-[--accent]/10'
                    : 'border-[--border] text-[--text-secondary]'
                }`}>
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-xs text-[--text-secondary] block mb-1">CONTACT URL</label>
          <input type="text" value={contactUrl} onChange={e => setContactUrl(e.target.value)}
            className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
            placeholder="https://..." />
        </div>

        <button type="submit"
          className="w-full bg-[--accent] text-black font-mono font-bold text-sm py-2 rounded hover:brightness-110 transition-all">
          팀 생성하기
        </button>
      </form>
    </Modal>
  );
}
