'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import { GroupList } from '@/components/groups/GroupList/GroupList'
import { getUser } from '@/lib/session'
import type { User } from '@/types/api'

export default function GroupsPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  return (
    <AuthGuard>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0" style={{ color: 'var(--mg-text)' }}>
                Grupos
              </h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          {user && <GroupList userId={user.id} />}
        </div>
      </section>
    </AuthGuard>
  )
}
