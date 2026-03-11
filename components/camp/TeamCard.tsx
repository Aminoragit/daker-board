'use client';

import { useState } from 'react';
import type { Team } from '@/data/types';
import { useHackathonStore } from '@/store/hackathonStore';
import { useTeamStore } from '@/store/teamStore';
import TagBadge from '@/components/ui/TagBadge';
import Modal from '@/components/ui/Modal';
import MessageModal from '@/components/camp/MessageModal';
import { ExternalLink, Edit2, ToggleLeft, ToggleRight, MessageSquare } from 'lucide-react';

const roleOptions = ['Backend', 'Frontend', 'Designer', 'ML Engineer', 'PM', 'Other'];

export default function TeamCard({ team }: { team: Team }) {
  const hackathonMeta = useHackathonStore(s => team.hackathonSlug ? s.getHackathonMeta(team.hackathonSlug) : undefined);
  const updateTeam = useTeamStore(s => s.updateTeam);

  const [msgOpen, setMsgOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(team.name);
  const [editIntro, setEditIntro] = useState(team.intro);
  const [editLookingFor, setEditLookingFor] = useState<string[]>(team.lookingFor);
  const [editContactUrl, setEditContactUrl] = useState(team.contact.url);

  const handleToggleOpen = () => {
    updateTeam(team.teamCode, { isOpen: !team.isOpen });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editIntro.trim()) return;

    updateTeam(team.teamCode, {
      name: editName.trim(),
      intro: editIntro.trim(),
      lookingFor: editLookingFor,
      contact: { type: 'link', url: editContactUrl || '#' },
    });
    setEditOpen(false);
  };

  const toggleRole = (role: string) => {
    setEditLookingFor(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <>
      <div className="bg-[--bg-surface] border border-[--border] rounded-lg p-4 transition-all duration-200 hover:border-[--border-glow] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-sans font-bold text-[--text-primary]">{team.name}</h3>
            {hackathonMeta ? (
              <p className="font-mono text-xs text-[--text-muted] mt-0.5">{hackathonMeta.title}</p>
            ) : (
              <p className="font-mono text-xs text-[--text-muted] mt-0.5">독립 팀</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-xs text-[--text-muted]">{team.teamCode}</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded-sm font-bold ${team.isOpen ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
              {team.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
        </div>

        <p className="text-sm text-[--text-secondary] font-sans mb-3">{team.intro}</p>

        <div className="mb-3">
          <div className="flex justify-between font-mono text-xs text-[--text-muted] mb-1">
            <span>MEMBERS</span>
            <span>{team.memberCount} / 5</span>
          </div>
          <div className="w-full bg-[--bg-base] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-[--accent] transition-all"
              style={{ width: `${(team.memberCount / 5) * 100}%` }}
            />
          </div>
        </div>

        {team.lookingFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {team.lookingFor.map(role => (
              <TagBadge key={role} tag={role} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={team.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[--border] text-[--text-secondary] hover:border-[--border-glow] hover:text-[--accent] font-mono text-xs px-3 py-1.5 rounded transition-all"
          >
            <ExternalLink size={12} />
            CONTACT
          </a>
          <button
            onClick={() => setMsgOpen(true)}
            className="inline-flex items-center gap-1.5 border border-[--border] text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] font-mono text-xs px-3 py-1.5 rounded transition-all"
          >
            <MessageSquare size={12} />
            MESSAGE
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 border border-[--border] text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] font-mono text-xs px-3 py-1.5 rounded transition-all"
          >
            <Edit2 size={12} />
            EDIT
          </button>
          <button
            onClick={handleToggleOpen}
            className={`inline-flex items-center gap-1.5 border font-mono text-xs px-3 py-1.5 rounded transition-all ${
              team.isOpen
                ? 'border-red-400/50 text-red-400 hover:bg-red-400/10'
                : 'border-green-400/50 text-green-400 hover:bg-green-400/10'
            }`}
          >
            {team.isOpen ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
            {team.isOpen ? 'CLOSE' : 'REOPEN'}
          </button>
        </div>
      </div>

      <MessageModal isOpen={msgOpen} onClose={() => setMsgOpen(false)} team={team} />

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="EDIT TEAM">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">TEAM NAME *</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">INTRO *</label>
            <textarea value={editIntro} onChange={e => setEditIntro(e.target.value)} required rows={3}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">LOOKING FOR</label>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map(role => (
                <button key={role} type="button" onClick={() => toggleRole(role)}
                  className={`font-mono text-xs px-2 py-0.5 rounded-sm border transition-all ${
                    editLookingFor.includes(role)
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
            <input type="text" value={editContactUrl} onChange={e => setEditContactUrl(e.target.value)}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
              placeholder="https://..." />
          </div>
          <button type="submit"
            className="w-full bg-[--accent] text-black font-mono font-bold text-sm py-2 rounded hover:brightness-110 transition-all">
            저장
          </button>
        </form>
      </Modal>
    </>
  );
}
