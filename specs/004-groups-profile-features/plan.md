# Implementation Plan: Groups & Profile Enhancements

**Branch**: `004-groups-profile-features` | **Date**: 2026-06-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-groups-profile-features/spec.md`

## Summary

Expose six frontend improvements that consume existing backend endpoints with zero backend changes: (1) add an owner badge to `GroupCard`; (2) add reactive name search, status multiselect filter, and sort order control to the groups list; (3) create a read-only user profile page at `/profile` with sidebar navigation; (4) make `MemberList` entries clickable to open a member profile modal. The `GroupCard` member count is already rendered — only the owner badge and filter/sort controls are net-new UI. A `userService` is introduced for the two features requiring `GET /api/v1/users/{id}`.

## Technical Context

**Language/Version**: TypeScript 5+, Node.js LTS  
**Primary Dependencies**: Next.js 15.5.4 (App Router), React 19, Bootstrap 4.6, AdminLTE 3.2, Jest + React Testing Library + ts-jest  
**Storage**: N/A — filter state lives in React component state; user session in `localStorage` via `lib/session.ts`  
**Testing**: Jest + jest-environment-jsdom + React Testing Library + ts-jest  
**Target Platform**: Web dashboard (desktop-first, responsive via Bootstrap 4 grid)  
**Project Type**: Web application — Next.js App Router frontend consuming a REST backend  
**Performance Goals**: Filter results within 1 s of interaction (SC-007); name search debounced ~300 ms to limit requests  
**Constraints**: Bootstrap 4 only (AdminLTE 3.2 incompatible with Bootstrap 5); all style in `src/app/theme.css`; `'use client'` only where hooks or browser APIs require; `useEffect` data fetching permitted only where no server-side alternative exists  
**Scale/Scope**: 4 user stories; 6 new files, 6 modified files; all changes self-contained within `(protected)` layout

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I — Code Quality | ✅ Pass | TypeScript throughout; new `GroupFilterParams` type in `types/api.ts`; no magic strings or `any` |
| II — Unit Testing | ✅ Pass | Co-located tests required for all new/modified components; ≥ 80 % line coverage |
| III — UX Consistency | ✅ Pass | All tokens via `var(--mg-*)`; loading, error, and empty states explicitly handled in every data-dependent component |
| IV — Performance | ✅ Pass | Name search debounced; status/sort changes trigger a single fetch; member profiles fetched on demand (not pre-fetched) |
| V — Next.js Patterns | ⚠️ Justified | `MemberProfileModal` uses `useEffect` for data fetching because the member's user ID is only known after a user interaction (click); no server-side alternative without pre-fetching all member profiles. `ProfileCard` avoids this by reading the already-loaded session user via `useUser()` — no API call needed. Documented in Complexity Tracking. |

## Project Structure

### Documentation (this feature)

```text
specs/004-groups-profile-features/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions and rationale
├── data-model.md        # Phase 1 — types and shapes
├── quickstart.md        # Phase 1 — dev/test guide for this feature
├── contracts/
│   └── backend-api.md   # Phase 1 — consumed API contracts
└── tasks.md             # Phase 2 — /speckit.tasks output (not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (protected)/
│       ├── layout.tsx                       # MODIFY — add Profile nav link
│       └── profile/
│           ├── page.tsx                     # NEW — protected profile route (Server Component)
│           └── page.test.tsx                # NEW
├── components/
│   ├── groups/
│   │   ├── GroupCard/
│   │   │   ├── GroupCard.tsx                # MODIFY — add currentUserId prop + owner badge
│   │   │   └── GroupCard.test.tsx           # MODIFY — add owner badge coverage
│   │   ├── GroupFilters/                    # NEW directory
│   │   │   ├── GroupFilters.tsx             # NEW — name search + status multiselect + sort toggle
│   │   │   └── GroupFilters.test.tsx        # NEW
│   │   ├── GroupList/
│   │   │   ├── GroupList.tsx                # MODIFY — filter state, error state, owner badge wiring
│   │   │   └── GroupList.test.tsx           # MODIFY — update for new behaviour
│   │   ├── MemberList/
│   │   │   ├── MemberList.tsx               # MODIFY — clickable rows, modal state
│   │   │   └── MemberList.test.tsx          # MODIFY — add click + modal tests
│   │   └── MemberProfileModal/              # NEW directory
│   │       ├── MemberProfileModal.tsx       # NEW — on-demand member profile modal
│   │       └── MemberProfileModal.test.tsx  # NEW
│   └── profile/                             # NEW directory
│       └── ProfileCard/
│           ├── ProfileCard.tsx              # NEW — displays session user data (no API call)
│           └── ProfileCard.test.tsx         # NEW
├── services/
│   └── api/
│       ├── groupService.ts                  # MODIFY — extend ListGroupsParams
│       ├── groupService.test.ts             # MODIFY — cover new filter params
│       ├── userService.ts                   # NEW — getUserById(userId): Promise<User>
│       └── userService.test.ts              # NEW
└── types/
    └── api.ts                               # MODIFY — add GroupFilterParams interface
```

**Structure Decision**: Single Next.js App Router project. New directories follow the established domain convention (`components/groups/`, `components/profile/`). `userService.ts` is placed alongside the other API services under `services/api/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| `MemberProfileModal` uses `useEffect` for data fetching | Member user ID is only known after the user clicks a row; the fetch is inherently triggered by client interaction | Server Component + `fetch` is impossible for on-demand interaction-triggered calls; pre-fetching all member profiles on page load is wasteful and couples the group detail load to N extra requests |
