# Research: Secret Santa Group Management

**Branch**: `003-group-management` | **Date**: 2026-03-29

## 1. Backend API Audit

**Source**: `/Users/waliqueiroz/Documents/projetos/mystery-gifter-api/`

### Endpoints Available

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | /api/v1/groups | Bearer | Paginated search; `user_id` filter scopes to member groups |
| POST | /api/v1/groups | Bearer | Creates group; authenticated user becomes owner |
| GET | /api/v1/groups/{groupID} | Bearer | Full `GroupDTO` including all matches and users |
| DELETE | /api/v1/groups/{groupID}/users/{userID} | Bearer | Owner-only; group must be OPEN |
| POST | /api/v1/groups/{groupID}/matches | Bearer | Owner-only; requires ≥ 3 members and OPEN status |
| GET | /api/v1/groups/{groupID}/matches/user | Bearer | Returns `UserDTO` of the current user's recipient |
| POST | /api/v1/groups/{groupID}/reopen | Bearer | Owner-only; only works on MATCHED groups (not ARCHIVED) |
| POST | /api/v1/groups/{groupID}/archive | Bearer | Owner-only; works on OPEN and MATCHED groups |
| POST | /api/v1/groups/{groupID}/invites | Bearer | **Owner-only** — creates a new time-limited invite |
| POST | /api/v1/invites/{inviteID}/join | Bearer | Any member; adds authenticated user to group |

### Group Status Enum

| Backend value | Spec terminology | Display label (pt-BR) |
|---------------|------------------|-----------------------|
| `OPEN` | "open" | Aberto |
| `MATCHED` | "draw completed" | Sorteio realizado |
| `ARCHIVED` | "archived" | Arquivado |

### Pagination Shape

```json
{
  "result": [...],
  "paging": { "limit": 15, "offset": 0, "total": 42 }
}
```

- `total` tells the frontend whether more pages exist: `offset + limit < total` → show "Load More"
- Default limit: 15 (set by backend `DefaultGroupLimit`)

### `GroupDTO` (full group detail)

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "users": [UserDTO, ...],
  "owner_id": "uuid",
  "matches": [{ "giver_id": "uuid", "receiver_id": "uuid" }, ...],
  "status": "OPEN|MATCHED|ARCHIVED",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

⚠️ `matches` contains **all** giver→receiver pairs. The frontend MUST NOT expose them.
Use `GET /api/v1/groups/{id}/matches/user` for the individual reveal only.

### `GroupInviteDTO`

```json
{
  "id": "uuid",
  "group_id": "uuid",
  "expires_at": "ISO8601",
  "created_at": "ISO8601"
}
```

The invite `id` is the token embedded in the share URL: `https://<host>/invite/{id}`.

---

## 2. Backend Gaps (Required Changes)

### BC-001 — Critical: `description` must be optional in `CreateGroupDTO`

- **File**: `internal/infra/entrypoint/rest/group_dto.go`, line 22
- **Current**: `validate:"required,max=255"`
- **Required**: `validate:"omitempty,max=255"` (also remove `required` from Swagger comment)
- **Impact**: Blocks FR-002 — the spec defines description as optional

### BC-002 — Critical: No GET endpoint for active invite (non-owner members blocked)

- **Current**: `POST /api/v1/groups/{groupID}/invites` is owner-only (enforced in domain `CanCreateInvite`). No GET endpoint exists to retrieve an existing invite.
- **Required**: `GET /api/v1/groups/{groupID}/invites/active`
  - Accessible to any group member
  - Returns the most recent non-expired invite; 404 if none exists
  - Frontend behaviour when 404: show "Peça ao dono para gerar o link de convite."
- **Impact**: Blocks FR-004, FR-005, FR-006, FR-007 for non-owner members

### BC-003 — Critical: `GET /api/v1/groups/{groupID}` has no membership check

- **Current**: Any authenticated user can retrieve any group's full data (users, matches, description). No 403 guard.
- **Required**: Return `403 Forbidden` if the authenticated user is not in `group.Users`
- **Impact**: Spec (FR-003 as clarified) relies on 403/404 to trigger the redirect-to-dashboard behaviour for non-members. Also a security concern (data leakage).

### BC-004 — Documentation: Wrong description in `ReopenGroup` Swagger

- **Current description**: "Reopens an archived group" — incorrect
- **Correct**: "Reopens a group with MATCHED status, clearing all draw results and returning the group to OPEN"
- The domain code already enforces this correctly — this is a docs-only fix
- **Impact**: Documentation only, no functional change

---

## 3. Decision Log

### D-001: Current user storage

**Decision**: Extend localStorage to store the full `User` object (key: `mystery_gifter_user`) in addition to the JWT token.

**Rationale**: The feature requires the current user's `id` throughout (filtering groups list, determining owner role, comparing with `owner_id`). Decoding the JWT client-side is fragile; storing the user object at login time is the established pattern for this codebase and avoids an extra `/api/v1/users/me` call.

**Implementation**: New `src/lib/session.ts` with `getUser()`, `setUser(user)`, `clearUser()`. The existing `authService.ts` will call `setUser()` after each successful login/register. `clearToken()` → extended to also call `clearUser()`.

**Alternatives considered**:
- Decode JWT client-side: rejected — brittle, couples frontend to JWT structure changes
- Add `GET /api/v1/users/me` call on every page load: rejected — unnecessary latency

---

### D-002: Groups list — filtering archived groups

**Decision**: Pass `user_id={currentUserId}` without a `status` filter. Filter ARCHIVED groups client-side from each fetched page before rendering.

**Rationale**: The backend `status` filter accepts only a single enum value, making it impossible to request "OPEN or MATCHED" in one call. Making two parallel calls and merging results complicates pagination significantly. Since most users will have few archived groups, client-side filtering is acceptable for MVP.

**Tradeoff**: If a page result has many ARCHIVED groups, the visible list may have fewer than `limit` items per load. The "Load More" button appears when `offset + limit < total` (based on raw total from backend).

**Alternatives considered**:
- Two parallel API calls (OPEN + MATCHED): rejected — complicates pagination and error handling
- Backend multi-status filter (BC-005 nice-to-have): deferred to a future backend improvement

---

### D-003: Invite route placement

**Decision**: Place `/invite/[token]` as a standalone page at `app/invite/[token]/page.tsx`, outside any route group, with its own auth-handling `InviteGuard` component.

**Rationale**: The page must be reachable by unauthenticated users (to redirect to login) but also complete a join action after authentication. It doesn't use AdminLTE dashboard layout.

**Implementation**: `InviteGuard` checks `isAuthenticated()`:
- If **not authenticated**: stores `returnUrl=/invite/{token}` in `sessionStorage`, redirects to `/login`
- If **authenticated**: renders the `InviteJoinCard` which calls `POST /api/v1/invites/{token}/join`

The existing `LoginForm` is extended to read `returnUrl` from query params and redirect after successful login.

---

### D-004: Toast provider

**Decision**: Implement a `ToastProvider` React context wrapping the protected layout (`(protected)/layout.tsx`) and the invite page. Exposes a `useToast()` hook.

**Rationale**: The spec (clarification 2) requires all API failures to show a global error toast. A context-based provider is the simplest solution that allows any nested component to trigger toasts without prop-drilling.

**Implementation**: `src/components/ui/Toast/Toast.tsx` + `ToastProvider.tsx` + `useToast.ts`. Toast auto-dismisses after 4 seconds.

---

### D-005: Card flip reveal

**Decision**: Implement the reveal as a pure CSS 3D card flip using `perspective` + `rotateY`. Two faces: front (mystery icon + "Ver quem você presenteia" button) and back (recipient name + icon).

**Rationale**: No external animation library needed; browser-native CSS 3D transforms; completes in 400ms (within SC-008 constraint); works with `prefers-reduced-motion` global blanket rule already in `theme.css`.

**Alternatives considered**:
- Framer Motion: rejected — added bundle weight not justified for a single animation
- CSS `@keyframes` opacity fade: rejected — less thematic than card flip for "reveal a secret"

---

### D-006: Invite card visual design

**Decision**: The virtual invite card uses `mg-` prefixed classes, renders the group name, owner's full name, and a decorative gift icon. A "Copiar link" button and a "Compartilhar" button sit below the card.

**Rationale**: Aligns with the style guide's glassmorphism/gradient language already used in `.mg-feature-card` and `.mg-hero`.

---

## 4. Next.js Routing & Component Classification

| Path | Route Group | Component type | Reason |
|------|-------------|----------------|--------|
| `/groups` | `(protected)` | `"use client"` | Needs localStorage (token + userId), manages pagination state |
| `/groups/[id]` | `(protected)` | `"use client"` | Needs localStorage, conditional owner/member UI |
| `/invite/[token]` | none (standalone) | `"use client"` | Needs localStorage auth check, join API call |

All feature components under `components/groups/` and `components/invite/` are `"use client"` due to interactivity and localStorage access.

---

## 5. Existing Code Reuse

| Existing asset | Reuse in this feature |
|----------------|----------------------|
| `lib/auth.ts` | `getToken`, `isAuthenticated`, `clearToken` — reused as-is |
| `components/auth/AuthGuard.tsx` | Wraps group pages |
| `components/ui/Button` | Used throughout group flows |
| `components/ui/FormField` | Create group form, invite-join confirmation |
| `services/api/authService.ts` | Extended to call `setUser()` after login |
| `src/app/theme.css` | Extended with new tokens for invite card, result reveal |
