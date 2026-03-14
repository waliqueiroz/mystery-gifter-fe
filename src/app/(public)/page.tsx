import GuestGuard from '@/components/auth/GuestGuard'
import HeroSection from '@/components/landing/HeroSection'

export default function HomePage() {
  return (
    <GuestGuard>
      <HeroSection />
    </GuestGuard>
  )
}
