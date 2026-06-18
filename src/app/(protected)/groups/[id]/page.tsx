'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { DrawButton } from '@/components/groups/DrawButton/DrawButton'
import { GroupActions } from '@/components/groups/GroupActions/GroupActions'
import { GroupStatusBadge } from '@/components/groups/GroupStatusBadge/GroupStatusBadge'
import { InviteSection } from '@/components/groups/InviteSection/InviteSection'
import { MemberList } from '@/components/groups/MemberList/MemberList'
import { ResultReveal } from '@/components/groups/ResultReveal/ResultReveal'
import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'
import { useToast } from '@/components/ui/Toast/useToast'
import { useUser } from '@/contexts/UserContext'
import { useDelayedFlag } from '@/lib/useDelayedFlag'
import { getGroup } from '@/services/api/groupService'
import type { Group } from '@/types/api'

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" data-testid="group-detail-skeleton">
      <SkeletonText width="60%" />
      <SkeletonBox height={120} borderRadius={8} />
      <SkeletonBox height={160} borderRadius={8} />
      <SkeletonBox height={80} borderRadius={8} />
    </div>
  )
}

function GroupDetailContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const currentUser = useUser()

  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const showSkeleton = useDelayedFlag(loading, 150)

  const isOwner = !!currentUser && group?.owner_id === currentUser.id

  const load = useCallback(async () => {
    try {
      const data = await getGroup(id)
      setGroup(data)
    } catch (err) {
      showToast({
        message:
          err instanceof Error ? err.message : 'Grupo não encontrado.',
        type: 'error',
      })
      router.push('/groups')
    } finally {
      setLoading(false)
    }
  }, [id, router, showToast])

  useEffect(() => {
    load()
  }, [load])

  if (showSkeleton) return <DetailSkeleton />
  if (loading || !group) return null

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="flex-grow text-2xl font-bold text-mg-text break-words">
            {group.name}
          </h1>
          <GroupStatusBadge status={group.status} />
        </div>
        <InviteSection groupId={group.id} groupStatus={group.status} />
      </header>

      <section className="rounded-card bg-mg-surface p-4">
        <MemberList
          group={group}
          currentUserId={currentUser?.id ?? ''}
          onGroupUpdate={setGroup}
        />
      </section>

      {isOwner && group.status === 'OPEN' && (
        <section className="rounded-card bg-mg-surface p-4">
          <DrawButton group={group} onGroupUpdate={setGroup} />
        </section>
      )}

      {group.status === 'MATCHED' && (
        <section className="rounded-card bg-mg-surface p-4">
          <ResultReveal groupId={group.id} />
        </section>
      )}

      {isOwner && group.status !== 'ARCHIVED' && (
        <section className="rounded-card bg-mg-surface p-4">
          <GroupActions group={group} onGroupUpdate={setGroup} />
        </section>
      )}
    </div>
  )
}

export default function GroupDetailPage() {
  return <GroupDetailContent />
}
