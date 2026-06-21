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
      router.push(`/login?returnUrl=${encodeURIComponent(`/invite/${token}`)}`)
    } else {
      setAuthenticated(true)
    }
  }, [token, router])

  if (!authenticated) return null

  return (
    <div className="min-h-dvh flex items-center justify-center bg-mg-bg px-4">
      <div className="w-full max-w-content">
        <InviteJoinCard token={token} />
      </div>
    </div>
  )
}
