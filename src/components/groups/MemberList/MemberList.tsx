'use client'

import { useState } from 'react'

import { MemberProfileSheet } from '@/components/groups/MemberProfileSheet/MemberProfileSheet'
import Button from '@/components/ui/Button/Button'
import { Icon } from '@/components/ui/Icon/Icon'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/cn'
import { removeMember } from '@/services/api/groupService'
import type { Group, User } from '@/types/api'

interface MemberListProps {
  group: Group
  currentUserId: string
  onGroupUpdate: (group: Group) => void
}

export function MemberList({
  group,
  currentUserId,
  onGroupUpdate,
}: MemberListProps) {
  const { showToast } = useToast()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const isOwner = currentUserId === group.owner_id
  const canRemove = group.status === 'OPEN'

  async function handleRemove(user: User) {
    setRemovingId(user.id)
    try {
      const updated = await removeMember(group.id, user.id)
      onGroupUpdate(updated)
    } catch {
      showToast({
        message: 'Erro ao remover o participante.',
        type: 'error',
      })
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-btn text-mg-text-muted">
        Participantes ({group.users.length})
      </h2>
      <ul className="flex flex-col gap-2">
        {group.users.map((user) => {
          const isUserOwner = user.id === group.owner_id
          const canDelete = isOwner && user.id !== currentUserId
          return (
            <li
              key={user.id}
              className={cn(
                'flex items-center justify-between gap-2 rounded-card bg-mg-surface px-3 py-2',
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedUserId(user.id)}
                aria-label={`Ver perfil de ${user.name} ${user.surname}`}
                className={cn(
                  'flex flex-grow items-center gap-2 rounded-card px-1 py-1 text-left text-sm text-mg-text',
                  'transition-colors hover:bg-mg-surface-2',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
                )}
              >
                <Icon
                  name="User"
                  size={20}
                  className="shrink-0 text-mg-text-muted"
                />
                <span className="truncate">
                  {user.name} {user.surname}
                </span>
                {isUserOwner && (
                  <span className="shrink-0 rounded-pill bg-mg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-btn text-mg-text-muted">
                    Dono
                  </span>
                )}
              </button>
              {canDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  shape="circle"
                  size="sm"
                  onClick={() => handleRemove(user)}
                  loading={removingId === user.id}
                  disabled={!canRemove}
                  aria-label={`Remover ${user.name}`}
                  className={cn(
                    'text-mg-text-negative hover:bg-mg-text-negative/10',
                    !canRemove && 'opacity-50',
                  )}
                  title={
                    canRemove
                      ? 'Remover participante'
                      : 'Não é possível remover após o sorteio'
                  }
                >
                  <Icon name="X" size={16} aria-hidden />
                </Button>
              )}
            </li>
          )
        })}
      </ul>
      <MemberProfileSheet
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </section>
  )
}
