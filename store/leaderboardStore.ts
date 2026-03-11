import { create } from 'zustand';
import type { Leaderboard, GlobalRankingEntry } from '@/data/types';
import { SEED_LEADERBOARDS, SEED_GLOBAL_RANKINGS } from '@/data/seed';

interface LeaderboardStore {
  leaderboards: Leaderboard[];
  globalRankings: GlobalRankingEntry[];
  initialized: boolean;
  init: () => void;
  getLeaderboard: (slug: string) => Leaderboard | undefined;
  getGlobalRankings: () => GlobalRankingEntry[];
}

export const useLeaderboardStore = create<LeaderboardStore>((set, get) => ({
  leaderboards: [],
  globalRankings: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    let leaderboards: Leaderboard[];
    let globalRankings: GlobalRankingEntry[];

    try {
      const stored = localStorage.getItem('daker_leaderboards');
      leaderboards = stored ? JSON.parse(stored) : SEED_LEADERBOARDS;
      if (!stored) localStorage.setItem('daker_leaderboards', JSON.stringify(SEED_LEADERBOARDS));
    } catch {
      leaderboards = SEED_LEADERBOARDS;
    }

    try {
      const stored = localStorage.getItem('daker_global_rankings');
      globalRankings = stored ? JSON.parse(stored) : SEED_GLOBAL_RANKINGS;
      if (!stored) localStorage.setItem('daker_global_rankings', JSON.stringify(SEED_GLOBAL_RANKINGS));
    } catch {
      globalRankings = SEED_GLOBAL_RANKINGS;
    }

    set({ leaderboards, globalRankings, initialized: true });
  },

  getLeaderboard: (slug) => get().leaderboards.find(l => l.hackathonSlug === slug),
  getGlobalRankings: () => get().globalRankings,
}));
