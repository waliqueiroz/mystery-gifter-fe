'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/api'
import { isAuthenticated } from '@/lib/auth'
import { getUser } from '@/lib/session'

const UserContext = createContext<User | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    const storedUser = getUser()
    if (!storedUser) {
      router.push('/login')
      return
    }
    setUser(storedUser)
    setChecked(true)
  }, [router])

  if (!checked) return null

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser(): User | null {
  return useContext(UserContext)
}
