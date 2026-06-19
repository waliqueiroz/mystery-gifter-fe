import { clearUser, setUser } from './session'
import type { AuthSession } from '@/types/api'

export const TOKEN_KEY = 'mystery_gifter_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  clearUser()
}

export function setSession(session: AuthSession): void {
  setToken(session.access_token)
  setUser(session.user)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
