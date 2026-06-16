'use client'

import Link from 'next/link'
import type { GroupSummary } from '@/types/api'
import { GroupStatusBadge } from '@/components/groups/GroupStatusBadge/GroupStatusBadge'
import { useUser } from '@/contexts/UserContext'

interface GroupCardProps {
  group: GroupSummary
}

export function GroupCard({ group }: GroupCardProps) {
  const user = useUser()
  const isOwner = user !== null && user.id === group.owner_id

  return (
    <Link href={`/groups/${group.id}`} className="text-decoration-none">
      <div
        className="card mb-3"
        style={{
          backgroundColor: 'var(--mg-bg-card)',
          border: '1px solid rgba(107,70,193,0.2)',
          transition: 'border-color var(--mg-transition)',
          cursor: 'pointer',
          opacity: group.status === 'ARCHIVED' ? 0.6 : 1,
        }}
      >
        <div className="card-body d-flex align-items-center justify-content-between gap-2">
          <div style={{ minWidth: 0 }}>
            <h5 className="mb-1 text-truncate" style={{ color: 'var(--mg-text)' }}>
              {group.name}
              {isOwner && (
                <span
                  className="badge badge-primary mg-owner-badge ml-2"
                  style={{ fontSize: '0.65rem', verticalAlign: 'middle' }}
                  aria-label="Você é o dono deste grupo"
                >
                  Dono
                </span>
              )}
            </h5>
            <small style={{ color: 'var(--mg-text-muted)' }}>
              {group.user_count} {group.user_count === 1 ? 'participante' : 'participantes'}
            </small>
          </div>
          <div style={{ flexShrink: 0 }}>
            <GroupStatusBadge status={group.status} />
          </div>
        </div>
      </div>
    </Link>
  )
}
