'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { GroupCard } from '@/components/groups/GroupCard/GroupCard'
import { GroupEmptyState } from '@/components/groups/GroupEmptyState/GroupEmptyState'
import { GroupFilters } from '@/components/groups/GroupFilters/GroupFilters'
import { Button } from '@/components/ui/Button/Button'
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import { Icon } from '@/components/ui/Icon/Icon'
import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { useToast } from '@/hooks/useToast'
import { useUser } from '@/contexts/UserContext'
import { useDelayedFlag } from '@/hooks/useDelayedFlag'
import { listGroups } from '@/services/api/groupService'
import type { GroupFilterParams, GroupSummary, Paging } from '@/types/api'
import { DEFAULT_GROUP_FILTERS } from '@/types/api'

const PAGE_SIZE = 15
const SKELETON_PLACEHOLDER_COUNT = 5

function SkeletonList() {
  return (
    <div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-3" data-testid="group-list-skeleton">
      {Array.from({ length: SKELETON_PLACEHOLDER_COUNT }).map((_, i) => (
        <SkeletonBox key={i} height={72} borderRadius={8} />
      ))}
    </div>
  )
}

export function GroupList() {
  const user = useUser()
  const userId = user?.id ?? null
  const { showToast } = useToast()

  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [paging, setPaging] = useState<Paging>({
    limit: PAGE_SIZE,
    offset: 0,
    total: 0,
  })
  const [filters, setFilters] = useState<GroupFilterParams>(
    DEFAULT_GROUP_FILTERS,
  )
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingFilter, setLoadingFilter] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoadingForSkeleton = loadingInitial || loadingFilter
  const showSkeleton = useDelayedFlag(isLoadingForSkeleton, 150)
  const hasMore = paging.offset + paging.limit < paging.total

  const fetchGroups = useCallback(
    async (
      offset: number,
      append: boolean,
      activeFilters: GroupFilterParams,
    ) => {
      if (!userId) return
      try {
        const result = await listGroups({
          userId,
          offset,
          limit: PAGE_SIZE,
          name: activeFilters.name || undefined,
          statuses: activeFilters.statuses,
          sortDirection: activeFilters.sortDirection,
        })
        setGroups((prev) =>
          append ? [...prev, ...result.result] : result.result,
        )
        setPaging(result.paging)
      } catch {
        const message = 'Erro ao carregar os grupos.'
        if (append) {
          showToast({ message, type: 'error' })
        } else {
          setError(message)
        }
      }
    },
    [userId, showToast],
  )

  useEffect(() => {
    if (!userId) return
    async function load() {
      setLoadingInitial(true)
      setError(null)
      try {
        await fetchGroups(0, false, filters)
      } finally {
        setLoadingInitial(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGroups, userId])

  async function handleFilterChange(next: GroupFilterParams) {
    setFilters(next)
    setError(null)
    setLoadingFilter(true)
    await fetchGroups(0, false, next)
    setLoadingFilter(false)
  }

  async function handleLoadMore() {
    const nextOffset = paging.offset + paging.limit
    setLoadingMore(true)
    await fetchGroups(nextOffset, true, filters)
    setLoadingMore(false)
  }

  async function handleRetry() {
    setError(null)
    setLoadingInitial(true)
    try {
      await fetchGroups(0, false, filters)
    } finally {
      setLoadingInitial(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-mg-text">Meus grupos</h1>
        <Link href="/groups/new" className="contents">
          <Button
            shape="pill"
            size="sm"
            iconLeft={<Icon name="Plus" size={14} />}
          >
            Novo grupo
          </Button>
        </Link>
      </header>

      <GroupFilters filters={filters} onChange={handleFilterChange} />

      {error ? (
        <EmptyState
          variant="error"
          icon={<Icon name="CircleAlert" size={28} />}
          title="Erro ao carregar grupos"
          description={error}
          cta={{ label: 'Tentar novamente', onClick: handleRetry }}
        />
      ) : showSkeleton ? (
        <SkeletonList />
      ) : loadingInitial ? (
        null
      ) : groups.length === 0 ? (
        <GroupEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 desk:grid-cols-2 xl:grid-cols-3" data-testid="group-card-grid">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                shape="pill"
                size="sm"
                onClick={handleLoadMore}
                loading={loadingMore}
              >
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
