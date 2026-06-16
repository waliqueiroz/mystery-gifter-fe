# Quickstart: Groups & Profile Enhancements

**Feature branch**: `004-groups-profile-features`  
**Last updated**: 2026-06-16

## Prerequisites

- Node.js LTS installed (`node -v`)
- Dependencies installed: `npm install`
- Backend API running at `http://localhost:8080` (see `mystery-gifter-api/`)

## Running the dev server

```bash
npm run dev        # starts Next.js at http://localhost:3000
```

The Next.js rewrite proxy maps `/api/v1/*` → `http://localhost:8080/api/v1/*`.

## Running tests

```bash
npm test                          # run all tests (watch mode)
npm test -- --testPathPattern=GroupCard   # run a single component's tests
npm run test:coverage             # full coverage report (must be ≥ 80 % for modified files)
npm run lint                      # ESLint check
npm run build                     # production build (must succeed before PR)
```

## Feature-specific test targets

The tests most relevant to this feature:

```bash
npm test -- --testPathPattern="GroupCard|GroupFilters|GroupList|MemberList|MemberProfileModal|ProfileCard|userService|groupService"
```

## Files to touch (summary)

| File | Change type |
|------|-------------|
| `src/types/api.ts` | Add `GroupFilterParams` interface |
| `src/services/api/userService.ts` | New — `getUserById(userId)` |
| `src/services/api/groupService.ts` | Extend `ListGroupsParams` with filter fields |
| `src/components/groups/GroupCard/GroupCard.tsx` | Add `currentUserId` prop + owner badge |
| `src/components/groups/GroupFilters/GroupFilters.tsx` | New — filter controls UI |
| `src/components/groups/GroupList/GroupList.tsx` | Filter state, error state, owner badge wiring |
| `src/components/groups/MemberList/MemberList.tsx` | Clickable rows + modal state |
| `src/components/groups/MemberProfileModal/MemberProfileModal.tsx` | New — on-demand modal |
| `src/components/profile/ProfileCard/ProfileCard.tsx` | New — profile display |
| `src/app/(protected)/profile/page.tsx` | New — `/profile` route |
| `src/app/(protected)/layout.tsx` | Add Profile sidebar link |

## Branch & task dependency graph

```
T001: userService.ts            [parallel]
T002: groupService filter params [parallel]
T003: GroupCard owner badge      [parallel]
T004: GroupFilters component     [depends on T002]
T005: GroupList refactor         [depends on T002, T003, T004]
T006: ProfileCard + /profile     [depends on T001]
T007: MemberProfileModal + MemberList [depends on T001]
```

Each task runs on its own `task/004-T00N-*` branch stacked on `004-groups-profile-features`.

## Design tokens used in new components

| Token | Value | Use |
|-------|-------|-----|
| `--mg-primary` | `#6B46C1` | Owner badge background, active filter highlight |
| `--mg-primary-hover` | `#9F7AEA` | Focus rings, badge text |
| `--mg-bg-card` | `#2D3748` | Modal background, profile card background |
| `--mg-bg-secondary` | `#1A202C` | Filter input backgrounds |
| `--mg-text` | `#FFFFFF` | Primary text |
| `--mg-text-muted` | `#A0AEC0` | Labels, secondary info |
| `--mg-error` | `#FC8181` | Error messages in modal and list |
| `--mg-transition` | `200ms ease-in-out` | All hover/focus transitions |

All overrides go in `src/app/theme.css`. No hardcoded hex values in component files.
