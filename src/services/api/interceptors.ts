import { getToken, clearToken } from '@/lib/auth'
import {
  ApiRequestError,
  ForbiddenError,
  NotFoundError,
  SessionExpiredError,
} from '@/lib/errors'
import type { ApiError } from '@/types/api'

export function contentTypeInterceptor(init: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  }
}

export function authTokenInterceptor(init: RequestInit): RequestInit {
  const token = getToken()
  if (!token) return init
  return {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

export async function sessionExpiryInterceptor(response: Response): Promise<Response> {
  if (response.status === 401) {
    clearToken()
    throw new SessionExpiredError()
  }
  return response
}

export async function httpErrorInterceptor(response: Response): Promise<Response> {
  if (!response.ok) {
    const body: ApiError = await response.json()
    const message = body.message ?? 'Ocorreu um erro. Tente novamente.'
    if (response.status === 404) throw new NotFoundError(message)
    if (response.status === 403) throw new ForbiddenError(message)
    throw new ApiRequestError(message, response.status, body.code ?? 'unknown')
  }
  return response
}
