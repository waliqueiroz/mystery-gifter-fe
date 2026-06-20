import type { Group, GroupSearchResult, CreateGroupPayload, ListGroupsParams } from '@/types/api'
import { http } from './client'

export function listGroups({
  userId,
  offset = 0,
  limit = 15,
  name,
  statuses = ['OPEN', 'MATCHED'],
  sortDirection = 'DESC',
}: ListGroupsParams): Promise<GroupSearchResult> {
  const params = new URLSearchParams({
    user_id: userId,
    limit: String(limit),
    offset: String(offset),
    sort_by: 'created_at',
    sort_direction: sortDirection,
  })
  if (name) params.set('name', name)
  statuses.forEach((s) => params.append('status', s))
  return http<GroupSearchResult>(`/api/v1/groups?${params.toString()}`)
}

export function createGroup(payload: CreateGroupPayload): Promise<Group> {
  return http<Group>('/api/v1/groups', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getGroup(groupId: string): Promise<Group> {
  return http<Group>(`/api/v1/groups/${groupId}`)
}

export function removeMember(groupId: string, userId: string): Promise<Group> {
  return http<Group>(`/api/v1/groups/${groupId}/users/${userId}`, {
    method: 'DELETE',
  })
}

export function generateDraw(groupId: string): Promise<Group> {
  return http<Group>(`/api/v1/groups/${groupId}/matches`, {
    method: 'POST',
  })
}

export function reopenGroup(groupId: string): Promise<Group> {
  return http<Group>(`/api/v1/groups/${groupId}/reopen`, {
    method: 'POST',
  })
}

export function archiveGroup(groupId: string): Promise<Group> {
  return http<Group>(`/api/v1/groups/${groupId}/archive`, {
    method: 'POST',
  })
}
