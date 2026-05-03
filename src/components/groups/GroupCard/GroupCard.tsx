'use client'

import Link from 'next/link'
import type { GroupSummary } from '@/types/api'
import { GroupStatusBadge } from '@/components/groups/GroupStatusBadge/GroupStatusBadge'

interface GroupCardProps {
  group: GroupSummary
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`} className="text-decoration-none">
      <div
        className="card mb-3"
        style={{
          backgroundColor: 'var(--mg-bg-card)',
          border: '1px solid rgba(107,70,193,0.2)',
          transition: 'border-color var(--mg-transition)',
          cursor: 'pointer',
        }}
      >
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-1" style={{ color: 'var(--mg-text)' }}>
              {group.name}
            </h5>
            <small style={{ color: 'var(--mg-text-muted)' }}>
              {group.user_count} {group.user_count === 1 ? 'participante' : 'participantes'}
            </small>
          </div>
          <GroupStatusBadge status={group.status} />
        </div>
      </div>
    </Link>
  )
}
