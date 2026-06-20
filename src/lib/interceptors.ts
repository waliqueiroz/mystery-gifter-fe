import { clearToken, getToken } from '@/lib/auth'
import {
  ApiRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  SessionExpiredError,
  UnauthorizedError,
} from '@/lib/errors'
import type { ApiError } from '@/types/api'
import type { ResponseInterceptor } from '@/lib/httpClient'

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

export function createSessionExpiryInterceptor(skipPaths: string[]): ResponseInterceptor {
  return async (response, url) => {
    if (response.status === 401 && !skipPaths.some((p) => url.endsWith(p))) {
      clearToken()
      window.location.href = '/login'
      throw new SessionExpiredError()
    }
    return response
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function httpErrorInterceptor(response: Response, _url: string): Promise<Response> {
  if (!response.ok) {
    const body: ApiError = await response.json()
    const message = body.message ?? 'Ocorreu um erro. Tente novamente.'
    if (response.status === 401) throw new UnauthorizedError(message)
    if (response.status === 403) throw new ForbiddenError(message)
    if (response.status === 404) throw new NotFoundError(message)
    if (response.status === 409) throw new ConflictError(message)
    throw new ApiRequestError(message, response.status, body.code ?? 'unknown')
  }
  return response
}
