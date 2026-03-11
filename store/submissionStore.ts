import { create } from 'zustand';
import type { Submission } from '@/data/types';

interface SubmissionStore {
  submissions: Submission[];
  initialized: boolean;
  init: () => void;
  addSubmission: (submission: Submission) => void;
  getSubmissionsByHackathon: (slug: string) => Submission[];
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],
  initialized: false,

  init: () => {
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    let submissions: Submission[];
    try {
      const stored = localStorage.getItem('daker_submissions');
      submissions = stored ? JSON.parse(stored) : [];
      if (!stored) localStorage.setItem('daker_submissions', JSON.stringify([]));
    } catch {
      submissions = [];
    }

    set({ submissions, initialized: true });
  },

  addSubmission: (submission) => {
    const updated = [...get().submissions, submission];
    set({ submissions: updated });
    try { localStorage.setItem('daker_submissions', JSON.stringify(updated)); } catch {}
  },

  getSubmissionsByHackathon: (slug) => get().submissions.filter(s => s.hackathonSlug === slug),
}));
