'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'
import { GroupStatusBadge } from '@/components/groups/GroupStatusBadge/GroupStatusBadge'
import { InviteSection } from '@/components/groups/InviteSection/InviteSection'
import { getGroup } from '@/services/api/groupService'
import { getUser } from '@/lib/session'
import { useToast } from '@/components/ui/Toast/useToast'
import type { Group } from '@/types/api'

function GroupDetailContent() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  const currentUser = getUser()
  const isOwner = !!currentUser && group?.owner_id === currentUser.id

  useEffect(() => {
    async function load() {
      try {
        const data = await getGroup(id)
        setGroup(data)
      } catch (err) {
        showToast({
          message: err instanceof Error ? err.message : 'Grupo não encontrado.',
          type: 'error',
        })
        router.push('/groups')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router, showToast])

  if (loading) {
    return (
      <div className="text-center py-5">
        <span
          className="spinner-border"
          style={{ color: 'var(--mg-primary-hover)' }}
          role="status"
          aria-label="Carregando grupo"
        />
      </div>
    )
  }

  if (!group) return null

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col">
              <h1 className="m-0 d-flex align-items-center gap-2" style={{ color: 'var(--mg-text)' }}>
                {group.name}
                <GroupStatusBadge status={group.status} />
              </h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card" style={{ backgroundColor: 'var(--mg-bg-card)', border: '1px solid rgba(107,70,193,0.15)' }}>
            <div className="card-body">
              <h6 className="mb-3" style={{ color: 'var(--mg-text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Convite
              </h6>
              <InviteSection
                groupId={group.id}
                isOwner={isOwner}
                groupStatus={group.status}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function GroupDetailPage() {
  return (
    <AuthGuard>
      <GroupDetailContent />
    </AuthGuard>
  )
}
