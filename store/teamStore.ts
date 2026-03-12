import { create } from 'zustand';
import type { Team } from '@/data/types';
import { SEED_TEAMS } from '@/data/seed';

const SEED_VERSION = '2';

interface TeamStore {
  teams: Team[];
  initialized: boolean;
  init: () => void;
  getTeamsByHackathon: (slug: string) => Team[];
  addTeam: (team: Team) => void;
  updateTeam: (teamCode: string, updates: Partial<Team>) => void;
  getAllTeams: () => Team[];
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    const storedVersion = localStorage.getItem('daker_seed_version');
    const needsReseed = storedVersion !== SEED_VERSION;

    let teams: Team[];
    try {
      const stored = !needsReseed ? localStorage.getItem('daker_teams') : null;
      teams = stored ? JSON.parse(stored) : SEED_TEAMS;
      if (!stored || needsReseed) localStorage.setItem('daker_teams', JSON.stringify(SEED_TEAMS));
    } catch {
      teams = SEED_TEAMS;
    }

    if (needsReseed) localStorage.setItem('daker_seed_version', SEED_VERSION);

    set({ teams, initialized: true });
  },

  getTeamsByHackathon: (slug) => get().teams.filter(t => t.hackathonSlug === slug),

  addTeam: (team) => {
    const updated = [...get().teams, team];
    set({ teams: updated });
    try { localStorage.setItem('daker_teams', JSON.stringify(updated)); } catch {}
  },

  updateTeam: (teamCode, updates) => {
    const updated = get().teams.map(t =>
      t.teamCode === teamCode ? { ...t, ...updates } : t
    );
    set({ teams: updated });
    try { localStorage.setItem('daker_teams', JSON.stringify(updated)); } catch {}
  },

  getAllTeams: () => get().teams,
}));
