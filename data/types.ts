export type HackathonStatus = 'ongoing' | 'ended' | 'upcoming';

export interface Hackathon {
  slug: string;
  title: string;
  status: HackathonStatus;
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    startAt: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

export interface HackathonDetail {
  slug: string;
  title: string;
  extraDetails?: Record<string, unknown>[];
  sections: {
    overview: {
      summary: string;
      teamPolicy: { allowSolo: boolean; maxTeamSize: number };
    };
    info: {
      notice: string[];
      links: { rules: string; faq: string };
    };
    eval: {
      metricName: string;
      description: string;
      limits?: { maxRuntimeSec: number; maxSubmissionsPerDay: number };
      scoreSource?: string;
      scoreDisplay?: {
        label: string;
        breakdown: { key: string; label: string; weightPercent: number }[];
      };
    };
    schedule: {
      timezone: string;
      milestones: { name: string; at: string }[];
    };
    prize?: {
      items: { place: string; amountKRW: number }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: { key: string; title: string; format: string }[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: { participant: number; judge: number };
  artifacts?: { webUrl?: string; pdfUrl?: string; planTitle?: string };
}

export interface Leaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

export interface Team {
  teamCode: string;
  hackathonSlug: string | null;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: { type: string; url: string };
  createdAt: string;
}

export interface Submission {
  id: string;
  hackathonSlug: string;
  teamName: string;
  submittedAt: string;
  artifactType: string;
  content: string;
  notes?: string;
  fileName?: string;
  fileSize?: number;
}

export interface TeamInvitation {
  id: string;
  teamCode: string;
  hackathonSlug: string;
  fromTeamName: string;
  toNickname: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface TeamMessage {
  id: string;
  fromNickname: string;
  toTeamCode: string;
  toTeamName: string;
  hackathonSlug: string | null;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface GlobalRankingEntry {
  rank: number;
  nickname: string;
  points: number;
  hackathonsEntered: number;
  bestRank: number;
}
