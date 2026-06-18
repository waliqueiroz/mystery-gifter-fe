'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button/Button'
import { joinGroup } from '@/services/api/inviteService'
import { DrawCompletedError, InvalidInviteError } from '@/lib/errors'

interface InviteJoinCardProps {
  token: string
}

enum JoinStatus {
  Loading = 'loading',
  DrawCompleted = 'draw_completed',
  Invalid = 'invalid',
  Error = 'error',
}

const STATUS_MESSAGES: Partial<Record<JoinStatus, string>> = {
  [JoinStatus.DrawCompleted]:
    'O sorteio deste grupo já foi realizado. Peça ao dono para reabrir o grupo antes de entrar.',
  [JoinStatus.Invalid]: 'Este link de convite é inválido ou expirou.',
  [JoinStatus.Error]: 'Ocorreu um erro ao entrar no grupo. Tente novamente.',
}

export function InviteJoinCard({ token }: InviteJoinCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<JoinStatus | null>(null)

  async function handleJoin() {
    setStatus(JoinStatus.Loading)
    try {
      const group = await joinGroup(token)
      router.push(`/groups/${group.id}`)
    } catch (err) {
      if (err instanceof DrawCompletedError) {
        setStatus(JoinStatus.DrawCompleted)
      } else if (err instanceof InvalidInviteError) {
        setStatus(JoinStatus.Invalid)
      } else {
        setStatus(JoinStatus.Error)
      }
    }
  }

  const errorMessage = status !== null ? STATUS_MESSAGES[status] : undefined

  return (
    <div className="rounded-card bg-mg-surface p-8 text-center">
      <div className="flex h-20 w-20 mx-auto mb-6 items-center justify-center rounded-full bg-mg-surface-2 text-mg-green text-4xl">
        🎁
      </div>

      <h2 className="text-xl font-bold text-mg-text mb-2">Você foi convidado!</h2>
      <p className="text-mg-text-muted mb-6">
        Clique no botão abaixo para entrar no grupo de Amigo Secreto.
      </p>

      {errorMessage && (
        <p
          role="alert"
          className="mb-6 rounded-pill bg-mg-surface-2 px-4 py-3 text-sm text-mg-text-negative"
        >
          {errorMessage}
        </p>
      )}

      {status !== JoinStatus.DrawCompleted && status !== JoinStatus.Invalid && (
        <Button
          type="button"
          loading={status === JoinStatus.Loading}
          disabled={status === JoinStatus.Loading}
          onClick={handleJoin}
        >
          Entrar no grupo
        </Button>
      )}
    </div>
  )
}
