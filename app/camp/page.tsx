'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useTeamStore } from '@/store/teamStore';
import { useHackathonStore } from '@/store/hackathonStore';
import TeamCard from '@/components/camp/TeamCard';
import TeamCreateModal from '@/components/camp/TeamCreateModal';
import CampFilter from '@/components/camp/CampFilter';
import SectionTitle from '@/components/ui/SectionTitle';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import PageTransition from '@/components/layout/PageTransition';

function CampContent() {
  const teamStore = useTeamStore();
  const hackathonStore = useHackathonStore();
  const searchParams = useSearchParams();

  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      teamStore.init();
      hackathonStore.init();
      const h = searchParams.get('hackathon');
      if (h) setSelectedHackathon(h);
    } catch {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let result = teamStore.teams;
    if (selectedHackathon) {
      result = result.filter(t => t.hackathonSlug === selectedHackathon);
    }
    if (openOnly) {
      result = result.filter(t => t.isOpen);
    }
    if (selectedRoles.length > 0) {
      result = result.filter(t => selectedRoles.some(r => t.lookingFor.includes(r)));
    }
    return result;
  }, [teamStore.teams, selectedHackathon, openOnly, selectedRoles]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  if (error) return <ErrorState message="FAILED TO LOAD TEAMS" onRetry={() => { setError(false); teamStore.init(); hackathonStore.init(); }} />;
  if (!teamStore.initialized || !hackathonStore.initialized) return <LoadingState />;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SectionTitle>TEAM CAMP</SectionTitle>
          <span className="font-mono text-xs text-[--accent] bg-[--accent]/10 px-2 py-0.5 rounded-sm">
            {filtered.length}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[--accent] text-black font-mono font-bold text-xs px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          <Plus size={14} />
          CREATE TEAM
        </button>
      </div>

      <CampFilter
        hackathons={hackathonStore.hackathons}
        selectedHackathon={selectedHackathon}
        onHackathonChange={setSelectedHackathon}
        openOnly={openOnly}
        onOpenOnlyChange={setOpenOnly}
        selectedRoles={selectedRoles}
        onRoleToggle={toggleRole}
      />

      {filtered.length === 0 ? (
        <EmptyState message="NO TEAMS FOUND" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(team => (
            <TeamCard key={team.teamCode} team={team} />
          ))}
        </div>
      )}

      <TeamCreateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        hackathons={hackathonStore.hackathons}
      />
    </PageTransition>
  );
}

export default function CampPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CampContent />
    </Suspense>
  );
}
