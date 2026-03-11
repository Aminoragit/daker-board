import { create } from 'zustand';
import type { Team } from '@/data/types';
import { SEED_TEAMS } from '@/data/seed';

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

    let teams: Team[];
    try {
      const stored = localStorage.getItem('daker_teams');
      teams = stored ? JSON.parse(stored) : SEED_TEAMS;
      if (!stored) localStorage.setItem('daker_teams', JSON.stringify(SEED_TEAMS));
    } catch {
      teams = SEED_TEAMS;
    }

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
