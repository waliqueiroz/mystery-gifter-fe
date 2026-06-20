import { GuestGuard } from '@/components/auth/GuestGuard/GuestGuard'
import { LoginForm } from '@/components/login/LoginForm/LoginForm'

export default function LoginPage() {
  return (
    <GuestGuard>
      <LoginForm />
    </GuestGuard>
  )
}
