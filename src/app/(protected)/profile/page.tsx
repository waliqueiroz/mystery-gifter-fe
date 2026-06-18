import { LogoutButton } from '@/components/profile/LogoutButton/LogoutButton'
import { ProfileCard } from '@/components/profile/ProfileCard/ProfileCard'

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-mg-text">Meu perfil</h1>
      <ProfileCard />
      <LogoutButton />
    </div>
  )
}
