'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { clearToken } from '@/lib/auth'
import { ToastProvider } from '@/components/ui/Toast/ToastProvider'
import { UserProvider } from '@/contexts/UserContext'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <ToastProvider>
      <UserProvider>
      <div className="wrapper">
        <nav className="main-header navbar navbar-expand navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item d-none d-sm-inline-block">
              <Link href="/dashboard" className="nav-link">
                Mystery Gifter
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Sair
              </button>
            </li>
          </ul>
        </nav>

        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
                <li className="nav-item">
                  <Link
                    href="/dashboard"
                    className={`nav-link${pathname === '/dashboard' ? ' active' : ''}`}
                  >
                    <i className="nav-icon fas fa-home" aria-hidden="true" />
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="/groups"
                    className={`nav-link${pathname?.startsWith('/groups') ? ' active' : ''}`}
                  >
                    <i className="nav-icon fas fa-users" aria-hidden="true" />
                    <p>Grupos</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="content-wrapper">{children}</div>
      </div>
      </UserProvider>
    </ToastProvider>
  )
}
