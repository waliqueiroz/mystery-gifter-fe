'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import { ErrorAlert } from '@/components/ui/ErrorAlert/ErrorAlert'
import { Icon } from '@/components/ui/Icon/Icon'
import { getUserMatch } from '@/services/api/inviteService'
import type { User } from '@/types/api'

interface ResultRevealProps {
  groupId: string
}

export function ResultReveal({ groupId }: ResultRevealProps) {
  const [recipient, setRecipient] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const revealed = recipient !== null

  async function handleReveal() {
    if (revealed) return
    setLoading(true)
    setError('')
    try {
      const user = await getUserMatch(groupId)
      setRecipient(user)
    } catch {
      setError('Erro ao carregar o resultado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-card bg-mg-surface p-6 text-center">
      {revealed ? (
        <div className="flex flex-col items-center gap-3 motion-safe:animate-reveal">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-mg-green/10 text-mg-green"
          >
            <Icon name="Gift" size={32} />
          </div>
          <p className="text-xs uppercase tracking-btn text-mg-text-muted">
            Você presenteia
          </p>
          <h3 className="text-xl font-bold text-mg-text">
            {recipient!.name} {recipient!.surname}
          </h3>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-mg-surface-2 text-mg-text-muted"
          >
            <Icon name="Gift" size={32} />
          </div>
          <p className="text-sm text-mg-text-muted">
            Você já tem um presenteado!
          </p>
          {error && <ErrorAlert message={error} className="w-full" />}
          <Button
            type="button"
            shape="pill-lg"
            loading={loading}
            onClick={handleReveal}
          >
            Ver quem você presenteia
          </Button>
        </div>
      )}
    </div>
  )
}
