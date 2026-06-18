import type { GroupInvite, Group, User } from '@/types/api'
import { getToken, clearToken } from '@/lib/auth'
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
    const body: ApiError = await response.json()
    const err = new Error(body.message ?? 'Ocorreu um erro. Tente novamente.')
    ;(err as Error & { status: number }).status = response.status
    throw err
  }

  return response.json() as Promise<T>
}

export function getActiveInvite(groupId: string): Promise<GroupInvite> {
  return apiFetch<GroupInvite>(`/api/v1/groups/${groupId}/invites/active`)
}

export function createInvite(groupId: string): Promise<GroupInvite> {
  return apiFetch<GroupInvite>(`/api/v1/groups/${groupId}/invites`, {
    method: 'POST',
  })
}

export function joinGroup(inviteToken: string): Promise<Group> {
  return apiFetch<Group>(`/api/v1/invites/${inviteToken}/join`, {
    method: 'POST',
  })
}

export function getUserMatch(groupId: string): Promise<User> {
  return apiFetch<User>(`/api/v1/groups/${groupId}/matches/user`)
}
