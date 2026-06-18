import type { User } from '@/types/api'
import { apiFetch } from './apiClient'

export function getUserById(userId: string): Promise<User> {
  return apiFetch<User>(`/api/v1/users/${userId}`)
}
