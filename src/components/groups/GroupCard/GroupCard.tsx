'use client'

import Link from 'next/link'

import { GroupStatusBadge } from '@/components/groups/GroupStatusBadge/GroupStatusBadge'
import { useUser } from '@/contexts/UserContext'
import { cn } from '@/lib/cn'
import type { GroupSummary } from '@/types/api'

interface GroupCardProps {
  group: GroupSummary
}

export function GroupCard({ group }: GroupCardProps) {
  const user = useUser()
  const isOwner = user !== null && user.id === group.owner_id
  const isArchived = group.status === 'ARCHIVED'

  return (
    <Link
      href={`/groups/${group.id}`}
      data-testid="group-card"
      className={cn(
        'block rounded-card bg-mg-surface p-4 transition-colors hover:bg-mg-surface-2',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
        isArchived && 'opacity-60',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-bold text-mg-text">
              {group.name}
            </h2>
            {isOwner && (
              <span
                aria-label="Você é o dono deste grupo"
                className="shrink-0 rounded-pill bg-mg-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-btn text-mg-green"
              >
                Dono
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-mg-text-muted">
            {group.user_count}{' '}
            {group.user_count === 1 ? 'participante' : 'participantes'}
          </p>
        </div>
        <GroupStatusBadge status={group.status} />
      </div>
    </Link>
  )
}
