'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HackathonDetail, TeamInvitation } from '@/data/types';
import { useTeamStore } from '@/store/teamStore';
import SectionTitle from '@/components/ui/SectionTitle';
import Modal from '@/components/ui/Modal';
import { Users, UserPlus, Check, XIcon, AlertTriangle } from 'lucide-react';

function useInvitationStore() {
  const key = 'daker_invitations';
  const getAll = (): TeamInvitation[] => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  };
  const save = (invitations: TeamInvitation[]) => {
    localStorage.setItem(key, JSON.stringify(invitations));
  };
  return { getAll, save };
}

export default function TeamsSection({ detail }: { detail: HackathonDetail }) {
  const teams = useTeamStore(s => s.teams).filter(t => t.hackathonSlug === detail.slug);
  const invStore = useInvitationStore();

  const [invitations, setInvitations] = useState<TeamInvitation[]>(() => {
    if (typeof window === 'undefined') return [];
    return invStore.getAll().filter(inv => inv.hackathonSlug === detail.slug);
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCautionModal, setShowCautionModal] = useState(false);
  const [inviteTeamCode, setInviteTeamCode] = useState('');
  const [inviteNickname, setInviteNickname] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteNickname.trim() || !inviteTeamCode) return;

    const team = teams.find(t => t.teamCode === inviteTeamCode);
    if (!team) return;

    const newInv: TeamInvitation = {
      id: `INV-${Date.now()}`,
      teamCode: inviteTeamCode,
      hackathonSlug: detail.slug,
      fromTeamName: team.name,
      toNickname: inviteNickname.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const allInvitations = [...invStore.getAll(), newInv];
    invStore.save(allInvitations);
    setInvitations(prev => [...prev, newInv]);
    setInviteNickname('');
    setShowInviteModal(false);
  };

  const handleInvitationAction = (invId: string, action: 'accepted' | 'rejected') => {
    const allInvitations = invStore.getAll().map(inv =>
      inv.id === invId ? { ...inv, status: action } : inv
    ) as TeamInvitation[];
    invStore.save(allInvitations);
    setInvitations(prev => prev.map(inv =>
      inv.id === invId ? { ...inv, status: action } : inv
    ));
  };

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  return (
    <div>
      <SectionTitle>TEAMS</SectionTitle>

      <div className="flex gap-2 mb-4">
        <Link
          href={`/camp?hackathon=${detail.slug}`}
          className="inline-flex items-center gap-2 bg-[--accent] text-black font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          <Users size={14} />
          팀 구성 / 모집 보기
        </Link>

        <button
          onClick={() => setShowCautionModal(true)}
          className="inline-flex items-center gap-2 border border-[--border] text-[--text-secondary] font-mono text-xs px-4 py-2 rounded hover:border-[--accent] hover:text-[--accent] transition-all"
        >
          <AlertTriangle size={14} />
          유의사항
        </button>

        {teams.length > 0 && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 border border-[--border] text-[--text-secondary] font-mono text-xs px-4 py-2 rounded hover:border-[--accent] hover:text-[--accent] transition-all"
          >
            <UserPlus size={14} />
            팀원 초대
          </button>
        )}
      </div>

      {pendingInvitations.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="font-mono text-xs text-[--text-muted]">PENDING INVITATIONS ({pendingInvitations.length})</p>
          {pendingInvitations.map(inv => (
            <div key={inv.id} className="bg-[--bg-elevated] border border-yellow-500/30 rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-sans text-sm text-[--text-primary]">
                  <span className="font-bold">{inv.fromTeamName}</span>
                  <span className="text-[--text-muted]"> → </span>
                  <span>{inv.toNickname}</span>
                </p>
                <p className="font-mono text-xs text-[--text-muted]">PENDING</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInvitationAction(inv.id, 'accepted')}
                  className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded border border-green-400 text-green-400 bg-green-400/10 hover:bg-green-400/20 transition-all"
                >
                  <Check size={12} />
                  수락
                </button>
                <button
                  onClick={() => handleInvitationAction(inv.id, 'rejected')}
                  className="inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded border border-red-400 text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-all"
                >
                  <XIcon size={12} />
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {invitations.filter(inv => inv.status !== 'pending').length > 0 && (
        <div className="mb-4 space-y-1">
          <p className="font-mono text-xs text-[--text-muted]">INVITATION HISTORY</p>
          {invitations.filter(inv => inv.status !== 'pending').map(inv => (
            <div key={inv.id} className="flex items-center gap-2 text-xs font-mono text-[--text-muted]">
              <span>{inv.fromTeamName} → {inv.toNickname}</span>
              <span className={inv.status === 'accepted' ? 'text-green-400' : 'text-red-400'}>
                {inv.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
              </span>
            </div>
          ))}
        </div>
      )}

      {teams.length > 0 ? (
        <div className="space-y-2 mt-4">
          {teams.slice(0, 3).map(team => (
            <div key={team.teamCode} className="bg-[--bg-elevated] border border-[--border] rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-sans font-bold text-sm text-[--text-primary]">{team.name}</p>
                <p className="font-mono text-xs text-[--text-muted]">{team.memberCount} members</p>
              </div>
              <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${team.isOpen ? 'text-green-400 bg-green-400/15' : 'text-red-400 bg-red-400/15'}`}>
                {team.isOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          ))}
          {teams.length > 3 && (
            <Link
              href={`/camp?hackathon=${detail.slug}`}
              className="block text-center font-mono text-xs text-[--accent] hover:underline py-2"
            >
              더보기 ({teams.length - 3}+) →
            </Link>
          )}
        </div>
      ) : (
        <p className="font-mono text-sm text-[--text-muted] mt-4">[ NO TEAMS YET ]</p>
      )}

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="INVITE TEAM MEMBER">
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">SELECT TEAM</label>
            <select
              value={inviteTeamCode}
              onChange={e => setInviteTeamCode(e.target.value)}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-mono focus:border-[--accent] focus:outline-none"
            >
              <option value="">팀 선택</option>
              {teams.filter(t => t.isOpen).map(t => (
                <option key={t.teamCode} value={t.teamCode}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">NICKNAME TO INVITE</label>
            <input
              type="text"
              value={inviteNickname}
              onChange={e => setInviteNickname(e.target.value)}
              required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
              placeholder="초대할 닉네임 입력"
            />
          </div>
          <button
            type="submit"
            disabled={!inviteTeamCode || !inviteNickname.trim()}
            className="w-full bg-[--accent] text-black font-mono font-bold text-sm py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            초대 보내기
          </button>
        </form>
      </Modal>

      {/* Caution Modal */}
      <Modal isOpen={showCautionModal} onClose={() => setShowCautionModal(false)} title="TEAM FORMATION GUIDELINES">
        <div className="space-y-3">
          <div className="flex gap-2 items-start">
            <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm font-sans text-[--text-primary]">
              <p>팀 구성 시 아래 사항을 반드시 확인해 주세요:</p>
              <ul className="space-y-1 text-[--text-secondary] text-xs font-mono list-none">
                <li>• 최대 팀원 수: {detail.sections.overview.teamPolicy.maxTeamSize}명</li>
                <li>• 솔로 참가: {detail.sections.overview.teamPolicy.allowSolo ? '허용' : '불가'}</li>
                <li>• 팀 구성 후 변경이 어려울 수 있습니다</li>
                <li>• 팀원 간 충분한 역할 분담을 권장합니다</li>
                <li>• 연락처(오픈카톡 등)를 반드시 기재해 주세요</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowCautionModal(false)}
            className="w-full bg-[--bg-elevated] border border-[--border] text-[--text-primary] font-mono text-sm py-2 rounded hover:border-[--accent] transition-all"
          >
            확인
          </button>
        </div>
      </Modal>
    </div>
  );
}
