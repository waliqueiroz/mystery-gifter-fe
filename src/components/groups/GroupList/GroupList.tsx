'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Group, GroupSummary, Paging } from '@/types/api'
import { listGroups } from '@/services/api/groupService'
import { useUser } from '@/contexts/UserContext'
import { GroupCard } from '@/components/groups/GroupCard/GroupCard'
import { GroupEmptyState } from '@/components/groups/GroupEmptyState/GroupEmptyState'
import { CreateGroupModal } from '@/components/groups/CreateGroupModal/CreateGroupModal'
import { useToast } from '@/components/ui/Toast/useToast'

const PAGE_SIZE = 15

export function GroupList() {
  const user = useUser()
  const userId = user?.id ?? null
  const { showToast } = useToast()
  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [paging, setPaging] = useState<Paging>({ limit: PAGE_SIZE, offset: 0, total: 0 })
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hasMore = paging.offset + paging.limit < paging.total

  const fetchGroups = useCallback(
    async (offset: number, append: boolean) => {
      if (!userId) return
      try {
        const result = await listGroups({ userId, offset, limit: PAGE_SIZE })
        setGroups((prev) => (append ? [...prev, ...result.result] : result.result))
        setPaging(result.paging)
      } catch (err) {
        showToast({
          message: err instanceof Error ? err.message : 'Erro ao carregar grupos.',
          type: 'error',
        })
      }
    },
    [userId, showToast],
  )

  useEffect(() => {
    if (!userId) return
    async function load() {
      setLoadingInitial(true)
      try {
        await fetchGroups(0, false)
      } finally {
        setLoadingInitial(false)
      }
    }
    load()
  }, [fetchGroups, userId])

  async function handleLoadMore() {
    const nextOffset = paging.offset + paging.limit
    setLoadingMore(true)
    await fetchGroups(nextOffset, true)
    setLoadingMore(false)
  }

  function handleGroupCreated(group: Group) {
    setGroups((prev) => [
      { id: group.id, name: group.name, status: group.status, owner_id: group.owner_id, user_count: group.users.length, created_at: group.created_at, updated_at: group.updated_at },
      ...prev,
    ])
    setPaging((prev) => ({ ...prev, total: prev.total + 1 }))
    showToast({ message: 'Grupo criado com sucesso!', type: 'success' })
  }

  if (loadingInitial) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border" style={{ color: 'var(--mg-primary-hover)' }} role="status" aria-label="Carregando grupos" />
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ color: 'var(--mg-text)' }}>Meus grupos</h4>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus mr-1" aria-hidden="true" />
          Novo grupo
        </button>
      </div>

      {groups.length === 0 ? (
        <GroupEmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <>
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
          {hasMore && (
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-label="Carregando" />
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
        </>
      )}

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGroupCreated}
      />
    </>
  )
}
