import type { AuthSession, LoginCredentials, CreateUserPayload } from '@/types/api'
import { setUser } from '@/lib/session'
import { ApiRequestError, ConflictError, InvalidCredentialsError } from '@/lib/errors'

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    if (response.status === 401) throw new InvalidCredentialsError('E-mail ou senha inválidos.')
    if (response.status === 409) throw new ConflictError('Este e-mail já está em uso.')
    throw new ApiRequestError('Ocorreu um erro. Tente novamente.', response.status, 'unknown')
  }

  return response.json() as Promise<T>
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const session = await authFetch<AuthSession>('/api/v1/login', credentials)
  setUser(session.user)
  return session
}

export async function register(payload: CreateUserPayload): Promise<AuthSession> {
  await authFetch<unknown>('/api/v1/users', payload)
  return login({ email: payload.email, password: payload.password })
}
