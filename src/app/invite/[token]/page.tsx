'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { InviteJoinCard } from '@/components/invite/InviteJoinCard/InviteJoinCard'

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      sessionStorage.setItem('returnUrl', `/invite/${token}`)
      router.push('/login')
    } else {
      setAuthenticated(true)
    }
  }, [token, router])

  if (!authenticated) return null

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--mg-bg)' }}>
      <div style={{ width: '100%', maxWidth: 480, padding: '1rem' }}>
        <InviteJoinCard token={token} />
      </div>
    </div>
  )
}
