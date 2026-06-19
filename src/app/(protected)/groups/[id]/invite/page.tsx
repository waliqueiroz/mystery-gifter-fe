'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import Button from '@/components/ui/Button/Button'
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import { Icon } from '@/components/ui/Icon/Icon'
import { SkeletonBox } from '@/components/ui/Skeleton/SkeletonBox'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'
import { useToast } from '@/hooks/useToast'
import { useUser } from '@/contexts/UserContext'
import { cn } from '@/lib/cn'
import { useDelayedFlag } from '@/hooks/useDelayedFlag'
import { getGroup } from '@/services/api/groupService'
import { createInvite, getActiveInvite } from '@/services/api/inviteService'
import type { Group, GroupInvite } from '@/types/api'
import { NotFoundError } from '@/lib/errors'

function buildInviteUrl(token: string): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/invite/${token}`
}

export default function InvitePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useUser()
  const { showToast } = useToast()

  const [group, setGroup] = useState<Group | null>(null)
  const [invite, setInvite] = useState<GroupInvite | null>(null)
  const [hasInvite, setHasInvite] = useState(false)
  const [loadingGroup, setLoadingGroup] = useState(true)
  const [loadingInvite, setLoadingInvite] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showSkeleton = useDelayedFlag(loadingGroup || loadingInvite, 150)

  const fetchGroup = useCallback(async () => {
    try {
      const data = await getGroup(id)
      setGroup(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Não foi possível carregar o grupo.',
      )
    } finally {
      setLoadingGroup(false)
    }
  }, [id])

  const fetchInvite = useCallback(async () => {
    setLoadingInvite(true)
    try {
      const data = await getActiveInvite(id)
      setInvite(data)
      setHasInvite(true)
    } catch (err) {
      if (err instanceof NotFoundError) {
        setHasInvite(false)
        setInvite(null)
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar o convite.',
        )
      }
    } finally {
      setLoadingInvite(false)
    }
  }, [id])

  useEffect(() => {
    fetchGroup()
  }, [fetchGroup])

  useEffect(() => {
    if (!group) return
    if (group.status === 'MATCHED' || group.status === 'ARCHIVED') {
      // Sem convite quando o grupo já foi sorteado/arquivado — não carrega
      setLoadingInvite(false)
      return
    }
    fetchInvite()
  }, [group, fetchInvite])

  const isOwner = !!user && !!group && group.owner_id === user.id

  async function handleGenerate() {
    setGenerating(true)
    try {
      const newInvite = await createInvite(id)
      setInvite(newInvite)
      setHasInvite(true)
      showToast({ message: 'Convite gerado!', type: 'success' })
    } catch (err) {
      showToast({
        message:
          err instanceof Error ? err.message : 'Erro ao gerar convite.',
        type: 'error',
      })
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    if (!invite) return
    const url = buildInviteUrl(invite.id)
    try {
      await navigator.clipboard.writeText(url)
      showToast({ message: 'Link copiado!', type: 'success' })
    } catch {
      showToast({
        message: 'Não foi possível copiar o link.',
        type: 'error',
      })
    }
  }

  async function handleShare() {
    if (!invite) return
    const url = buildInviteUrl(invite.id)
    try {
      await navigator.share({ title: 'Convite para grupo', url })
    } catch {
      // usuário cancelou ou API indisponível — ignore silenciosamente
    }
  }

  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          shape="circle"
          size="sm"
          onClick={() => router.push(`/groups/${id}`)}
          aria-label="Voltar ao grupo"
        >
          <Icon name="ArrowLeft" size={18} aria-hidden />
        </Button>
        <h1 className="text-2xl font-bold text-mg-text">Convite</h1>
      </header>

      {error ? (
        <EmptyState
          variant="error"
          icon={<Icon name="CircleAlert" size={28} />}
          title="Não foi possível carregar"
          description={error}
          cta={{
            label: 'Tentar novamente',
            onClick: () => {
              setError(null)
              setLoadingGroup(true)
              fetchGroup()
            },
          }}
        />
      ) : showSkeleton ? (
        <section className="flex flex-col gap-3 rounded-card bg-mg-surface p-4">
          <SkeletonText width="70%" />
          <SkeletonBox height={48} borderRadius={9999} />
        </section>
      ) : group?.status === 'MATCHED' || group?.status === 'ARCHIVED' ? (
        <EmptyState
          icon={<Icon name="Lock" size={28} />}
          title="Convites desabilitados"
          description={
            group.status === 'MATCHED'
              ? 'O sorteio já foi realizado neste grupo.'
              : 'Este grupo foi arquivado.'
          }
          cta={{ label: 'Voltar ao grupo', href: `/groups/${id}` }}
        />
      ) : !hasInvite ? (
        <section className="flex flex-col gap-3 rounded-card bg-mg-surface p-6">
          <p className="text-sm text-mg-text-muted">
            {isOwner
              ? 'Gere um link para compartilhar com participantes.'
              : 'Nenhum link de convite ativo no momento. Peça ao dono do grupo para gerar um.'}
          </p>
          {isOwner && (
            <Button
              type="button"
              shape="pill-lg"
              loading={generating}
              onClick={handleGenerate}
              iconLeft={<Icon name="Link" size={16} />}
            >
              Gerar link de convite
            </Button>
          )}
        </section>
      ) : (
        <section
          className="flex flex-col gap-4 rounded-card bg-mg-surface p-6"
          data-testid="invite-panel"
        >
          <p className="text-sm text-mg-text-muted">
            Compartilhe o link abaixo para convidar participantes:
          </p>

          <div
            className={cn(
              'flex items-center gap-2 rounded-card bg-mg-surface-2 px-3 py-2',
              'text-xs text-mg-text break-all',
            )}
          >
            <Icon name="Link" size={14} className="shrink-0 text-mg-text-muted" />
            <span className="flex-grow font-mono">
              {buildInviteUrl(invite!.id)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              shape="pill"
              size="sm"
              onClick={handleCopy}
              iconLeft={<Icon name="Copy" size={14} />}
              aria-label="Copiar link de convite"
            >
              Copiar link
            </Button>
            {canShare && (
              <Button
                type="button"
                variant="outline"
                shape="pill"
                size="sm"
                onClick={handleShare}
                iconLeft={<Icon name="Share2" size={14} />}
                aria-label="Compartilhar link de convite"
              >
                Compartilhar
              </Button>
            )}
          </div>

          {isOwner && (
            <Link
              href={`/groups/${id}`}
              className="text-center text-xs font-semibold uppercase tracking-btn text-mg-text-muted hover:text-mg-text"
            >
              Voltar ao grupo
            </Link>
          )}
        </section>
      )}
    </div>
  )
}
