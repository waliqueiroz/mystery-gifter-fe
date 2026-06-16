import { ProfileCard } from '@/components/profile/ProfileCard/ProfileCard'

export default function ProfilePage() {
  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h3 style={{ color: 'var(--mg-text)' }}>Meu perfil</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <ProfileCard />
          </div>
        </div>
      </div>
    </section>
  )
}
