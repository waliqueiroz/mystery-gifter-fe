# Research: Secret Santa Group Management

**Branch**: `003-group-management` | **Date**: 2026-03-29 (updated: backend audit v2)

## 1. Backend API Audit

**Source**: `/Users/waliqueiroz/Documents/projetos/mystery-gifter-api/`
**Backend status**: All previously identified gaps (BC-001 through BC-004) have been resolved.

### Endpoints Available

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | /api/v1/groups | Bearer | Paginated search; `user_id` filter scopes to member groups |
| POST | /api/v1/groups | Bearer | Creates group; authenticated user becomes owner |
| GET | /api/v1/groups/{groupID} | Bearer | Full `GroupDTO`; returns 403 if requester is not a member |
| DELETE | /api/v1/groups/{groupID}/users/{userID} | Bearer | Owner-only; group must be OPEN |
| POST | /api/v1/groups/{groupID}/matches | Bearer | Owner-only; requires ≥ 3 members and OPEN status |
| GET | /api/v1/groups/{groupID}/matches/user | Bearer | Returns `UserDTO` of the current user's recipient |
| POST | /api/v1/groups/{groupID}/reopen | Bearer | Owner-only; only works on MATCHED groups (not ARCHIVED) |
| POST | /api/v1/groups/{groupID}/archive | Bearer | Owner-only; works on OPEN and MATCHED groups |
| POST | /api/v1/groups/{groupID}/invites | Bearer | Owner-only — creates a new time-limited invite |
| GET | /api/v1/groups/{groupID}/invites/active | Bearer | Any member — returns the most recent non-expired invite; 404 if none |
| POST | /api/v1/invites/{inviteID}/join | Bearer | Any authenticated user; adds them to the group |

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

## 2. Backend Gap Status (all resolved)

| # | Gap | Status |
|---|-----|--------|
| BC-001 | `description` optional in `CreateGroupDTO` | ✅ Fixed — `validate:"omitempty,max=255"` |
| BC-002 | `GET /api/v1/groups/{groupID}/invites/active` for all members | ✅ Added — 403 if not member, 404 if no active invite |
| BC-003 | Membership check on `GET /api/v1/groups/{groupID}` | ✅ Fixed — `group.CanView()` called in service layer; returns 403 |
| BC-004 | Correct Swagger description for `ReopenGroup` | ✅ Fixed — now reads "Reopens a group with MATCHED status" |

No outstanding backend gaps. Implementation can proceed without degraded fallbacks.

---

## 3. Decision Log

### D-001: Current user storage

**Decision**: Extend localStorage to store the full `User` object (key: `mystery_gifter_user`) in addition to the JWT token.

**Rationale**: The feature requires the current user's `id` throughout (filtering groups list, determining owner role, comparing with `owner_id`). Decoding the JWT client-side is fragile; storing the user object at login time is the established pattern for this codebase and avoids an extra API call.

**Implementation**: New `src/lib/session.ts` with `getUser()`, `setUser(user)`, `clearUser()`. The existing `authService.ts` calls `setUser()` after each successful login/register. `clearToken()` is extended to also call `clearUser()`.

**Alternatives considered**:
- Decode JWT client-side: rejected — brittle, couples frontend to JWT structure changes
- `GET /api/v1/users/me` call on every page load: rejected — unnecessary latency

---

### D-002: Groups list — filtering archived groups

**Decision**: Pass `user_id={currentUserId}&status=OPEN&status=MATCHED` to the search endpoint. The backend now supports multi-value status filtering via repeated query params (`collectionFormat: multi`).

**Rationale**: The backend `Statuses []GroupStatus` field accepts multiple values. Sending `?status=OPEN&status=MATCHED` returns only active (non-archived) groups server-side, making pagination fully accurate with no client-side filtering needed.

**Implementation**:
```typescript
const params = new URLSearchParams({
  user_id: currentUserId,
  limit: '15',
  offset: String(offset),
  sort_by: 'created_at',
  sort_direction: 'DESC',
})
params.append('status', 'OPEN')
params.append('status', 'MATCHED')
```

**Alternatives considered**:
- Client-side filtering (previous plan): superseded — server-side is cleaner and pagination is reliable
- Two parallel API calls (OPEN + MATCHED): rejected — unnecessary now that multi-value is supported

---

### D-003: Invite route placement

**Decision**: Place `/invite/[token]` as a standalone page at `app/invite/[token]/page.tsx`, outside any route group, with its own auth-handling `InviteGuard` component.

**Rationale**: The page must be reachable by unauthenticated users (to redirect to login) but also complete a join action after authentication. It does not use the AdminLTE dashboard layout.

**Implementation**: `InviteGuard` checks `isAuthenticated()`:
- If **not authenticated**: stores `returnUrl=/invite/{token}` in `sessionStorage`, redirects to `/login`
- If **authenticated**: renders the `InviteJoinCard` which calls `POST /api/v1/invites/{token}/join`

The existing `LoginForm` is extended to read `returnUrl` from query params and redirect after successful login.

---

### D-004: Toast provider

**Decision**: Implement a `ToastProvider` React context wrapping the protected layout (`(protected)/layout.tsx`) and the invite page. Exposes a `useToast()` hook.

**Rationale**: All API failures display a global error toast (clarification 2). A context-based provider allows any nested component to trigger toasts without prop-drilling.

**Implementation**: `src/components/ui/Toast/Toast.tsx` + `ToastProvider.tsx` + `useToast.ts`. Toast auto-dismisses after 4 seconds.

---

### D-005: Card flip reveal

**Decision**: Implement the reveal as a pure CSS 3D card flip using `perspective` + `rotateY`. Two faces: front (mystery icon + "Ver quem você presenteia" button) and back (recipient name + icon).

**Rationale**: No external animation library needed; browser-native CSS 3D transforms; completes in 400ms (within SC-008 constraint); works with `prefers-reduced-motion` global blanket rule already in `theme.css`.

**Alternatives considered**:
- Framer Motion: rejected — added bundle weight not justified for a single animation
- CSS `@keyframes` opacity fade: rejected — less thematic for a "reveal a secret" experience

---

### D-006: Invite display for all members (updated after BC-002)

**Decision**: The `InviteSection` component calls `GET /api/v1/groups/{groupID}/invites/active` for all members (owner and non-owner). Response shapes:
- **200**: render the invite card with copy/share for all members.
- **404**: owner sees "Gerar link de convite" button (calls `POST /api/v1/groups/{id}/invites`); non-owners see "Peça ao dono para gerar o link de convite."

**Rationale**: The backend now exposes a member-accessible GET endpoint. All members benefit from the invite card once any active invite exists. Only the owner can create one when none is active.

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
| `lib/auth.ts` | `getToken`, `isAuthenticated`, `clearToken` — reused, `clearToken` extended |
| `components/auth/AuthGuard.tsx` | Wraps group pages |
| `components/ui/Button` | Used throughout group flows |
| `components/ui/FormField` | Create group form |
| `services/api/authService.ts` | Extended to call `setUser()` after login |
| `src/app/theme.css` | Extended with new tokens for invite card, result reveal, status badges, toast |
