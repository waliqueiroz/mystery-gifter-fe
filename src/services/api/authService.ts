import type { AuthSession, LoginCredentials, CreateUserPayload, User } from '@/types/api'
import { http } from './client'

export function login(credentials: LoginCredentials): Promise<AuthSession> {
  return http<AuthSession>('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function register(payload: CreateUserPayload): Promise<AuthSession> {
  await http<User>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return login({ email: payload.email, password: payload.password })
}
