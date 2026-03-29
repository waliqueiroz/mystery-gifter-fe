# Data Model: Secret Santa Group Management

**Branch**: `003-group-management` | **Date**: 2026-03-29

## TypeScript Types (additions to `src/types/api.ts`)

```typescript
// ─── Group ───────────────────────────────────────────────────────────────────

/** Backend status enum values (exact string match for API calls) */
export type GroupStatus = 'OPEN' | 'MATCHED' | 'ARCHIVED'

/**
 * Returned by GET /api/v1/groups (inside GroupSearchResult.result[])
 * Lightweight summary — no users list, no matches
 */
export interface GroupSummary {
  id: string
  name: string
  status: GroupStatus
  owner_id: string
  user_count: number
  created_at: string  // ISO 8601
  updated_at: string  // ISO 8601
}

/**
 * Returned by POST /api/v1/groups, GET /api/v1/groups/{id},
 * and most group action endpoints (reopen, archive, add/remove user, draw)
 *
 * IMPORTANT: `matches` contains ALL giver→receiver pairs.
 * The frontend MUST NOT render other members' assignments.
 * Use GET /api/v1/groups/{id}/matches/user for individual reveal only.
 */
export interface Group {
  id: string
  name: string
  description: string
  users: User[]          // full user objects
  owner_id: string
  matches: Match[]       // ⚠️ all matches — see note above
  status: GroupStatus
  created_at: string
  updated_at: string
}

/** Single match pair — used inside Group.matches */
export interface Match {
  giver_id: string
  receiver_id: string
}

// ─── Invite ──────────────────────────────────────────────────────────────────

/**
 * Returned by POST /api/v1/groups/{id}/invites
 * and GET /api/v1/groups/{id}/invites/active (BC-002, pending backend)
 *
 * The share URL is constructed as: `${window.location.origin}/invite/${id}`
 */
export interface GroupInvite {
  id: string       // UUID v7 — used as the invite token in the URL
  group_id: string
  expires_at: string  // ISO 8601
  created_at: string  // ISO 8601
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Paging {
  limit: number
  offset: number
  total: number
}

export interface GroupSearchResult {
  result: GroupSummary[]
  paging: Paging
}

// ─── Request Payloads ────────────────────────────────────────────────────────

/** Body for POST /api/v1/groups */
export interface CreateGroupPayload {
  name: string
  description?: string  // optional after BC-001 backend fix
}
```

## TypeScript Types (additions to `src/types/forms.ts`)

```typescript
/** Used by the CreateGroupModal form */
export interface CreateGroupFormData {
  name: string
  description: string
}
```

## State transitions

```
         ┌──────────┐
  create │  OPEN    │ ──── archive ──→ ARCHIVED (permanent)
         │          │
         │ [≥3 mbr] │
         │  draw    │
         └────┬─────┘
              │
              ▼
         ┌──────────┐
         │ MATCHED  │ ──── archive ──→ ARCHIVED (permanent)
         │          │
         │  reopen  │
         └────┬─────┘
              │
              ▼ (back to OPEN, matches cleared, members kept)
```

## Entity relationships

```
User  ─────────────────────┐
  │ owns 0..*              │ is member of 0..*
  ▼                        ▼
Group ────────── has 0..* GroupInvite (time-limited tokens)
  │
  └── has 0..* Match (giver → receiver, set after draw)
```

## Key validation rules (frontend enforces)

| Rule | Source |
|------|--------|
| Group name required | FR-002, `CreateGroupDTO.name validate:"required"` |
| Description max 255 chars | `CreateGroupDTO.description validate:"max=255"` |
| Draw button disabled when `group.users.length < 3` | FR-014 |
| Draw button disabled when `group.status !== 'OPEN'` | FR-014 |
| Remove member disabled when `group.status !== 'OPEN'` | FR-013 |
| Invite section hidden when `status === 'MATCHED' \| 'ARCHIVED'` | FR-017 |
| Reopen only when `status === 'MATCHED'` | FR-020, domain `Reopen()` |
| Archive only when `status === 'OPEN' \| 'MATCHED'` | FR-021 |

## localStorage schema

| Key | Value | Set by | Cleared by |
|-----|-------|--------|-----------|
| `mystery_gifter_token` | JWT string | `lib/auth.setToken()` | `lib/auth.clearToken()` |
| `mystery_gifter_user` | `JSON.stringify(User)` | `lib/session.setUser()` | `lib/session.clearUser()` |

Both keys are cleared together on logout and on 401 responses.
