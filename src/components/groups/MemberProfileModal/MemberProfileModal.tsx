'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/types/api'
import { getUserById } from '@/services/api/userService'

interface MemberProfileModalProps {
  userId: string | null
  onClose: () => void
}

export function MemberProfileModal({ userId, onClose }: MemberProfileModalProps) {
  const isOpen = userId !== null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) return

    async function fetchUser() {
      setLoading(true)
      setError(null)
      setUserData(null)
      try {
        const user = await getUserById(userId!)
        setUserData(user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="card"
        style={{
          position: 'relative',
          backgroundColor: 'var(--mg-bg-card)',
          border: '1px solid rgba(107,70,193,0.3)',
          minWidth: 320,
          maxWidth: 440,
          width: '90%',
          zIndex: 1,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Perfil do participante"
      >
        <div className="card-header d-flex align-items-center justify-content-between" style={{ borderBottom: '1px solid rgba(107,70,193,0.2)' }}>
          <h5 className="mb-0" style={{ color: 'var(--mg-text)' }}>Perfil do participante</h5>
          <button
            type="button"
            className="btn btn-link p-0"
            style={{ color: 'var(--mg-text-muted)' }}
            onClick={onClose}
            aria-label="Fechar"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
        <div className="card-body">
          {loading && (
            <div className="d-flex justify-content-center py-3">
              <span className="spinner-border" role="status" aria-label="Carregando" />
            </div>
          )}
          {error && !loading && (
            <div>
              <p style={{ color: 'var(--mg-error)' }}>{error}</p>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={async () => {
                  if (!userId) return
                  setLoading(true)
                  setError(null)
                  try {
                    const u = await getUserById(userId)
                    setUserData(u)
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Erro ao carregar perfil.')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}
          {userData && !loading && (
            <div>
              <h6 style={{ color: 'var(--mg-text)' }}>
                {userData.name} {userData.surname}
              </h6>
              <p style={{ color: 'var(--mg-text-muted)', marginBottom: 0 }}>{userData.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
