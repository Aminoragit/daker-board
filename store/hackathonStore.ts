import { create } from 'zustand';
import type { Hackathon, HackathonDetail, HackathonStatus } from '@/data/types';
import { SEED_HACKATHONS, SEED_HACKATHON_DETAILS } from '@/data/seed';

const SEED_VERSION = '2';

interface HackathonStore {
  hackathons: Hackathon[];
  hackathonDetails: HackathonDetail[];
  initialized: boolean;
  init: () => void;
  getHackathon: (slug: string) => HackathonDetail | undefined;
  getHackathonMeta: (slug: string) => Hackathon | undefined;
  filterByStatus: (status: HackathonStatus) => Hackathon[];
  filterByTag: (tag: string) => Hackathon[];
}

export const useHackathonStore = create<HackathonStore>((set, get) => ({
  hackathons: [],
  hackathonDetails: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    const storedVersion = localStorage.getItem('daker_seed_version');
    const needsReseed = storedVersion !== SEED_VERSION;

    let hackathons: Hackathon[];
    let hackathonDetails: HackathonDetail[];

    try {
      const stored = !needsReseed ? localStorage.getItem('daker_hackathons') : null;
      hackathons = stored ? JSON.parse(stored) : SEED_HACKATHONS;
      if (!stored || needsReseed) localStorage.setItem('daker_hackathons', JSON.stringify(SEED_HACKATHONS));
    } catch {
      hackathons = SEED_HACKATHONS;
    }

    try {
      const stored = !needsReseed ? localStorage.getItem('daker_hackathon_details') : null;
      hackathonDetails = stored ? JSON.parse(stored) : SEED_HACKATHON_DETAILS;
      if (!stored || needsReseed) localStorage.setItem('daker_hackathon_details', JSON.stringify(SEED_HACKATHON_DETAILS));
    } catch {
      hackathonDetails = SEED_HACKATHON_DETAILS;
    }

    if (needsReseed) localStorage.setItem('daker_seed_version', SEED_VERSION);

    set({ hackathons, hackathonDetails, initialized: true });
  },

  getHackathon: (slug) => get().hackathonDetails.find(h => h.slug === slug),
  getHackathonMeta: (slug) => get().hackathons.find(h => h.slug === slug),
  filterByStatus: (status) => get().hackathons.filter(h => h.status === status),
  filterByTag: (tag) => get().hackathons.filter(h => h.tags.includes(tag)),
}));
