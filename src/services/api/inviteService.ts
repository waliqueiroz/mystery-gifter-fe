import type { GroupInvite, Group, User } from '@/types/api'
import { http } from './client'
import {
  ConflictError,
  DrawCompletedError,
  InvalidInviteError,
  NotFoundError,
} from '@/lib/errors'

export function getActiveInvite(groupId: string): Promise<GroupInvite> {
  return http<GroupInvite>(`/api/v1/groups/${groupId}/invites/active`)
}

export function createInvite(groupId: string): Promise<GroupInvite> {
  return http<GroupInvite>(`/api/v1/groups/${groupId}/invites`, {
    method: 'POST',
  })
}

export async function joinGroup(inviteToken: string): Promise<Group> {
  try {
    return await http<Group>(`/api/v1/invites/${inviteToken}/join`, {
      method: 'POST',
    })
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new InvalidInviteError(err.message, 404)
    }

    if (err instanceof ConflictError) {
      if (err.message === 'invite has expired') {
        throw new InvalidInviteError(err.message, 409)
      }
      throw new DrawCompletedError(err.message)
    }

    throw err
  }
}

export function getUserMatch(groupId: string): Promise<User> {
  return http<User>(`/api/v1/groups/${groupId}/matches/user`)
}
