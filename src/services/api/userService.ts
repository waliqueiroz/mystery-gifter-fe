import type { User } from '@/types/api'
import { http } from './client'

export function getUserById(userId: string): Promise<User> {
  return http<User>(`/api/v1/users/${userId}`)
}
