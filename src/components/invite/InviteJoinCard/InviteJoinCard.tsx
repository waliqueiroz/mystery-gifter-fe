'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinGroup } from '@/services/api/inviteService'
import Button from '@/components/ui/Button/Button'

interface InviteJoinCardProps {
  token: string
}

type JoinStatus = 'idle' | 'loading' | 'draw_completed' | 'invalid' | 'error'

const STATUS_MESSAGES: Partial<Record<JoinStatus, string>> = {
  draw_completed:
    'O sorteio deste grupo já foi realizado. Peça ao dono para reabrir o grupo antes de entrar.',
  invalid: 'Este link de convite é inválido ou expirou.',
  error: 'Ocorreu um erro ao entrar no grupo. Tente novamente.',
}

export function InviteJoinCard({ token }: InviteJoinCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<JoinStatus>('idle')

  async function handleJoin() {
    setStatus('loading')
    try {
      const group = await joinGroup(token)
      router.push(`/groups/${group.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message.toLowerCase().includes('draw') || message.toLowerCase().includes('matched')) {
        setStatus('draw_completed')
      } else if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('expired') || message.toLowerCase().includes('not found')) {
        setStatus('invalid')
      } else {
        setStatus('error')
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

        {status !== 'draw_completed' && status !== 'invalid' && (
          <Button
            type="button"
            loading={status === 'loading'}
            onClick={handleJoin}
            disabled={status === 'loading'}
          >
            Entrar no grupo
          </Button>
        )}
      </div>
    </div>
  )
}
