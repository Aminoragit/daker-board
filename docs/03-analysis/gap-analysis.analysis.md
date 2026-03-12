# Design-Implementation Gap Analysis Report

> **Summary**: Comprehensive gap analysis between UI spec + MAIN_OBJECT.md and daker-board implementation
>
> **Author**: gap-detector
> **Created**: 2026-03-12
> **Last Modified**: 2026-03-12
> **Status**: Draft

---

## Analysis Overview

- **Design Documents**: `hackathon_ui_spec.md`, `MAIN_OBJECT.md`
- **Implementation Path**: `/mnt/d/Personal_Project/hackathone/daker-board/`
- **Analysis Date**: 2026-03-12

---

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| 1. Design System | 92% | OK |
| 2. Common UI Components | 82% | WARN |
| 3. Page Layouts | 88% | WARN |
| 4. Interactions & Modals | 90% | OK |
| 5. Submit Section | 93% | OK |
| 6. Leaderboard Section | 95% | OK |
| 7. Responsive Design | 95% | OK |
| 8. Animations | 85% | WARN |
| 9. Navigation Flow | 95% | OK |
| 10. Data Structure | 95% | OK |
| **Overall** | **90%** | **OK** |

---

## Section 1: Design System

### 1-1. Theme & Color Tokens

**Match**:
- All 14 CSS custom properties in `:root` match the spec exactly:
  `--bg-base`, `--bg-surface`, `--bg-elevated`, `--border`, `--border-glow`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-dim`, `--green`, `--red`, `--blue`, `--purple`
- HEX values all match spec precisely.

**Gap**: None.

### 1-2. Typography

**Match**:
- Google Fonts import: `Space Mono:wght@400;700` + `IBM Plex Sans KR:wght@300;400;500;700` -- matches spec.
- Tailwind config: `font-mono` maps to `"Space Mono"`, `font-sans` maps to `"IBM Plex Sans KR"` -- matches spec.
- Body default font: `'IBM Plex Sans KR', sans-serif` -- matches spec.

**Gap**: None.

### 1-3. Global Effects

**Match**:
- Scanline overlay: `body::after` with `repeating-linear-gradient` and `background-size: 100% 2px` -- matches spec.
- Cursor blink: `.cursor-blink` with `@keyframes blink` at 1s -- matches spec.
- Pulse dot: `.pulse-dot` with `@keyframes pulse-dot` at 2s -- matches spec.
- Scrollbar: 4px width, hover uses `var(--accent)` -- matches spec.
- Text selection: `rgba(245, 158, 11, 0.3)` background -- matches spec.

**Gap**:
- Implementation adds `body::before` with a CRT vignette effect (radial-gradient darkening) not specified in the design doc. This is an **addition**, not a conflict.
- Implementation adds `.text-glow`, `.text-glow-green`, `.tech-border` utility classes not in spec (enhancements).

**Score: 92%** (additions are benign enhancements)

---

## Section 2: Common UI Components

### 2-1. Navbar

**Match**:
- Logo `DAKER_BOARD` in `font-mono font-bold` with `text-[--accent]` -- matches spec (rendered as `~/DAKER_BOARD_`).
- LIVE indicator with `pulse-dot` red dot + `text-red-500` -- matches spec intent (label text differs: spec says "LIVE", impl says "SYS.LIVE").
- 3 nav links: HACKATHONS, CAMP, RANKINGS -- matches spec.
- Links use `font-mono text-xs uppercase tracking-[0.2em]` -- matches spec.
- Active state: `text-[--accent]` + bottom bar -- matches spec.
- Mail icon at 18px -- matches spec.
- Unread badge: `bg-red-500 text-white font-mono text-[10px] rounded-full min-w-[16px]` -- matches spec.
- Mobile hamburger: `Menu`/`X` icons toggle vertical menu -- matches spec.
- Responsive: desktop `sm+` horizontal, mobile `<sm` hamburger -- matches spec.

**Gap**:
- Spec says `font-mono text-xs` on nav links, impl uses `text-xs` -- matches.
- Logo has added `Terminal` icon and `~/` prefix not in spec (stylistic enhancement).
- LIVE label: spec says `LIVE`, impl says `SYS.LIVE` -- minor text difference.

### 2-2. StatusBadge

**Match**:
- Three statuses: `ongoing`/`ended`/`upcoming` -- matches spec.
- Colors match spec: green-400, red-400, blue-400 for text and `bg-{color}/15`.
- Style: `font-mono uppercase text-xs px-2 py-0.5 rounded-sm font-bold` -- matches spec (impl uses `text-[10px]` instead of `text-xs`, which is slightly smaller).

**Gap**:
- Spec says `text-xs`, impl uses `text-[10px]` (10px vs 12px) -- minor size difference.
- Impl adds a colored dot indicator, shadow glow, and border not in spec -- enhancement.

### 2-3. TagBadge

**Match**:
- Default: `border-[--border]` + `text-[--text-secondary]` -- matches spec.
- Active: `border-[--accent]` + `text-[--accent]` + `bg-[--accent]/10` -- matches spec.
- Style: `font-mono uppercase text-xs px-2 py-0.5 rounded-sm border` -- matches (impl uses `text-[10px]`).
- `cursor-pointer`/`cursor-default` based on onClick -- matches spec.

**Gap**:
- Uses `text-[10px]` instead of `text-xs` -- minor.

### 2-4. SectionTitle

**Match**:
- Uses `font-mono uppercase tracking-[...] text-[--text-secondary]` style -- partially matches.

**Gap**:
- Spec: `text-xs tracking-[0.2em] text-[--text-secondary]` with prefix `// `.
- Impl: `text-sm tracking-[0.25em] text-[--text-primary] font-bold` with prefix `>` and added accent bar, cursor blink, gradient line.
- The prefix changed from `// ` (code comment style) to `>` (terminal prompt style). Text color is `--text-primary` instead of `--text-secondary`. Size is `text-sm` instead of `text-xs`.
- This is a **significant stylistic deviation** from spec.

### 2-5. State Components (Loading/Empty/Error)

**Match**:
- **LoadingState**: `LOADING_` with cursor-blink, `font-mono text-sm text-[--accent]`, centered, `py-20` -- matches spec exactly.
- **EmptyState**: `[ {message} ]` format, `font-mono text-sm text-[--text-muted] tracking-widest`, centered, `py-20` -- matches spec exactly.
- **ErrorState**: `AlertTriangle` icon at 32px in `text-red-400`, message in `font-mono text-sm text-red-400`, RETRY button with border style hover accent -- matches spec.

**Gap**: None for state components.

### 2-6. Modal

**Match**:
- Backdrop: `bg-black/60 backdrop-blur-sm` -- matches spec.
- Container: `max-w-lg bg-[--bg-surface] border border-[--border] rounded-lg` -- matches spec.
- Title: `font-mono text-sm uppercase tracking-widest text-[--accent]` with `// ` prefix -- matches spec.
- Close button: `X` icon, hover `text-[--text-primary]` -- matches spec.
- Animation: framer-motion `opacity` + `y:20` + `scale:0.95` to `1` -- matches spec exactly.
- Body scroll lock on open -- additional feature.

**Gap**: None.

**Section 2 Score: 82%** (SectionTitle deviates significantly; StatusBadge/TagBadge minor sizing)

---

## Section 3: Page Layouts

### 3-1. Main Page (`/`)

**Match**:
- System status indicator with `pulse-dot` green dot + "OPERATIONAL" -- matches spec.
- Hero title: `HACKATHON CONTROL CENTER_` with cursor blink -- matches spec.
- Dot pattern background: `radial-gradient(circle, rgba(245,158,11,...) 1px, transparent 1px)` at 24px -- matches spec (opacity differs: spec 0.03, impl 0.05).
- CTA cards: 3 cards for Hackathons/Camp/Rankings -- matches spec.
- CTA card borders: accent/blue/purple -- matches spec.
- CTA card hover: translate-y + glow shadow -- matches spec.
- Grid: `grid-cols-1 sm:grid-cols-3` -- matches spec ("3 cols sm, 1 col mobile").
- Recent Events section with `SectionTitle` + 3 cards -- matches spec.

**Gap**:
- Spec says CTA labels: "HACKATHONS" / "FIND TEAM" / "RANKINGS". Impl uses: "EXPLORE HACKATHONS" / "TEAM RECRUITMENT" / "GLOBAL RANKINGS" -- different labels.
- Spec describes: hero subtitle text "..." and active events count. Impl adds typing effect, terminal-style boot messages, system version indicator -- significantly enhanced beyond spec.
- Active events counter: spec says `6 ACTIVE EVENTS`, impl shows total events + total teams -- different metric display.
- Dot pattern opacity: spec 0.03, impl 0.05 -- minor.

### 3-2. Hackathon List (`/hackathons`)

**Match**:
- Section title with count badge -- matches spec intent.
- Status filter: ALL/ONGOING/UPCOMING/ENDED tabs -- matches spec (labels differ: ALL_EVENTS/ACTIVE/PENDING/ARCHIVED).
- Tag filter row -- matches spec.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` -- matches spec ("1~3 cols responsive").

**Gap**:
- Filter tab labels differ from spec: spec uses `ALL`/`ONGOING`/`UPCOMING`/`ENDED`, impl uses `ALL_EVENTS`/`ACTIVE`/`PENDING`/`ARCHIVED`.

#### HackathonCard

**Match**:
- StatusBadge + TagBadge[] at top -- matches spec.
- Title in `font-sans font-bold` -- matches (size `text-lg` vs spec `text-sm`, implementation is larger).
- Date 3 lines: START / END / DEADLINE -- matches spec.
- DEADLINE uses `text-[--accent]` (spec says `text-muted` for DEADLINE) -- **differs from spec**.
- Bottom bar: team count + "VIEW" -- matches spec intent (label "ACCESS" vs spec "VIEW").
- Ended cards: opacity reduction -- matches spec (impl uses `opacity-70` vs spec `opacity-60`).
- Hover: translate + shadow -- matches spec intent.

**Gap**:
- Title size: spec `text-sm`, impl `text-lg` -- differs.
- DEADLINE color: spec `text-muted`, impl `text-[--accent]` -- differs.
- Bottom label: spec `VIEW -->`, impl `ACCESS >` -- different text.
- Ended opacity: spec `opacity-60`, impl `opacity-70` -- minor.
- Hover: spec `-translate-y-0.5`, impl hover effect via tech-border + shadow -- functionally equivalent.

### 3-3. Hackathon Detail (`/hackathons/[slug]`)

**Match**:
- Header: StatusBadge + TagBadges + slug display -- matches spec.
- Title in `font-sans font-bold` -- matches spec.
- Countdown: `DEADLINE IN: 14D 5H 30M` format with 60s interval -- matches spec.
- RULES and FAQ buttons -- matches spec.
- 7 tabs: overview/eval/schedule/prize/teams/submit/leaderboard -- matches spec.
- Tabs use `overflow-x-auto` -- matches spec.
- Tab transition: `AnimatePresence mode="wait"` with `opacity` + `x:10` -- matches spec.
- 404 state: "ERROR 404: EVENT NOT FOUND" + slug + back link -- matches spec.

**Gap**:
- Tab active state: spec uses "bottom amber underbar", impl uses filled button style with accent border + background -- stylistic change.

### 3-4. Camp (`/camp`)

**Match**:
- Section title "TEAM CAMP" with count -- matches spec intent (label differs: "RECRUITMENT_CAMP").
- CREATE TEAM button -- matches spec.
- Hackathon dropdown filter -- matches spec.
- OPEN only toggle -- matches spec.
- Role filter tags -- matches spec.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` -- matches spec.

#### TeamCard

**Match**:
- Team name (`font-bold`) + hackathon name -- matches spec.
- Team code + OPEN/CLOSED badge -- matches spec (labels differ: "RECRUITING"/"LOCKED" vs "OPEN"/"CLOSED").
- Team intro text -- matches spec.
- Member progress bar -- matches spec.
- Role tags via TagBadge -- matches spec.
- Button row: CONTACT / MESSAGE / EDIT / toggle open/close -- matches spec.
- Hover: amber glow -- matches spec.

**Gap**:
- OPEN/CLOSED badge labels: spec says "OPEN"/"CLOSED", impl says "RECRUITING"/"LOCKED".
- Member bar: spec says `/5` hardcoded, impl also hardcodes `/5` -- matches.

### 3-5. Rankings (`/rankings`)

**Match**:
- Section title "GLOBAL RANKINGS" -- matches spec.
- Period tabs: 3 options (7D/30D/ALL) -- matches spec.
- Podium: 2nd-1st-3rd order -- matches spec.
- Podium heights: `h-36`/`h-28`/`h-24` -- matches spec.
- Podium colors: 1st yellow-500, 2nd gray-400, 3rd amber -- matches spec.
- Table left borders: yellow-500/gray-400/amber-700 -- matches spec.
- `opacity-60` for rank > 10 -- matches spec.
- Points with `CountUp` animation -- matches spec.
- Responsive: Entries/Best Rank hidden on mobile via `hidden sm:table-cell` -- matches spec.

**Gap**:
- Podium 2nd place color: spec says `gray-400/15`, impl uses `gray-400/15` -- matches.
- Podium 3rd place: spec says `amber-700/15`, impl uses `amber-700/10` -- minor.
- Period tab labels differ: spec "RECENT 7D"/"RECENT 30D"/"ALL TIME", impl "T-MINUS 7D"/"T-MINUS 30D"/"LIFETIME".

**Section 3 Score: 88%** (label differences throughout, some size/color deviations in HackathonCard)

---

## Section 4: Interactions & Modals

### 4-1. TeamCreateModal

**Match**:
- Title "CREATE TEAM" -- matches spec.
- Fields: Team Name*, Hackathon (optional dropdown), Intro*, Looking For (toggle), Contact URL -- matches spec.
- Submit button -- matches spec.

**Gap**:
- Spec shows "MEMBER COUNT" with `[-] 1 [+]` stepper control. Impl uses a plain `<input type="number">` instead -- different control type.
- Spec label says "HACKATHON (OPTIONAL)", impl dropdown default text says "..." -- functionally same.

### 4-2. MessageModal

**Match**:
- Title "SEND MESSAGE" -- matches spec.
- TO section showing team name + team code -- matches spec.
- YOUR NICKNAME* field -- matches spec.
- MESSAGE* textarea -- matches spec.
- Submit button -- matches spec.
- Post-send: `MESSAGE SENT` (green-400) + team name + 2s auto-close -- matches spec.

**Gap**: None.

### 4-3. MessageInbox

**Match**:
- Mail icon 18px -- matches spec.
- Unread badge: `bg-red-500 text-white font-mono text-[10px] rounded-full min-w-[16px]` -- matches spec exactly.
- Dropdown: `w-80 max-h-80`, position `right-0 top-full mt-2` -- matches spec.
- Title: `// RECENT MESSAGES` -- matches spec.
- Unread dot: `bg-blue-400`, read: `bg-[--text-muted]/30` -- matches spec.
- Empty state: `[ NO MESSAGES ]` -- matches spec.
- Outside click: `mousedown` event to close -- matches spec.

**Gap**: None.

### 4-4. Team Invite Modal (TeamsSection)

**Match**:
- Title "INVITE TEAM MEMBER" (spec: "INVITE MEMBER") -- close match.
- SELECT TEAM dropdown -- matches spec.
- NICKNAME TO INVITE input -- matches spec.
- Submit button -- matches spec.
- Invitation history with status display (PENDING/ACCEPTED/REJECTED) -- matches spec.
- Accept/Reject buttons for pending invitations -- matches spec.

**Gap**:
- Title text: "INVITE TEAM MEMBER" vs spec "INVITE MEMBER" -- minor.

### 4-5. Caution Modal

**Match**:
- Title "TEAM FORMATION GUIDELINES" (spec: "TEAM GUIDELINES") -- close match.
- Shows max team size and solo policy -- matches spec.
- 5 caution items -- matches spec (7 items in spec, 7 items in impl counting maxTeamSize + allowSolo + 5 bullets -- matches).
- Confirm button -- matches spec.

**Gap**:
- Title: "TEAM FORMATION GUIDELINES" vs "TEAM GUIDELINES" -- minor.

### 4-6. Team Edit Modal

**Match**:
- Title uses `SYS.CONFIG // TEAM_DATA` (spec: "EDIT TEAM") -- different.
- Fields: Team Name*, Intro*, Looking For, Contact URL -- matches spec.
- Save button -- matches spec.

**Gap**:
- Modal title differs: spec "EDIT TEAM", impl "SYS.CONFIG // TEAM_DATA".

**Section 4 Score: 90%**

---

## Section 5: Submit Section

**Match**:
- Submission guide list with numbered items -- matches spec.
- Artifact type based on `allowedArtifactTypes` -- matches spec.
- File upload with accept mapping: zip->`.zip,.tar.gz,.rar`, pdf->`.pdf`, csv->`.csv` -- matches spec exactly.
- Selected file display with name + size + remove button -- matches spec.
- URL/text input -- matches spec.
- Memo (optional) field -- matches spec.
- Submit button -- matches spec.
- Submission history with numbered entries, artifact type badge, datetime, file info -- matches spec.
- Multi-step submission items support (`submissionItems`) -- matches MAIN_OBJECT.md `extraDetails`.

**Gap**:
- Spec shows "ARTIFACT TYPE" dropdown selector. Impl auto-detects from `allowedArtifactTypes` without explicit dropdown -- different UX but functionally equivalent.
- Spec label "NEW SUBMISSION", impl uses "SUBMIT" -- minor label difference.

**Section 5 Score: 93%**

---

## Section 6: Leaderboard Section

**Match**:
- Vote-based scoring display: shows breakdown labels with weight percentages -- matches spec.
- Auto-based scoring: shows max runtime and daily submission limit -- matches spec.
- Leaderboard table: Rank, Team, Score, Submitted At, Links -- matches spec.
- Rank styling: left border colors for top 3 (yellow-500, gray-400, amber-700) -- matches spec.
- Unsubmitted teams: `MinusCircle` icon, `text-muted`, "..." label -- matches spec.
- Score breakdown display for vote-based entries -- matches spec.
- Artifact links (webUrl, pdfUrl) -- matches spec.

**Gap**:
- Spec column header "Submitted" -- impl uses "Submitted At" -- minor.
- Unsubmitted team rank column shows `MinusCircle`, spec shows `--` text -- functionally equivalent.

**Section 6 Score: 95%**

---

## Section 7: Responsive Design

**Match**:
- Breakpoints: default (0px), `sm:` (640px), `lg:` (1024px) -- matches spec.
- Container: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` in layout.tsx -- matches spec exactly.
- Mobile navigation: hamburger below `sm` -- matches spec.
- Grid responsiveness: 1->2->3 columns pattern throughout -- matches spec.

**Gap**: None.

**Section 7 Score: 95%**

---

## Section 8: Animations & Transitions

**Match**:
- Page transitions: `PageTransition` via framer-motion, `opacity` + `y:10` -- close to spec (`y:8`).
- Tab transitions: `AnimatePresence mode="wait"`, `opacity` + `x:10` -- matches spec.
- Modal open/close: `opacity` + `y:20` + `scale:0.95` -- matches spec exactly.
- Card hover: `transition-all duration-200/300` -- matches spec.
- Button hover: `brightness-110` or `border-[--accent]` -- matches spec.
- CountUp: custom implementation with `useCountUp` hook using `IntersectionObserver` + `requestAnimationFrame` -- matches spec intent.
- Countdown: `DEADLINE IN: 14D 5H 30M` with `setInterval(60000)` -- matches spec exactly.

**Gap**:
- PageTransition `y:10` vs spec `y:8` -- minor difference.
- CTA hover: spec says `-translate-y-1`, impl does not explicitly use translate on CTA cards (uses shadow-based approach) -- minor.
- Card hover: spec says `-translate-y-0.5`, impl uses tech-border animations instead -- different approach, similar effect.

**Section 8 Score: 85%**

---

## Section 9: Navigation Flow

**Match**:
- `/` -> `/hackathons` (CTA button) -- matches spec.
- `/` -> `/camp` (CTA button) -- matches spec.
- `/` -> `/rankings` (CTA button) -- matches spec.
- `/hackathons` -> `/hackathons/:slug` (card click) -- matches spec.
- `/hackathons/:slug` -> tabs (overview/eval/schedule/prize/teams/submit/leaderboard) -- matches spec.
- Teams tab -> `/camp?hackathon={slug}` link -- matches spec.
- Camp -> hackathon detail (via hackathonSlug link) -- matches spec.
- Navbar links: HACKATHONS, CAMP, RANKINGS -- matches spec.
- Logo click -> `/` -- matches spec.

**Gap**: None.

**Section 9 Score: 95%**

---

## Section 10: Data Structure (MAIN_OBJECT.md)

### TypeScript Interfaces vs JSON Spec

**Match**:
- `Hackathon`: `slug`, `title`, `status`, `tags`, `thumbnailUrl`, `period` (timezone, startAt, submissionDeadlineAt, endAt), `links` -- matches spec.
- `HackathonDetail`: `sections.overview` (summary, teamPolicy: maxTeamSize, allowSolo), `sections.eval` (metricName, description, limits, scoreSource, scoreDisplay), `sections.schedule` (milestones: name, at), `sections.prize` (items: place, amountKRW), `sections.submit` (allowedArtifactTypes, guide, submissionItems) -- matches spec.
- `Leaderboard`: `hackathonSlug`, `entries` (rank, teamName, score, submittedAt), `scoreBreakdown`, `artifacts` (webUrl, pdfUrl) -- matches spec.
- `Team`: `teamCode`, `hackathonSlug`, `isOpen`, `memberCount`, `lookingFor`, `intro`, `contact` -- matches spec.

### localStorage Seeding

**Match**:
- `hackathonStore.init()`: reads from localStorage, seeds from `SEED_HACKATHONS` if not found -- matches spec.
- Same pattern for teams, leaderboards, submissions, messages -- matches spec.
- All CRUD operations completed in browser via localStorage -- matches spec.

### Slug-based Relationships

**Match**:
- `hackathonSlug` used across Team, LeaderboardEntry, Submission, HackathonDetail -- matches spec.
- All entities connected via slug FK pattern -- matches spec.

**Gap**:
- `GlobalRankingEntry` type (rank, nickname, points, hackathonsEntered, bestRank) is an addition not explicitly described in MAIN_OBJECT.md -- acceptable derived data.
- `TeamInvitation` and `TeamMessage` types are additions for features described in UI spec but not in MAIN_OBJECT.md data spec.

**Section 10 Score: 95%**

---

## Summary of All Differences

### Missing Features (Design specified, Implementation absent)

| Item | Design Location | Description |
|------|-----------------|-------------|
| SectionTitle `//` prefix | UI Spec 2-4 | Spec requires `// ` code comment prefix; impl uses `>` terminal prefix |
| CTA hover translate | UI Spec 8 | Spec requires `-translate-y-1`; impl uses shadow-only approach |

### Added Features (Implementation has, Design does not)

| Item | Implementation Location | Description |
|------|------------------------|-------------|
| CRT Vignette | `globals.css:51-63` | `body::before` radial gradient vignette not in spec |
| Text glow utilities | `globals.css:66-72` | `.text-glow`, `.text-glow-green` classes |
| Tech-border utility | `globals.css:74-97` | Corner bracket decoration with hover effect |
| Typing effect | `app/page.tsx:42-51` | Boot sequence typing animation on home |
| System version | `app/page.tsx:76-78` | Version number display on hero |
| GlobalRankingEntry | `data/types.ts:128-134` | Aggregated ranking type |
| TeamInvitation type | `data/types.ts:107-115` | Invitation tracking |
| Glitch/CRT animations | `tailwind.config.ts:33-57` | Additional animation keyframes |

### Changed Features (Design differs from Implementation)

| Item | Design | Implementation | Impact |
|------|--------|----------------|--------|
| SectionTitle prefix | `// ` | `> ` | Medium |
| SectionTitle color | `text-[--text-secondary]` | `text-[--text-primary]` | Low |
| SectionTitle size | `text-xs` | `text-sm` | Low |
| StatusBadge/TagBadge size | `text-xs` | `text-[10px]` | Low |
| LIVE label | `LIVE` | `SYS.LIVE` | Low |
| Filter labels | `ALL/ONGOING/UPCOMING/ENDED` | `ALL_EVENTS/ACTIVE/PENDING/ARCHIVED` | Low |
| CTA labels | `HACKATHONS/FIND TEAM/RANKINGS` | `EXPLORE HACKATHONS/TEAM RECRUITMENT/GLOBAL RANKINGS` | Low |
| HackathonCard title size | `text-sm` | `text-lg` | Low |
| HackathonCard DEADLINE color | `text-muted` | `text-[--accent]` | Low |
| HackathonCard VIEW label | `VIEW -->` | `ACCESS >` | Low |
| Ended card opacity | `opacity-60` | `opacity-70` | Low |
| Team status labels | `OPEN/CLOSED` | `RECRUITING/LOCKED` | Low |
| Period filter labels | `RECENT 7D/RECENT 30D/ALL TIME` | `T-MINUS 7D/T-MINUS 30D/LIFETIME` | Low |
| Edit modal title | `EDIT TEAM` | `SYS.CONFIG // TEAM_DATA` | Low |
| PageTransition y | `y:8` | `y:10` | Low |
| Dot pattern opacity | `0.03` | `0.05` | Low |
| Member count input | Stepper `[-] N [+]` | Number input | Low |
| Detail tab active style | Underbar | Filled button style | Medium |

---

## Assessment

### Match Rate: 90%

The implementation is a strong match to the design spec. Almost all functional requirements are implemented correctly. The differences fall into three categories:

1. **Terminal-style label enhancements** -- Many labels were "upgraded" to a more terminal/cyberpunk aesthetic (e.g., "ACTIVE" -> "RECRUITING", "VIEW" -> "ACCESS", "ALL" -> "ALL_EVENTS"). This is thematically consistent but deviates from spec text.

2. **SectionTitle redesign** -- The most significant deviation. The component was redesigned from a simple `// LABEL` style to a more elaborate design with accent bar, `>` prefix, cursor blink, and gradient line. Size and color also changed.

3. **Visual enhancements** -- CRT vignette, tech-border, text glow utilities, typing animation -- all additions that enhance the terminal aesthetic without removing spec features.

### Recommended Actions

#### Immediate (if strict spec compliance needed)

1. **SectionTitle**: Revert prefix to `// `, color to `text-[--text-secondary]`, size to `text-xs`, tracking to `0.2em`.
2. **HackathonCard DEADLINE**: Change from `text-[--accent]` to `text-muted`.
3. **Detail tab active style**: Change from filled button to bottom amber underbar.

#### Documentation Update (if implementation style is preferred)

1. Update UI spec Section 2-4 to reflect terminal prompt style for SectionTitle.
2. Update label names throughout spec to match implementation's terminal terminology.
3. Document additional CSS utilities (text-glow, tech-border, CRT vignette).
4. Add `GlobalRankingEntry`, `TeamInvitation`, `TeamMessage` types to MAIN_OBJECT.md.

---

## Synchronization Recommendation

The implementation stylistically enhances the spec's terminal theme in a consistent direction. Most changes are cosmetic label upgrades. The recommendation is:

**Option 2: Update design documents to match implementation** -- since the terminal-style enhancements are cohesive and the implementation is already deployed/in-use, updating the spec to reflect reality is more practical than reverting the code.

Only the SectionTitle and Detail Tab active style changes warrant discussion about whether to align code to spec or vice versa.
