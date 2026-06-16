/** Returned by POST /api/v1/login on success */
export interface AuthSession {
  user: User
  access_token: string
  token_type: 'Bearer'
  expires_in: number
}

/** Returned by POST /api/v1/users on success (201) */
export interface User {
  id: string
  name: string
  surname: string
  email: string
  created_at: string
  updated_at: string
}

/** Returned by the API on error */
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

/** Body for POST /api/v1/login */
export interface LoginCredentials {
  email: string
  password: string
}

/** Body for POST /api/v1/users */
export interface CreateUserPayload {
  name: string
  surname: string
  email: string
  password: string
  password_confirm: string
}

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
  created_at: string
  updated_at: string
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
  users: User[]
  owner_id: string
  matches: Match[]
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
 * and GET /api/v1/groups/{id}/invites/active
 *
 * The share URL is constructed as: `${window.location.origin}/invite/${id}`
 */
export interface GroupInvite {
  id: string
  group_id: string
  expires_at: string
  created_at: string
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
  description?: string
}

// ─── Group Filters ────────────────────────────────────────────────────────────

/** Active filter/sort state for the groups list */
export interface GroupFilterParams {
  name: string
  statuses: GroupStatus[]
  sortDirection: 'ASC' | 'DESC'
}

export const DEFAULT_GROUP_FILTERS: GroupFilterParams = {
  name: '',
  statuses: ['OPEN', 'MATCHED'],
  sortDirection: 'DESC',
}
