'use client'

import { useState } from 'react'
import type { Group, User } from '@/types/api'
import { removeMember } from '@/services/api/groupService'

interface MemberListProps {
  group: Group
  currentUserId: string
  onGroupUpdate: (group: Group) => void
}

export function MemberList({ group, currentUserId, onGroupUpdate }: MemberListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const isOwner = currentUserId === group.owner_id
  const canRemove = group.status === 'OPEN'

  async function handleRemove(user: User) {
    setRemovingId(user.id)
    try {
      const updated = await removeMember(group.id, user.id)
      onGroupUpdate(updated)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div>
      <h6 className="mb-3" style={{ color: 'var(--mg-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
        Participantes ({group.users.length})
      </h6>
      <ul className="list-group">
        {group.users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex align-items-center justify-content-between"
            style={{ backgroundColor: 'var(--mg-bg-card)', border: '1px solid rgba(107,70,193,0.15)', color: 'var(--mg-text)' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-user-circle fa-lg" style={{ color: 'var(--mg-text-muted)' }} aria-hidden="true" />
              <span>
                {user.name} {user.surname}
                {user.id === group.owner_id && (
                  <span className="ml-2 badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                    dono
                  </span>
                )}
              </span>
            </div>
            {isOwner && user.id !== currentUserId && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemove(user)}
                disabled={!canRemove || removingId === user.id}
                title={canRemove ? 'Remover participante' : 'Não é possível remover após o sorteio'}
                aria-label={`Remover ${user.name}`}
              >
                {removingId === user.id ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-label="Removendo" />
                ) : (
                  <i className="fas fa-times" aria-hidden="true" />
                )}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
