'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import MessageInbox from '@/components/layout/MessageInbox';

const navLinks = [
  { href: '/hackathons', label: 'HACKATHONS' },
  { href: '/camp', label: 'CAMP' },
  { href: '/rankings', label: 'RANKINGS' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-14 bg-[--bg-surface]/90 backdrop-blur-sm border-b border-[--border]"
      style={{ boxShadow: '0 1px 0 0 rgba(245,158,11,0.3)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">LIVE</span>
          </span>
          <span className="font-mono font-bold text-[--accent] tracking-wider">DAKER_BOARD</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href}
                className={cn(
                  'font-mono text-xs uppercase tracking-widest transition-colors relative py-1',
                  isActive ? 'text-[--accent]' : 'text-[--text-secondary] hover:text-[--text-primary]'
                )}>
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent]" />
                )}
              </Link>
            );
          })}
          <MessageInbox />
        </div>

        {/* Mobile right */}
        <div className="flex sm:hidden items-center gap-3">
          <MessageInbox />
          <button
            className="text-[--text-secondary] hover:text-[--text-primary]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-[--bg-surface] border-b border-[--border]">
          {navLinks.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 font-mono text-xs uppercase tracking-widest border-b border-[--border]/40',
                  isActive ? 'text-[--accent] bg-[--accent]/5' : 'text-[--text-secondary]'
                )}>
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
