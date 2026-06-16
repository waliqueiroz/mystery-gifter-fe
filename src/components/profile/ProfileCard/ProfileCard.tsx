'use client'

import { useUser } from '@/contexts/UserContext'

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(iso))
}

export function ProfileCard() {
  const user = useUser()

  if (!user) return null

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--mg-bg-card)',
        border: '1px solid rgba(107,70,193,0.2)',
        maxWidth: 480,
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-center mb-4">
          <i
            className="fas fa-user-circle fa-3x mr-3"
            style={{ color: 'var(--mg-primary-hover)' }}
            aria-hidden="true"
          />
          <div>
            <h5 className="mb-0" style={{ color: 'var(--mg-text)' }}>
              {user.name} {user.surname}
            </h5>
            <small style={{ color: 'var(--mg-text-muted)' }}>Membro desde {formatDate(user.created_at)}</small>
          </div>
        </div>

        <dl className="mb-0">
          <dt style={{ color: 'var(--mg-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            E-mail
          </dt>
          <dd style={{ color: 'var(--mg-text)', marginBottom: '1rem' }}>{user.email}</dd>

          <dt style={{ color: 'var(--mg-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Membro desde
          </dt>
          <dd style={{ color: 'var(--mg-text)', marginBottom: 0 }}>{formatDate(user.created_at)}</dd>
        </dl>
      </div>
    </div>
  )
}
