import { getToken, clearToken } from '@/lib/auth'
import {
  ApiRequestError,
  SessionExpiredError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/errors'
import type { ApiError } from '@/types/api'

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  options: { authenticated?: boolean } = {},
): Promise<T> {
  const { authenticated = true } = options
  const token = authenticated ? getToken() : null
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init?.headers,
  }
  const response = await fetch(path, { ...init, headers })

  if (authenticated && response.status === 401) {
    clearToken()
    throw new SessionExpiredError()
  }

  if (!response.ok) {
    const body: ApiError = await response.json()
    const message = body.message ?? 'Ocorreu um erro. Tente novamente.'

    if (response.status === 404) throw new NotFoundError(message)
    if (response.status === 403) throw new ForbiddenError(message)
    throw new ApiRequestError(message, response.status, body.code ?? 'unknown')
  }

  return response.json() as Promise<T>
}
