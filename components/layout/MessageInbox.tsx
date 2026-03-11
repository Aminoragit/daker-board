'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';
import { useMessageStore } from '@/store/messageStore';
import { formatDate } from '@/lib/utils';

export default function MessageInbox() {
  const { messages, initialized, init, markAsRead, getUnreadCount } = useMessageStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!initialized) return null;

  const unreadCount = getUnreadCount();
  const recentMessages = [...messages].reverse().slice(0, 10);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-[--text-secondary] hover:text-[--text-primary] transition-colors p-1"
      >
        <Mail size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[--bg-surface] border border-[--border] rounded-lg shadow-2xl z-[200] overflow-hidden">
          <div className="px-4 py-3 border-b border-[--border]">
            <p className="font-mono text-xs text-[--accent] uppercase tracking-widest">
              {'// '}RECENT MESSAGES
            </p>
          </div>

          {recentMessages.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-xs text-[--text-muted]">[ NO MESSAGES ]</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recentMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => { markAsRead(msg.id); }}
                  className="w-full text-left px-4 py-3 border-b border-[--border]/40 hover:bg-[--bg-elevated] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${msg.read ? 'bg-[--text-muted]/30' : 'bg-blue-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs text-[--text-primary] font-bold truncate">
                          {msg.fromNickname}
                        </p>
                        <span className="font-mono text-[10px] text-[--text-muted] shrink-0">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[--text-muted]">→ {msg.toTeamName}</p>
                      <p className="text-xs text-[--text-secondary] font-sans mt-0.5 truncate">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
