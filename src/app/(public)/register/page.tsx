import { GuestGuard } from '@/components/auth/GuestGuard/GuestGuard'
import { RegisterForm } from '@/components/register/RegisterForm/RegisterForm'

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterForm />
    </GuestGuard>
  )
}
