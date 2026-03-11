import { create } from 'zustand';
import type { TeamMessage } from '@/data/types';

interface MessageStore {
  messages: TeamMessage[];
  initialized: boolean;
  init: () => void;
  sendMessage: (msg: TeamMessage) => void;
  markAsRead: (msgId: string) => void;
  getMessagesForTeam: (teamCode: string) => TeamMessage[];
  getUnreadCount: () => number;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    let messages: TeamMessage[];
    try {
      const stored = localStorage.getItem('daker_messages');
      messages = stored ? JSON.parse(stored) : [];
      if (!stored) localStorage.setItem('daker_messages', JSON.stringify([]));
    } catch {
      messages = [];
    }

    set({ messages, initialized: true });
  },

  sendMessage: (msg) => {
    const updated = [...get().messages, msg];
    set({ messages: updated });
    try { localStorage.setItem('daker_messages', JSON.stringify(updated)); } catch {}
  },

  markAsRead: (msgId) => {
    const updated = get().messages.map(m =>
      m.id === msgId ? { ...m, read: true } : m
    );
    set({ messages: updated });
    try { localStorage.setItem('daker_messages', JSON.stringify(updated)); } catch {}
  },

  getMessagesForTeam: (teamCode) => get().messages.filter(m => m.toTeamCode === teamCode),

  getUnreadCount: () => get().messages.filter(m => !m.read).length,
}));
