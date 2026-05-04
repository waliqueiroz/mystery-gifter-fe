# Tasks: Secret Santa Group Management

**Input**: Design documents from `specs/003-group-management/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-contracts.md ✅

**Tests**: Unit tests for ALL React components and utility functions are MANDATORY per the project constitution (Principle II). Integration/E2E tests are not explicitly requested and are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.
**Branch constraint**: Each task targets ≤ 15 files. Stacked branches handle dependencies; independent tasks are marked [P] and may be developed in parallel.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks in the same wave)
- **[Story]**: User story this task belongs to (US1–US7)

---

## Phase 1: Setup

No new project scaffolding required — the Next.js project is already bootstrapped and all directories exist.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared TypeScript types, session utilities, UI primitives (Toast, ConfirmModal), API services, and theme tokens. All user stories depend on at least some of these tasks.

**⚠️ CRITICAL**: User story work can only begin after its specific foundational dependencies are complete (see dependency table at the end).

- [x] T001 Add new TypeScript types to `src/types/api.ts` (GroupStatus, GroupSummary, Group, Match, GroupInvite, Paging, GroupSearchResult, CreateGroupPayload) and `src/types/forms.ts` (CreateGroupFormData) per `data-model.md`
- [x] T002 [P] Create `src/lib/session.ts` with `getUser()`, `setUser(user)`, `clearUser()` (stores/reads `mystery_gifter_user` in localStorage) and `src/lib/session.test.ts` per decision D-001 in `research.md`
- [x] T003 Extend `src/lib/auth.ts` so `clearToken()` also calls `clearUser()`; update `src/lib/auth.test.ts` to cover the new behaviour (depends on T002)
- [x] T004 Extend `src/services/api/authService.ts` to call `setUser(user)` after each successful login and registration response (depends on T002)
- [x] T005 [P] Create Toast UI primitives: `src/components/ui/Toast/Toast.tsx`, `Toast.test.tsx`, `ToastProvider.tsx`, `ToastProvider.test.tsx`, `useToast.ts` — auto-dismiss after 4 s, `useToast()` hook exposes `showToast({ message, type })` per decision D-004 in `research.md`
- [x] T006 [P] Create `src/components/ui/ConfirmModal/ConfirmModal.tsx` and `ConfirmModal.test.tsx` — generic "Are you sure?" modal accepting `isOpen`, `message`, `onConfirm`, `onCancel` props
- [x] T007 [P] Add theme tokens and CSS classes to `src/app/theme.css`: invite card (`.mg-invite-card`), result reveal card flip (`.mg-result-card`, `.mg-result-card-inner`, `.mg-result-card-front`, `.mg-result-card-back`, `.flipped`), status badges (`.mg-badge-open`, `.mg-badge-matched`, `.mg-badge-archived`), and toast container (`.mg-toast-container`, `.mg-toast`) — all new colours as CSS custom properties in `:root` first per Extension Pattern rule 1
- [x] T008 [P] Create `src/services/api/groupService.ts` (listGroups, createGroup, getGroup, removeMember, generateDraw, reopenGroup, archiveGroup) and `src/services/api/groupService.test.ts` using `apiFetch` helper per `contracts/api-contracts.md` (depends on T001)
- [x] T009 [P] Create `src/services/api/inviteService.ts` (getActiveInvite, createInvite, joinGroup, getUserMatch) and `src/services/api/inviteService.test.ts` using `apiFetch` helper per `contracts/api-contracts.md` (depends on T001)
- [x] T010 [P] Create `src/components/groups/GroupStatusBadge/GroupStatusBadge.tsx` (pill badge for OPEN → "Aberto", MATCHED → "Sorteio realizado", ARCHIVED → "Arquivado" using `.mg-badge-*` classes) and `GroupStatusBadge.test.tsx` (depends on T001)

**Checkpoint**: Foundation ready — user story tasks can start as soon as their specific dependencies (listed below) are complete.

---

## Phase 3: User Story 1 — List and Create Groups (Priority: P1) 🎯 MVP

**Goal**: Logged-in user sees all their active groups in a paginated list and can create a new group from the same page.

**Independent Test**: Log in, navigate to `/groups`, verify the empty state CTA is shown; create a group, verify it appears at the top with status "Aberto"; create enough groups to exceed the page size and verify the "Carregar mais" button loads additional results.

- [x] T011 [P] [US1] Create `src/components/groups/GroupCard/GroupCard.tsx` (card showing group name, member count rendered via `GroupStatusBadge`, linking to `/groups/{id}`) and `GroupCard.test.tsx` (depends on T010)
- [x] T012 [P] [US1] Create `src/components/groups/GroupEmptyState/GroupEmptyState.tsx` (empty state illustration with CTA button to open the create-group modal) and `GroupEmptyState.test.tsx` (depends on T001)
- [x] T013 [US1] Create `src/components/groups/CreateGroupModal/CreateGroupModal.tsx` (modal form: name required, description optional max 255 chars; inline validation; calls `groupService.createGroup()`; `onSuccess(group)` callback; error toast on failure) and `CreateGroupModal.test.tsx` (depends on T008)
- [x] T014 [US1] Create `src/components/groups/GroupList/GroupList.tsx` (renders `GroupCard` list; shows `GroupEmptyState` when empty; "Carregar mais" button visible when `paging.offset + paging.limit < paging.total`; calls `groupService.listGroups()` with `status=OPEN&status=MATCHED` per decision D-002) and `GroupList.test.tsx` (depends on T011, T012, T013)
- [x] T015 [US1] Wrap `src/app/(protected)/layout.tsx` with `ToastProvider` and create `src/app/(protected)/groups/page.tsx` (`"use client"`; reads `mystery_gifter_user` from localStorage via `session.getUser()`; renders `GroupList` inside `AuthGuard`) (depends on T005, T014)

**Checkpoint**: US1 fully functional — `/groups` shows the paginated list and the create-group flow end-to-end.

---

## Phase 4: User Story 2 — Invite Members via Card and Link (Priority: P2)

**Goal**: Any group member can view, copy, and share the invite link; unauthenticated recipients are redirected to login and returned to the join flow after authentication.

**Independent Test**: Open a group as owner, open the invite section, copy the link (verify toast), share via Web Share API (or clipboard fallback); open the link in an incognito window, complete login, confirm you land on the group detail page as a new member.

- [x] T016 [P] [US2] Extend `src/components/login/LoginForm.tsx` to read the `returnUrl` query param and redirect to it after successful login (instead of always redirecting to `/dashboard`); update `LoginForm.test.tsx` per decision D-003 in `research.md`
- [x] T017 [US2] Create `src/components/groups/InviteSection/InviteSection.tsx` (calls `inviteService.getActiveInvite()`; on 200 renders invite card with copy/Web Share API buttons; on 404+owner shows "Gerar link de convite" button that calls `inviteService.createInvite()`; on 404+non-owner shows placeholder message; entire section hidden when `group.status === 'MATCHED' | 'ARCHIVED'` per FR-017) and `InviteSection.test.tsx` (depends on T009)
- [x] T018 [P] [US2] Create `src/components/invite/InviteJoinCard/InviteJoinCard.tsx` (join button; calls `inviteService.joinGroup(token)` on click; handles 409 "draw completed" and 409/404 "archived/invalid" with contextual messages; redirects to `/groups/{group.id}` on success) and `InviteJoinCard.test.tsx` (depends on T009)
- [x] T019 [US2] Create `src/app/(protected)/groups/[id]/page.tsx` (skeleton group detail page: `"use client"`; reads userId from `session.getUser()`; calls `groupService.getGroup()`; on 403/404 → error toast + redirect to `/groups`; renders `GroupStatusBadge` + `InviteSection`) and `src/app/invite/[token]/page.tsx` (`"use client"` standalone page; `InviteGuard`: unauthenticated → stores `returnUrl=/invite/{token}` in `sessionStorage` → redirect `/login`; authenticated → renders `InviteJoinCard`) (depends on T005, T016, T017, T018)

**Checkpoint**: US2 fully functional — invite link can be generated, copied, shared, and used to join a group.

---

## Phase 5: User Story 3 — View Group Details and Manage Members (Priority: P3)

**Goal**: Group owner can view all members and remove one before the draw; non-owner members see the list without management controls.

**Independent Test**: Open a group with members as owner; verify member list with remove buttons; remove a member and confirm the list updates; log in as non-owner and confirm remove buttons are absent.

- [ ] T020 [US3] Create `src/components/groups/MemberList/MemberList.tsx` (table of members; remove button visible to owner only; button disabled with explanation when `group.status !== 'OPEN'`; calls `groupService.removeMember()` on click; updates group state via `onGroupUpdate` callback) and `MemberList.test.tsx` (depends on T008)
- [x] T021 [US3] Extend `src/app/(protected)/groups/[id]/page.tsx` to render `MemberList` below the group header with `currentUser.id` and `onGroupUpdate` callback (depends on T019, T020)

**Checkpoint**: US3 functional — full group detail page shows the member list with owner management controls.

---

## Phase 6: User Story 4 — Draw Names (Priority: P4)

**Goal**: Group owner triggers the secret santa draw when ≥ 3 members are present; draw button is visible but disabled with an inline explanation when fewer than 3 members exist.

**Independent Test**: Open a group with 2 members and verify the draw button is disabled with the inline message; add a third member and verify the button becomes enabled; trigger the draw and confirm group status changes to "Sorteio realizado" and the invite section hides.

- [ ] T022 [US4] Create `src/components/groups/DrawButton/DrawButton.tsx` (always visible; disabled + tooltip "São necessários pelo menos 3 membros" when `group.users.length < 3`; disabled when `group.status !== 'OPEN'`; calls `groupService.generateDraw()`; on success invokes `onGroupUpdate(updatedGroup)` callback) and `DrawButton.test.tsx` (depends on T008)
- [x] T023 [US4] Extend `src/app/(protected)/groups/[id]/page.tsx` to render `DrawButton` in the owner-only actions area (depends on T021, T022)

**Checkpoint**: US4 functional — draw can be triggered; status transitions to "Sorteio realizado" and invite section hides.

---

## Phase 7: User Story 5 — View Draw Result (Priority: P5)

**Goal**: Each member sees an animated CSS 3D card flip that reveals their assigned recipient on demand; the result persists on revisit without re-animating.

**Independent Test**: After a draw, log in as a member, open the group detail page, click "Ver quem você presenteia", confirm the card flips to reveal only your own recipient's name; revisit the page and confirm the revealed recipient is shown without the animation.

- [ ] T024 [US5] Create `src/components/groups/ResultReveal/ResultReveal.tsx` (CSS 3D card flip using `.mg-result-card-*` classes from `theme.css`: front face shows mystery icon + "Ver quem você presenteia" button; back face shows recipient name + icon; calls `inviteService.getUserMatch(groupId)` on first click; flipped state persisted in component state) and `ResultReveal.test.tsx` (depends on T009)
- [ ] T025 [US5] Extend `src/app/(protected)/groups/[id]/page.tsx` to render `ResultReveal` when `group.status === 'MATCHED'` (depends on T023, T024)

**Checkpoint**: US5 functional — each member can reveal and re-view their assigned recipient.

---

## Phase 8: User Stories 6 & 7 — Reopen and Archive Group (Priority: P6/P7)

**Goal**: Owner can reopen a MATCHED group (clears draw, returns to OPEN) or permanently archive any active group (irreversible, hidden from list).

**Independent Test — US6**: Open a group with status "Sorteio realizado" as owner, click "Reabrir grupo", confirm the modal, verify status returns to "Aberto" and draw results are cleared.
**Independent Test — US7**: Open any active group as owner, click "Arquivar grupo", confirm the modal, verify the group disappears from the active list and no restore option exists anywhere.

- [ ] T026 [US6] [US7] Create `src/components/groups/GroupActions/GroupActions.tsx` ("Reabrir grupo" button when `status === 'MATCHED'`; "Arquivar grupo" button when `status !== 'ARCHIVED'`; both owner-only; each opens `ConfirmModal` before calling `groupService.reopenGroup()` / `groupService.archiveGroup()` respectively; invokes `onGroupUpdate` on success) and `GroupActions.test.tsx` (depends on T006, T008)
- [ ] T027 [US6] [US7] Extend `src/app/(protected)/groups/[id]/page.tsx` to render `GroupActions` in the owner-only actions area (depends on T025, T026)

**Checkpoint**: US6 + US7 fully functional — owner can reopen or permanently archive a group from the detail page.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all user stories.

- [ ] T028 [P] Verify and fix responsive layout (320px–1440px) across `src/app/(protected)/groups/page.tsx`, `src/app/(protected)/groups/[id]/page.tsx`, and `src/app/invite/[token]/page.tsx` per SC-007 and FR-023
- [ ] T029 [P] Review all pt-BR UI strings across new components for accuracy and consistency with the project style guide

---

## Dependencies & Execution Order

### Phase 2: Foundational

| Task | Depends on | Stacks on |
|------|------------|-----------|
| T001 | — | `003-group-management` |
| T002 | — | `003-group-management` |
| T003 | T002 | `task/003-T002-session` |
| T004 | T002 | `task/003-T002-session` |
| T005 | — | `003-group-management` |
| T006 | — | `003-group-management` |
| T007 | — | `003-group-management` |
| T008 | T001 | `task/003-T001-types` |
| T009 | T001 | `task/003-T001-types` |
| T010 | T001 | `task/003-T001-types` |

### Phase 3: US1

| Task | Depends on | Stacks on |
|------|------------|-----------|
| T011 | T010 | `task/003-T010-group-status-badge` |
| T012 | — | `003-group-management` |
| T013 | T008 | `task/003-T008-group-service` |
| T014 | T011, T012, T013 | `task/003-T013-create-group-modal` (after T011 and T012 merge) |
| T015 | T005, T014 | `task/003-T014-group-list` (after T005 merges) |

### Phase 4: US2

| Task | Depends on | Stacks on |
|------|------------|-----------|
| T016 | — | `003-group-management` |
| T017 | T009 | `task/003-T009-invite-service` |
| T018 | T009 | `task/003-T009-invite-service` |
| T019 | T005, T015, T016, T017, T018 | `task/003-T015-groups-page` (after T016, T017, T018 merge) |

### Phases 5–8

| Task | Depends on | Stacks on |
|------|------------|-----------|
| T020 | T008 | `task/003-T008-group-service` |
| T021 | T019, T020 | `task/003-T019-group-detail-invite` (after T020 merges) |
| T022 | T008 | `task/003-T008-group-service` |
| T023 | T021, T022 | `task/003-T021-member-list-integration` (after T022 merges) |
| T024 | T009 | `task/003-T009-invite-service` |
| T025 | T023, T024 | `task/003-T023-draw-button-integration` (after T024 merges) |
| T026 | T006, T008 | `task/003-T008-group-service` (after T006 merges) |
| T027 | T025, T026 | `task/003-T025-result-reveal-integration` (after T026 merges) |
| T028 | T027 | `task/003-T027-group-actions-integration` |
| T029 | T027 | `task/003-T027-group-actions-integration` |

---

## Stacked Branches Overview

```
003-group-management (feature base)
│
├── [Wave 1 — parallel, start immediately]
│   ├── task/003-T001-types
│   ├── task/003-T002-session
│   ├── task/003-T005-toast
│   ├── task/003-T006-confirm-modal
│   ├── task/003-T007-theme-css
│   ├── task/003-T012-group-empty-state
│   └── task/003-T016-login-form-return-url
│
├── [Wave 2 — after T001 merges]
│   ├── task/003-T008-group-service
│   │   ├── task/003-T013-create-group-modal
│   │   ├── task/003-T020-member-list
│   │   ├── task/003-T022-draw-button
│   │   └── task/003-T026-group-actions  (also needs T006)
│   ├── task/003-T009-invite-service
│   │   ├── task/003-T017-invite-section
│   │   ├── task/003-T018-invite-join-card
│   │   └── task/003-T024-result-reveal
│   └── task/003-T010-group-status-badge
│       └── task/003-T011-group-card
│
├── [Wave 2 — after T002 merges]
│   ├── task/003-T003-extend-auth
│   └── task/003-T004-extend-authservice
│
└── [Sequential integration chain]
    T014 (needs T011, T012, T013)
    → T015 (needs T005, T014)
      → T019 (needs T015, T016, T017, T018)
        → T021 (needs T019, T020)
          → T023 (needs T021, T022)
            → T025 (needs T023, T024)
              → T027 (needs T025, T026)
                ├── T028
                └── T029
```

> **Multi-parent branches**: When a task depends on more than one parent that is still in review (e.g., T014 needs T011 + T012 + T013), wait for all dependency PRs to merge into `003-group-management`, then create the task branch from the updated feature base. Files across dependencies are disjoint, so conflicts are minimal.

---

## Parallel Execution Examples

### Wave 1 (day 1 — no waiting)

```bash
# All these branches from 003-group-management simultaneously
git checkout -b task/003-T001-types
git checkout -b task/003-T002-session
git checkout -b task/003-T005-toast
git checkout -b task/003-T006-confirm-modal
git checkout -b task/003-T007-theme-css
git checkout -b task/003-T012-group-empty-state
git checkout -b task/003-T016-login-form-return-url
```

### Wave 2 (after T001 merges into feature base)

```bash
git checkout 003-group-management && git pull
git checkout -b task/003-T008-group-service
git checkout -b task/003-T009-invite-service
git checkout -b task/003-T010-group-status-badge
```

### Wave 3 (after T008 merges)

```bash
git checkout 003-group-management && git pull
git checkout -b task/003-T013-create-group-modal
git checkout -b task/003-T020-member-list
git checkout -b task/003-T022-draw-button
# task/003-T026-group-actions needs T006 too — start once T006 also merges
```

---

## PR Size Verification

| Task | New/modified files | Count |
|------|--------------------|-------|
| T001 | `src/types/api.ts`, `src/types/forms.ts` | 2 |
| T002 | `src/lib/session.ts`, `src/lib/session.test.ts` | 2 |
| T003 | `src/lib/auth.ts`, `src/lib/auth.test.ts` | 2 |
| T004 | `src/services/api/authService.ts` | 1 |
| T005 | `Toast.tsx`, `Toast.test.tsx`, `ToastProvider.tsx`, `ToastProvider.test.tsx`, `useToast.ts` | 5 |
| T006 | `ConfirmModal.tsx`, `ConfirmModal.test.tsx` | 2 |
| T007 | `src/app/theme.css` | 1 |
| T008 | `groupService.ts`, `groupService.test.ts` | 2 |
| T009 | `inviteService.ts`, `inviteService.test.ts` | 2 |
| T010 | `GroupStatusBadge.tsx`, `GroupStatusBadge.test.tsx` | 2 |
| T011 | `GroupCard.tsx`, `GroupCard.test.tsx` | 2 |
| T012 | `GroupEmptyState.tsx`, `GroupEmptyState.test.tsx` | 2 |
| T013 | `CreateGroupModal.tsx`, `CreateGroupModal.test.tsx` | 2 |
| T014 | `GroupList.tsx`, `GroupList.test.tsx` | 2 |
| T015 | `(protected)/layout.tsx`, `(protected)/groups/page.tsx` | 2 |
| T016 | `LoginForm.tsx`, `LoginForm.test.tsx` | 2 |
| T017 | `InviteSection.tsx`, `InviteSection.test.tsx` | 2 |
| T018 | `InviteJoinCard.tsx`, `InviteJoinCard.test.tsx` | 2 |
| T019 | `groups/[id]/page.tsx`, `invite/[token]/page.tsx` | 2 |
| T020 | `MemberList.tsx`, `MemberList.test.tsx` | 2 |
| T021 | `groups/[id]/page.tsx` | 1 |
| T022 | `DrawButton.tsx`, `DrawButton.test.tsx` | 2 |
| T023 | `groups/[id]/page.tsx` | 1 |
| T024 | `ResultReveal.tsx`, `ResultReveal.test.tsx` | 2 |
| T025 | `groups/[id]/page.tsx` | 1 |
| T026 | `GroupActions.tsx`, `GroupActions.test.tsx` | 2 |
| T027 | `groups/[id]/page.tsx` | 1 |
| T028 | `groups/page.tsx`, `groups/[id]/page.tsx`, `invite/[token]/page.tsx` | 3 |
| T029 | review only — no file changes | 0 |

All tasks are within the 15-file limit. ✅

---

## Implementation Strategy

### MVP: User Story 1 Only

1. Phase 2 (Wave 1 + Wave 2) — parallel workers on T001–T010
2. Phase 3 — T011+T012+T013 in parallel → T014 → T015
3. **STOP and VALIDATE**: `/groups` page shows paginated list and create flow works end-to-end
4. Demo / deploy if ready

### Incremental Delivery

1. Foundation + US1 → groups list + create group → **Demo**
2. US2 → invite link + join flow → **Demo**
3. US3 → member management on detail page → **Demo**
4. US4 → draw names → **Demo**
5. US5 → result reveal animation → **Demo**
6. US6+7 → reopen + archive → **Demo**

---

## Notes

- All [P] tasks in the same wave touch different files — no merge conflicts when run in parallel
- Component unit tests are MANDATORY per Constitution Principle II; each component task includes its `.test.tsx`
- No integration or E2E tests included (not requested in spec.md)
- All UI text in pt-BR; route paths in English per CLAUDE.md
- `"use client"` required on all group pages and interactive components — justifications in plan.md
- PR title convention: `feat(T001): description` (Conventional Commits with task scope)
- Each task PR targets its **parent branch** (see "Stacks on" column), not `develop` or `main`
