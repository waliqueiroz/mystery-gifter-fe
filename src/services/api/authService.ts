import type { AuthSession, LoginCredentials, CreateUserPayload, User } from '@/types/api'
import { ApiRequestError, ConflictError, InvalidCredentialsError } from '@/lib/errors'
import { createHttpClient } from './httpClient'
import { contentTypeInterceptor, httpErrorInterceptor } from './interceptors'

const publicFetch = createHttpClient({
  requestInterceptors: [contentTypeInterceptor],
  responseInterceptors: [httpErrorInterceptor],
})

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  try {
    return await publicFetch<AuthSession>('/api/v1/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) {
      throw new InvalidCredentialsError('E-mail ou senha inválidos.')
    }
    throw err
  }
}

export async function register(payload: CreateUserPayload): Promise<AuthSession> {
  try {
    await publicFetch<User>('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 409) {
      throw new ConflictError('Este e-mail já está em uso.')
    }
    throw err
  }
  return login({ email: payload.email, password: payload.password })
}
