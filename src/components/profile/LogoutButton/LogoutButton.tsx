'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button/Button'
import { clearToken } from '@/lib/auth'

export function LogoutButton() {
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <Button variant="outline" shape="pill" onClick={handleLogout}>
      Sair
    </Button>
  )
}
