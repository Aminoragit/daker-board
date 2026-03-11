'use client';

export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono uppercase text-xs tracking-[0.2em] text-[--text-secondary] mb-4">
      {'// '}{children}
    </h2>
  );
}
