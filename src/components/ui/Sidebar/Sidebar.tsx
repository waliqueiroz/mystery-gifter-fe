'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon, type IconName } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

interface NavItem {
  href: string
  label: string
  icon: IconName
  matchPrefix: boolean
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/groups', label: 'Grupos', icon: 'Users', matchPrefix: true },
  { href: '/profile', label: 'Perfil', icon: 'CircleUser', matchPrefix: true },
] as const

function isActive(pathname: string | null, item: NavItem): boolean {
  if (!pathname) return false
  return item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href
}

/**
 * Barra lateral de navegação — visível apenas em telas desktop (≥896px, breakpoint `desk`).
 * Em mobile é oculta via `hidden`; em desktop aparece via `desk:flex`.
 *
 * Contém identidade da aplicação (ícone Gift + "Mystery Gifter") e os mesmos itens
 * de navegação da BottomTabBar: Grupos e Perfil.
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal — desktop"
      className={cn(
        'hidden desk:flex flex-col',
        'w-sidebar shrink-0 sticky top-0 h-screen',
        'bg-mg-bg border-r border-mg-border/40',
        'px-3 py-6',
      )}
    >
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <Icon name="Gift" size={20} className="text-mg-green" aria-hidden />
        <span className="text-sm font-bold text-mg-text tracking-tight">
          Mystery Gifter
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-card px-3 py-2.5',
                  'text-sm font-semibold transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
                  active
                    ? 'text-mg-green'
                    : 'text-mg-text-muted hover:text-mg-text',
                )}
              >
                <Icon name={item.icon} size={18} aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
