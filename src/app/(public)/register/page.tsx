import GuestGuard from '@/components/auth/GuestGuard'
import RegisterForm from '@/components/register/RegisterForm'

export default function RegisterPage() {
  return (
    <GuestGuard>
      <RegisterForm />
    </GuestGuard>
  )
}
