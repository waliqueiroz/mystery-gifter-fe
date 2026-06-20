import { GuestGuard } from '@/components/auth/GuestGuard/GuestGuard'
import { HeroSection } from '@/components/landing/HeroSection/HeroSection'

export default function HomePage() {
  return (
    <GuestGuard>
      <HeroSection />
    </GuestGuard>
  )
}
