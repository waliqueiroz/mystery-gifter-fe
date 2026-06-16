import type { User } from '@/types/api'
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

export function getUserById(userId: string): Promise<User> {
  return apiFetch<User>(`/api/v1/users/${userId}`)
}
