'use client'

import { useRouter } from 'next/navigation'
import { clearToken } from '@/lib/auth'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <div className="wrapper">
      <nav className="main-header navbar navbar-expand navbar-dark">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={handleLogout}>
              Sair
            </button>
          </li>
        </ul>
      </nav>
      <div className="content-wrapper">{children}</div>
    </div>
  )
}
