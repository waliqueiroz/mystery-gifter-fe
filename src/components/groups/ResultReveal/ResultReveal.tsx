'use client'

import { useState } from 'react'
import type { User } from '@/types/api'
import { getUserMatch } from '@/services/api/inviteService'
import Button from '@/components/ui/Button/Button'

interface ResultRevealProps {
  groupId: string
}

export function ResultReveal({ groupId }: ResultRevealProps) {
  const [flipped, setFlipped] = useState(false)
  const [recipient, setRecipient] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReveal() {
    if (flipped) return
    setLoading(true)
    setError('')
    try {
      const user = await getUserMatch(groupId)
      setRecipient(user)
      setFlipped(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mg-result-card" style={{ maxWidth: 340, margin: '0 auto' }}>
      <div className={`mg-result-card-inner${flipped ? ' flipped' : ''}`} style={{ minHeight: 200 }}>
        {/* Front face */}
        <div
          className="mg-result-card-front d-flex flex-column align-items-center justify-content-center text-center p-4"
          style={{
            backgroundColor: 'var(--mg-bg-card)',
            border: '1px solid rgba(107,70,193,0.3)',
            borderRadius: 12,
            position: flipped ? 'absolute' : 'relative',
            width: '100%',
          }}
        >
          <i
            className="fas fa-gift fa-3x mb-3"
            style={{ color: 'var(--mg-primary-hover)' }}
            aria-hidden="true"
          />
          <p className="mb-3" style={{ color: 'var(--mg-text-muted)' }}>
            Você já tem um presenteado!
          </p>
          {error && (
            <div className="alert alert-danger mb-3 w-100" role="alert">
              {error}
            </div>
          )}
          <Button type="button" loading={loading} onClick={handleReveal}>
            Ver quem você presenteia
          </Button>
        </div>

        {/* Back face */}
        {recipient && (
          <div
            className="mg-result-card-back d-flex flex-column align-items-center justify-content-center text-center p-4"
            style={{
              backgroundColor: 'var(--mg-bg-card)',
              border: '1px solid rgba(107,70,193,0.5)',
              borderRadius: 12,
              position: 'absolute',
              top: 0,
              width: '100%',
              minHeight: 200,
            }}
          >
            <i
              className="fas fa-user-circle fa-3x mb-3"
              style={{ color: 'var(--mg-primary-hover)' }}
              aria-hidden="true"
            />
            <p className="mb-1" style={{ color: 'var(--mg-text-muted)', fontSize: '0.85rem' }}>
              Você presenteia
            </p>
            <h4 style={{ color: 'var(--mg-text)' }}>
              {recipient.name} {recipient.surname}
            </h4>
          </div>
        )}
      </div>
    </div>
  )
}
