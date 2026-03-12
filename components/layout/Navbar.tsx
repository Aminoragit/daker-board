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
    <nav className="sticky top-0 z-50 h-14 bg-[--term-surface]/95 backdrop-blur-md border-b border-[--border]"
      style={{ boxShadow: '0 1px 15px 0 rgba(245,158,11,0.15)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-dot shadow-neon-amber" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-400">LIVE</span>
          </span>
          <span className="text-[--accent] group-hover:text-glow transition-all duration-300">
            <span className="font-mono font-bold text-sm tracking-widest">
              DAKER_BOARD
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href}
                className={cn(
                  'font-mono text-xs uppercase tracking-[0.2em] transition-all relative py-2 group',
                  isActive ? 'text-[--accent] font-bold text-glow' : 'text-[--text-secondary] hover:text-[--text-primary]'
                )}>
                <span className={cn("mr-2 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100 text-[--accent]")}>&gt;</span>
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--accent] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </Link>
            );
          })}
          <div className="pl-4 border-l border-[--border]/60">
            <MessageInbox />
          </div>
        </div>

        {/* Mobile right */}
        <div className="flex sm:hidden items-center gap-4">
          <MessageInbox />
          <button
            className="text-[--text-secondary] hover:text-[--accent] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-[--term-surface] border-b border-[--border] animate-crt-flicker">
          {navLinks.map(link => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-6 py-4 font-mono text-sm uppercase tracking-widest border-b border-[--border]/40 flex items-center',
                  isActive ? 'text-[--accent] bg-[--accent]/5 text-glow' : 'text-[--text-secondary]'
                )}>
                <span className={cn("mr-3", isActive ? "text-[--accent]" : "opacity-0")}>&gt;</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
