'use client'

import { useEffect, useState } from 'react'
import type { GroupInvite, GroupStatus } from '@/types/api'
import { getActiveInvite, createInvite } from '@/services/api/inviteService'
import { useToast } from '@/components/ui/Toast/useToast'

interface InviteSectionProps {
  groupId: string
  isOwner: boolean
  groupStatus: GroupStatus
}

export function InviteSection({ groupId, isOwner, groupStatus }: InviteSectionProps) {
  const { showToast } = useToast()
  const [invite, setInvite] = useState<GroupInvite | null>(null)
  const [hasInvite, setHasInvite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (groupStatus === 'MATCHED' || groupStatus === 'ARCHIVED') {
      setLoading(false)
      return
    }

    getActiveInvite(groupId)
      .then((data) => {
        setInvite(data)
        setHasInvite(true)
      })
      .catch((err: Error) => {
        if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
          setHasInvite(false)
        }
      })
      .finally(() => setLoading(false))
  }, [groupId, groupStatus])

  if (groupStatus === 'MATCHED' || groupStatus === 'ARCHIVED') {
    return null
  }

  if (loading) {
    return (
      <div className="text-center py-3">
        <span className="spinner-border spinner-border-sm" style={{ color: 'var(--mg-primary-hover)' }} role="status" aria-label="Carregando convite" />
      </div>
    )
  }

  function getInviteUrl(token: string): string {
    return `${window.location.origin}/invite/${token}`
  }

  async function handleCopy() {
    if (!invite) return
    const url = getInviteUrl(invite.id)
    try {
      await navigator.clipboard.writeText(url)
      showToast({ message: 'Link copiado!', type: 'success' })
    } catch {
      showToast({ message: 'Não foi possível copiar o link.', type: 'error' })
    }
  }

  async function handleShare() {
    if (!invite) return
    const url = getInviteUrl(invite.id)
    try {
      await navigator.share({ title: 'Convite para grupo', url })
    } catch {
      // user cancelled or API unavailable — silently ignore
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      const newInvite = await createInvite(groupId)
      setInvite(newInvite)
      setHasInvite(true)
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Erro ao gerar convite.',
        type: 'error',
      })
    } finally {
      setGenerating(false)
    }
  }

  if (!hasInvite) {
    if (!isOwner) {
      return (
        <p className="text-muted small" style={{ color: 'var(--mg-text-muted)' }}>
          Nenhum link de convite ativo.
        </p>
      )
    }

    return (
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? (
          <>
            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-label="Gerando" />
            Gerando...
          </>
        ) : (
          <>
            <i className="fas fa-link mr-1" aria-hidden="true" />
            Gerar link de convite
          </>
        )}
      </button>
    )
  }

  return (
    <div className="mg-invite-card">
      <p className="small mb-2" style={{ color: 'var(--mg-text-muted)' }}>
        Compartilhe o link abaixo para convidar participantes:
      </p>
      <div className="d-flex gap-2 flex-wrap">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleCopy}
          aria-label="Copiar link de convite"
        >
          <i className="fas fa-copy mr-1" aria-hidden="true" />
          Copiar link
        </button>
        {'share' in navigator && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleShare}
            aria-label="Compartilhar link de convite"
          >
            <i className="fas fa-share-alt mr-1" aria-hidden="true" />
            Compartilhar
          </button>
        )}
      </div>
    </div>
  )
}
