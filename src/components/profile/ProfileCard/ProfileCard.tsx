'use client'

import { useUser } from '@/contexts/UserContext'

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(iso))
}

export function ProfileCard() {
  const user = useUser()

  if (!user) return null

  return (
    <div className="rounded-card bg-mg-surface p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-mg-surface-2 text-mg-green text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-mg-text">
            {user.name} {user.surname}
          </p>
          <p className="text-sm text-mg-text-muted">
            Membro desde {formatDate(user.created_at)}
          </p>
        </div>
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="text-xs uppercase tracking-widest text-mg-text-muted mb-1">
            E-mail
          </dt>
          <dd className="text-mg-text">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-mg-text-muted mb-1">
            Membro desde
          </dt>
          <dd className="text-mg-text">{formatDate(user.created_at)}</dd>
        </div>
      </dl>
    </div>
  )
}
