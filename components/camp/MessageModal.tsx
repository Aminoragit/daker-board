'use client';

import { useState } from 'react';
import type { Team } from '@/data/types';
import { useMessageStore } from '@/store/messageStore';
import Modal from '@/components/ui/Modal';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

export default function MessageModal({ isOpen, onClose, team }: MessageModalProps) {
  const sendMessage = useMessageStore(s => s.sendMessage);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) {
      setError('닉네임과 내용은 필수입니다.');
      return;
    }

    sendMessage({
      id: `MSG-${Date.now()}`,
      fromNickname: nickname.trim(),
      toTeamCode: team.teamCode,
      toTeamName: team.name,
      hackathonSlug: team.hackathonSlug,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    });

    setSent(true);
    setNickname('');
    setContent('');
    setError('');
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="SEND MESSAGE">
      {sent ? (
        <div className="flex flex-col items-center py-8 gap-3">
          <p className="font-mono text-sm text-green-400">✓ MESSAGE SENT</p>
          <p className="font-mono text-xs text-[--text-muted]">→ {team.name}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="font-mono text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              ERROR: {error}
            </p>
          )}

          <div className="bg-[--bg-elevated] border border-[--border] rounded p-3">
            <p className="font-mono text-xs text-[--text-muted]">TO</p>
            <p className="font-sans text-sm text-[--text-primary] font-bold">{team.name}</p>
            <p className="font-mono text-xs text-[--text-muted]">{team.teamCode}</p>
          </div>

          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">YOUR NICKNAME *</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none"
              placeholder="닉네임 입력"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">MESSAGE *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={4}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none resize-none"
              placeholder="쪽지 내용을 입력하세요"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[--accent] text-black font-mono font-bold text-sm py-2 rounded hover:brightness-110 transition-all"
          >
            쪽지 보내기
          </button>
        </form>
      )}
    </Modal>
  );
}
