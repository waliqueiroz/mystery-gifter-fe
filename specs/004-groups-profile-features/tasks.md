# Tasks: Groups & Profile Enhancements

**Input**: Design documents from `/specs/004-groups-profile-features/`
**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/backend-api.md ✓, research.md ✓, quickstart.md ✓

**Tests**: Unit tests are MANDATORY per Constitution Principle II. Tests are included alongside each implementation task. Integration/E2E tests are not in scope for this feature.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependencies)
- **[Story]**: User story this task belongs to (US1–US4)
- Exact file paths included in every task description

---

## Phase 1: Setup

No project initialization required — this is an existing Next.js project with all dependencies installed. Proceed to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: New types and services that unblock all four user stories. All tasks touch different files and can run fully in parallel.

**⚠️ CRITICAL**: No user story work can begin until all three foundational tasks are complete.

- [x] T001 [P] Add `GroupFilterParams` interface and `DEFAULT_GROUP_FILTERS` constant to `src/types/api.ts` — interface fields: `name: string`, `statuses: GroupStatus[]`, `sortDirection: 'ASC' | 'DESC'`; constant value: `{ name: '', statuses: ['OPEN', 'MATCHED'], sortDirection: 'DESC' }` (see data-model.md for exact shape)

- [x] T002 [P] Create `src/services/api/userService.ts` — export `getUserById(userId: string): Promise<User>` using the same `apiFetch` helper pattern as `groupService.ts` (`GET /api/v1/users/${userId}`); create co-located `src/services/api/userService.test.ts` covering: resolves with a `User` on 200, throws on non-2xx (uses `error.message`), clears token and throws on 401

- [x] T003 [P] Extend `ListGroupsParams` in `src/services/api/groupService.ts` with optional fields `name?: string`, `statuses?: GroupStatus[]`, `sortDirection?: 'ASC' | 'DESC'`; update `listGroups` body: append `name` param only when non-empty; iterate `statuses` with `params.append('status', s)` — omit entirely when array is empty (backend returns all); always append `sort_by=created_at` and `sort_direction` (default `'DESC'`); update `src/services/api/groupService.test.ts` to cover: default call still sends `status=OPEN&status=MATCHED`, name filter appended when provided, empty `statuses` sends no `status` params, custom `sortDirection=ASC` is sent

**Checkpoint**: Foundation complete — cut task branches for all user stories from here.

---

## Phase 3: User Story 1 — GroupCard At-a-Glance Info (Priority: P1) 🎯 MVP

**Goal**: Each `GroupCard` shows a "Dono" badge when the current user owns that group. Member count is already rendered.

**Independent Test**: Load `/groups` — cards show "X participante(s)"; groups owned by the logged-in user show a distinct badge; groups owned by others show no badge.

- [x] T004 [P] [US1] Update `src/components/groups/GroupCard/GroupCard.tsx` — add optional `currentUserId?: string` prop; render `<span className="badge badge-primary mg-owner-badge ml-2">Dono</span>` (styled via `--mg-primary`) immediately after the group name when `currentUserId === group.owner_id`; add `aria-label="Você é o dono deste grupo"` to the badge span

- [x] T005 [P] [US1] Update `src/components/groups/GroupCard/GroupCard.test.tsx` — add tests: (1) renders "Dono" badge when `currentUserId === group.owner_id`; (2) does not render badge when `currentUserId` differs from `owner_id`; (3) does not render badge when `currentUserId` is `undefined`

- [x] T006 [US1] Update `src/components/groups/GroupList/GroupList.tsx` — pass `currentUserId={user?.id ?? undefined}` prop to every `<GroupCard>` render call (both in the initial list and in any `handleGroupCreated` inline render); depends on T004

- [x] T007 [US1] Update `src/components/groups/GroupList/GroupList.test.tsx` — update existing `GroupCard` render assertions or mock to expect the new `currentUserId` prop; add a test that verifies `GroupCard` receives the user id from context; depends on T006

**Checkpoint**: US1 complete — owner badge visible on all owned group cards.

---

## Phase 4: User Story 2 — Groups Discovery and Filtering (Priority: P2)

**Goal**: Groups list has reactive name search, status multiselect (default OPEN + MATCHED), and sort toggle (default Mais recentes). Archived groups render dimmed. API errors show inline with a retry button.

**Independent Test**: Type in search → list updates; toggle ARCHIVED → archived cards appear dimmed; switch sort to "Mais antigos" → order reverses; deselect all statuses → all groups appear; disconnect backend → inline error with "Tentar novamente" appears.

- [x] T008 [P] [US2] Update `src/components/groups/GroupCard/GroupCard.tsx` — apply `style={{ opacity: group.status === 'ARCHIVED' ? 0.6 : 1 }}` to the outer card `<div>`; no other changes to existing logic; depends on T004 (must be applied after owner badge change is in place)

- [x] T009 [P] [US2] Update `src/components/groups/GroupCard/GroupCard.test.tsx` — add tests: ARCHIVED card wrapper has `opacity: 0.6`; OPEN and MATCHED card wrappers have `opacity: 1`; depends on T005

- [x] T010 [P] [US2] Create `src/components/groups/GroupFilters/GroupFilters.tsx` — `"use client"`; props: `{ filters: GroupFilterParams; onChange: (f: GroupFilterParams) => void }`; renders three sections: (1) `<input type="text">` bound to `filters.name` — calls `onChange({ ...filters, name: e.target.value })` on every keystroke; (2) three `<input type="checkbox">` elements for `OPEN` ("Aberto"), `MATCHED` ("Sorteado"), `ARCHIVED` ("Arquivado") — each checked when its value is in `filters.statuses`, toggle adds/removes from array, calls `onChange`; (3) `<select>` with options `DESC` ("Mais recentes") and `ASC` ("Mais antigos") bound to `filters.sortDirection` — calls `onChange` on change; all form inputs use existing `.form-control` class and `--mg-bg-secondary`, `--mg-text`, `--mg-text-muted` tokens; all labels in pt-BR; depends on T001

- [x] T011 [P] [US2] Create `src/components/groups/GroupFilters/GroupFilters.test.tsx` — cover: (1) name input change calls `onChange` with updated `name`; (2) checking ARCHIVED adds it to `statuses`; (3) unchecking OPEN removes it from `statuses`; (4) changing sort select to ASC calls `onChange` with `sortDirection: 'ASC'`; (5) default props render with OPEN and MATCHED checked and DESC selected; depends on T010

- [x] T012 [US2] Refactor `src/components/groups/GroupList/GroupList.tsx` — (1) add `filters` state initialised from `DEFAULT_GROUP_FILTERS`; (2) add `error: string | null` state (initialised `null`); (3) update `fetchGroups` signature to accept `(offset: number, append: boolean, activeFilters: GroupFilterParams)` and pass spread filter params to `listGroups`; for initial load and filter-change fetches: on error `setError(message)` and do NOT call `showToast`; for "Load More" fetches: keep `showToast` on error; (4) on filter change via `GroupFilters.onChange`: update `filters` state, reset `offset` to 0, clear existing `groups` array, clear `error`, trigger a fresh fetch; (5) when `error` is set render an inline card (styled `.alert` using `--mg-error`) with the error message and a "Tentar novamente" `<button>` that clears `error` and retries the last fetch; (6) render `<GroupFilters filters={filters} onChange={handleFilterChange} />` above the list; depends on T001, T003, T006, T008, T010

- [x] T013 [US2] Update `src/components/groups/GroupList/GroupList.test.tsx` — cover: (1) initial fetch uses `DEFAULT_GROUP_FILTERS`; (2) updating name filter resets offset to 0 and calls `listGroups` with `name` param; (3) toggling status triggers fetch with new `statuses` array; (4) empty `statuses` triggers `listGroups` without any status param; (5) API error on initial load renders inline error card (not toast) with "Tentar novamente" button; (6) clicking retry re-invokes `listGroups`; depends on T012

**Checkpoint**: US2 complete — full filter, sort, archived visibility, and error handling flow working.

---

## Phase 5: User Story 3 — User Profile Page (Priority: P3)

**Goal**: Authenticated users can view their profile at `/profile`. Sidebar has a Perfil link.

**Independent Test**: Click "Perfil" in sidebar → `/profile` loads with the logged-in user's name, surname, email, and formatted creation date. Direct URL access while unauthenticated redirects to `/login`.

- [x] T014 [P] [US3] Create `src/components/profile/ProfileCard/ProfileCard.tsx` — `"use client"`; reads current user from `useUser()`; if user is null renders nothing (guard: `UserProvider` handles redirect); renders a `.card` with `--mg-bg-card` background showing: full name (`user.name user.surname`), email (`user.email`), and creation date formatted as pt-BR long date via `new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(user.created_at))`; uses `--mg-text` for primary text and `--mg-text-muted` for labels; no API call (reads session via `useUser()`)

- [x] T015 [P] [US3] Create `src/components/profile/ProfileCard/ProfileCard.test.tsx` — mock `useUser` to return a test `User`; cover: (1) renders `name` and `surname` together; (2) renders `email`; (3) renders `created_at` as formatted pt-BR date (e.g. "1 de janeiro de 2025"); (4) renders nothing when `useUser()` returns `null`; depends on T014

- [x] T016 [US3] Create `src/app/(protected)/profile/page.tsx` — Server Component (no `"use client"`); renders a `<section className="content">` containing `<div className="container-fluid">` and `<ProfileCard />`; import `ProfileCard` from `@/components/profile/ProfileCard/ProfileCard`; depends on T014

- [x] T017 [US3] Create `src/app/(protected)/profile/page.test.tsx` — verify the page renders `ProfileCard` (mock `ProfileCard` and assert it appears in the output); depends on T016

- [x] T018 [US3] Update `src/app/(protected)/layout.tsx` — inside `<ul className="nav nav-pills nav-sidebar flex-column">` add a new `<li className="nav-item">` containing `<Link href="/profile" className={\`nav-link\${pathname?.startsWith('/profile') ? ' active' : ''}\`}><i className="nav-icon fas fa-user" aria-hidden="true" /><p>Perfil</p></Link>`; depends on T016

**Checkpoint**: US3 complete — profile page and sidebar link working.

---

## Phase 6: User Story 4 — Member Profile Details (Priority: P4)

**Goal**: Every row in `MemberList` is clickable; clicking opens a modal with that member's name, surname, and email. Loading and error states handled inside the modal.

**Independent Test**: Open `/groups/[id]` → click any member name → modal opens with name, surname, email → clicking close or backdrop dismisses modal. Loading spinner shown while fetching. Error message appears without auto-closing if fetch fails.

- [x] T019 [P] [US4] Create `src/components/groups/MemberProfileModal/MemberProfileModal.tsx` — `"use client"`; props: `{ userId: string | null; onClose: () => void }`; `isOpen` derived as `userId !== null`; `useEffect([userId])`: when `userId` is truthy, reset state then call `getUserById(userId)` using async/await with try/catch/finally managing `loading`, `error`, `userData` states; renders a Bootstrap `.modal` overlay (`position: fixed`, covers viewport, `--mg-bg-card` modal box, backdrop calls `onClose`): (a) loading state: centered spinner `<span className="spinner-border">`; (b) error state: error message in `--mg-error` colour and "Tentar novamente" button that re-fetches; (c) data state: user `name surname` as heading, email as body text; close `<button>` in header always visible and calls `onClose`; all text in pt-BR; depends on T002

- [x] T020 [P] [US4] Create `src/components/groups/MemberProfileModal/MemberProfileModal.test.tsx` — mock `getUserById`; cover: (1) renders nothing when `userId` is null; (2) shows spinner while loading; (3) shows user name, surname, email on successful fetch; (4) shows error message when fetch rejects; (5) "Tentar novamente" button re-invokes `getUserById`; (6) close button calls `onClose`; (7) clicking backdrop calls `onClose`; depends on T019

- [x] T021 [US4] Update `src/components/groups/MemberList/MemberList.tsx` — add `selectedUserId: string | null` state (init `null`); for each `<li>` member row wrap the name `<span>` in a `<button type="button" className="btn btn-link p-0 mg-member-btn">` styled to look like plain text (no underline, `--mg-text` colour, cursor pointer); `onClick` sets `selectedUserId` to `user.id`; after the `<ul>` render `<MemberProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />`; import from `@/components/groups/MemberProfileModal/MemberProfileModal`; depends on T019

- [x] T022 [US4] Update `src/components/groups/MemberList/MemberList.test.tsx` — add tests: (1) member name renders as a button; (2) clicking a member button sets `selectedUserId` (MemberProfileModal receives the correct `userId`); (3) `onClose` callback resets `selectedUserId` to null; (4) all pre-existing remove-member tests still pass; depends on T021

**Checkpoint**: All four user stories complete and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T023 Run `npm run test:coverage` — confirm line coverage ≥ 80 % on all new and modified files (`userService`, `groupService`, `GroupCard`, `GroupFilters`, `GroupList`, `MemberList`, `MemberProfileModal`, `ProfileCard`, profile page, layout); fix any gaps before opening PRs

- [x] T024 Run `npm run lint && npm run build` — confirm ESLint passes with zero warnings/errors and the Next.js production build succeeds; fix any TypeScript or lint issues found

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 2: no dependencies — start immediately
  T001 [P] | T002 [P] | T003 [P]  — all parallel

Phase 3 (US1): depends on T001, T002, T003
  T004 [P] | T005 [P]            — parallel
  T006 → T004
  T007 → T006

Phase 4 (US2): T008/T009 depend on T004/T005; T010/T011 depend on T001; T012 depends on T001, T003, T006, T008, T010
  T008 [P] | T009 [P] | T010 [P] | T011 [P]
  T012 → T001, T003, T006, T008, T010
  T013 → T012

Phase 5 (US3): independent from US1/US2 (no shared deps beyond foundation)
  T014 [P] | T015 [P]
  T016 → T014
  T017 → T016
  T018 → T016

Phase 6 (US4): depends on T002
  T019 [P] | T020 [P] → T002
  T021 → T019
  T022 → T021

Phase 7: depends on T013, T018, T022
```

### Task Branch Names (Stacked Branches — see CLAUDE.md)

```
task/004-T001-group-filter-params       ← stacked on 004-groups-profile-features
task/004-T002-user-service              ← stacked on 004-groups-profile-features
task/004-T003-list-groups-params        ← stacked on 004-groups-profile-features
task/004-T004-group-card-owner-badge    ← stacked on 004-groups-profile-features
task/004-T005-group-card-badge-tests    ← stacked on task/004-T004-group-card-owner-badge
task/004-T006-group-list-owner-prop     ← stacked on task/004-T004-group-card-owner-badge
task/004-T007-group-list-tests-us1      ← stacked on task/004-T006-group-list-owner-prop
task/004-T008-group-card-archived       ← stacked on task/004-T004-group-card-owner-badge
task/004-T009-group-card-archived-tests ← stacked on task/004-T008-group-card-archived
task/004-T010-group-filters             ← stacked on task/004-T001-group-filter-params
task/004-T011-group-filters-tests       ← stacked on task/004-T010-group-filters
task/004-T012-group-list-filters        ← stacked on task/004-T006, task/004-T008, task/004-T010
task/004-T013-group-list-tests-us2      ← stacked on task/004-T012-group-list-filters
task/004-T014-profile-card              ← stacked on 004-groups-profile-features
task/004-T015-profile-card-tests        ← stacked on task/004-T014-profile-card
task/004-T016-profile-page              ← stacked on task/004-T014-profile-card
task/004-T017-profile-page-tests        ← stacked on task/004-T016-profile-page
task/004-T018-sidebar-profile-link      ← stacked on task/004-T016-profile-page
task/004-T019-member-profile-modal      ← stacked on task/004-T002-user-service
task/004-T020-member-modal-tests        ← stacked on task/004-T019-member-profile-modal
task/004-T021-member-list-clickable     ← stacked on task/004-T019-member-profile-modal
task/004-T022-member-list-tests         ← stacked on task/004-T021-member-list-clickable
```

---

## Parallel Execution Examples

### Phase 2 — three streams simultaneously

```
T001: Add GroupFilterParams to src/types/api.ts
T002: Create src/services/api/userService.ts + userService.test.ts
T003: Extend ListGroupsParams in src/services/api/groupService.ts + groupService.test.ts
```

### After Phase 2 — three independent streams

```
Stream A (US1+US2): T004 → T006 → T008 → T010 → T012 → T013
Stream B (US3):     T014 → T016 → T017 → T018
Stream C (US4):     T019 → T021 → T022
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 2: T001, T002, T003 (parallel)
2. Phase 3: T004 → T005 → T006 → T007
3. **STOP and VALIDATE**: Load `/groups`, confirm owner badges appear only on owned groups
4. Proceed to Phase 4 (US2)

### Incremental Delivery

1. Phase 2 → Phase 3 (US1) → validate → demo
2. Phase 4 (US2) → validate → demo
3. Phase 5 (US3) → validate → demo
4. Phase 6 (US4) → validate → demo
5. Phase 7 (polish) → PR ready

### Parallel Team Strategy

With multiple developers after Phase 2:

- Developer A: Stream A — US1 (T004–T007) then US2 (T008–T013)
- Developer B: Stream B — US3 (T014–T018)
- Developer C: Stream C — US4 (T019–T022)

---

## Notes

- `[P]` tasks touch different files with no unresolved dependencies — safe to parallelize
- `GroupCard.tsx` is touched twice: T004 (owner badge) then T008 (ARCHIVED opacity) — T008 must follow T004
- `GroupList.tsx` is touched twice: T006 (owner prop) then T012 (filters refactor) — T012 must follow T006
- Unit tests are non-negotiable per Constitution Principle II — each implementation task has a paired test task
- Verify each phase checkpoint before advancing to avoid compounding integration issues
- Commit after each task; use Conventional Commits format (`feat(T004): ...`)
