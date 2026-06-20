'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/groups')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null

  return <>{children}</>
}
