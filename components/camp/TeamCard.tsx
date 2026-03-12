'use client';

import { useState } from 'react';
import type { Team } from '@/data/types';
import { useHackathonStore } from '@/store/hackathonStore';
import { useTeamStore } from '@/store/teamStore';
import TagBadge from '@/components/ui/TagBadge';
import Modal from '@/components/ui/Modal';
import MessageModal from '@/components/camp/MessageModal';
import { cn } from '@/lib/utils';

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
      <div className={cn(
        "group bg-[--term-surface] border border-[--border] rounded-sm p-5 transition-all duration-300 relative tech-border",
        "hover:-translate-y-0.5 hover:border-[--accent]/50 hover:shadow-neon-amber",
        !team.isOpen && "opacity-70 grayscale-[50%]"
      )}>
        {/* Terminal Header Decorator */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[--accent] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-sans font-bold text-[--text-primary] leading-tight mb-1 truncate">{team.name}</h3>
            {hackathonMeta ? (
              <p className="font-mono text-xs text-[--text-muted] truncate">{hackathonMeta.title}</p>
            ) : (
              <p className="font-mono text-xs text-[--text-muted] truncate">독립 팀</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="font-mono text-[10px] text-[--text-muted] whitespace-nowrap">{team.teamCode}</span>
            <span className={cn(
              "font-mono text-[10px] px-2 py-0.5 rounded-sm font-bold flex items-center gap-1.5 border whitespace-nowrap",
              team.isOpen ? 'text-green-400 border-green-400/30 bg-green-400/10 shadow-neon-green' : 'text-red-400 border-red-400/30 bg-red-400/10'
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", team.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400")} />
              {team.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
        </div>

        <p className="text-sm text-[--text-secondary] font-sans line-clamp-3 break-keep mb-4">{team.intro}</p>

        <div className="mb-5">
          <div className="flex justify-between font-mono text-[10px] text-[--text-secondary] mb-1.5 uppercase">
            <span>MEMBERS</span>
            <span className="text-[--text-primary] whitespace-nowrap">{team.memberCount}/5</span>
          </div>
          <div className="w-full bg-[--term-bg] border border-[--border] rounded-sm h-2 p-[1px]">
            <div
              className="h-full bg-[--accent] transition-all relative overflow-hidden"
              style={{ width: `${(team.memberCount / 5) * 100}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTAgNEw0IDBaTTQgMEwwIDRaIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
            </div>
          </div>
        </div>

        {team.lookingFor.length > 0 && (
          <div className="mb-5">
            <span className="sr-only">Looking For</span>
            <div className="flex flex-wrap gap-1.5">
              {team.lookingFor.map(role => (
                <TagBadge key={role} tag={role} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap mt-auto pt-2">
          <a
            href={team.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-bold text-[--text-secondary] hover:text-[--text-primary] transition-colors uppercase tracking-widest"
          >
            [CONTACT]
          </a>
          <button
            onClick={() => setMsgOpen(true)}
            className="font-mono text-[11px] font-bold text-[--text-secondary] hover:text-[--text-primary] transition-colors uppercase tracking-widest"
          >
            [MESSAGE]
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="font-mono text-[11px] font-bold text-[--text-secondary] hover:text-[--text-primary] transition-colors uppercase tracking-widest"
          >
            [EDIT]
          </button>
          <button
            onClick={handleToggleOpen}
            className={`font-mono text-[11px] font-bold transition-colors uppercase tracking-widest ${
              team.isOpen ? 'text-[--text-secondary] hover:font-bold hover:text-red-400' : 'text-green-400 hover:text-green-300'
            }`}
          >
            [{team.isOpen ? 'CLOSE' : 'REOPEN'}]
          </button>
        </div>
      </div>

      <MessageModal isOpen={msgOpen} onClose={() => setMsgOpen(false)} team={team} />

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="EDIT TEAM">
        <form onSubmit={handleEdit} className="space-y-5">
          <div className="space-y-1">
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">TEAM NAME *</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">INTRO *</label>
            <textarea value={editIntro} onChange={e => setEditIntro(e.target.value)} required rows={3}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none resize-none"
            />
          </div>
          <div className="space-y-2">
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
          <div className="space-y-1">
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
