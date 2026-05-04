'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinGroup } from '@/services/api/inviteService'
import Button from '@/components/ui/Button/Button'

interface InviteJoinCardProps {
  token: string
}

enum JoinStatus {
  Idle = 'idle',
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
  const [status, setStatus] = useState<JoinStatus>(JoinStatus.Idle)

  async function handleJoin() {
    setStatus(JoinStatus.Loading)
    try {
      const group = await joinGroup(token)
      router.push(`/groups/${group.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message.toLowerCase().includes('draw') || message.toLowerCase().includes('matched')) {
        setStatus(JoinStatus.DrawCompleted)
      } else if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('expired') || message.toLowerCase().includes('not found')) {
        setStatus(JoinStatus.Invalid)
      } else {
        setStatus(JoinStatus.Error)
      }
    }
  }

  const errorMessage = STATUS_MESSAGES[status]

  return (
    <div className="card text-center" style={{ backgroundColor: 'var(--mg-bg-card)', border: '1px solid rgba(107,70,193,0.3)' }}>
      <div className="card-body py-5">
        <i
          className="fas fa-gift fa-4x mb-4"
          style={{ color: 'var(--mg-primary-hover)' }}
          aria-hidden="true"
        />
        <h4 className="mb-2" style={{ color: 'var(--mg-text)' }}>
          Você foi convidado!
        </h4>
        <p className="mb-4" style={{ color: 'var(--mg-text-muted)' }}>
          Clique no botão abaixo para entrar no grupo de Amigo Secreto.
        </p>

        {errorMessage && (
          <div className="alert alert-danger mb-4" role="alert">
            {errorMessage}
          </div>
        )}

        {status !== JoinStatus.DrawCompleted && status !== JoinStatus.Invalid && (
          <Button
            type="button"
            loading={status === JoinStatus.Loading}
            onClick={handleJoin}
            disabled={status === JoinStatus.Loading}
          >
            Entrar no grupo
          </Button>
        )}
      </div>
    </div>
  )
}
