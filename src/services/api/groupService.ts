import type {
  Group,
  GroupSearchResult,
  GroupStatus,
  CreateGroupPayload,
} from '@/types/api'
import { getToken } from '@/lib/auth'
import { clearToken } from '@/lib/auth'
import { clearUser } from '@/lib/session'
import type { ApiError } from '@/types/api'

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
  })

  if (response.status === 401) {
    clearToken()
    clearUser()
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message ?? 'Ocorreu um erro. Tente novamente.')
  }

  return response.json() as Promise<T>
}

export interface ListGroupsParams {
  userId: string
  offset?: number
  limit?: number
  name?: string
  statuses?: GroupStatus[]
  sortDirection?: 'ASC' | 'DESC'
}

export function listGroups({
  userId,
  offset = 0,
  limit = 15,
  name,
  statuses = ['OPEN', 'MATCHED'],
  sortDirection = 'DESC',
}: ListGroupsParams): Promise<GroupSearchResult> {
  const params = new URLSearchParams({
    user_id: userId,
    limit: String(limit),
    offset: String(offset),
    sort_by: 'created_at',
    sort_direction: sortDirection,
  })
  if (name) params.set('name', name)
  statuses.forEach((s) => params.append('status', s))
  return apiFetch<GroupSearchResult>(`/api/v1/groups?${params.toString()}`)
}

export function createGroup(payload: CreateGroupPayload): Promise<Group> {
  return apiFetch<Group>('/api/v1/groups', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getGroup(groupId: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/groups/${groupId}`)
}

export function removeMember(groupId: string, userId: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/groups/${groupId}/users/${userId}`, {
    method: 'DELETE',
  })
}

export function generateDraw(groupId: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/groups/${groupId}/matches`, {
    method: 'POST',
  })
}

export function reopenGroup(groupId: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/groups/${groupId}/reopen`, {
    method: 'POST',
  })
}

export function archiveGroup(groupId: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/groups/${groupId}/archive`, {
    method: 'POST',
  })
}
