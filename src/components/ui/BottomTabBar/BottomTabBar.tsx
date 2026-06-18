'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icon, type IconName } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

interface TabSpec {
  href: string
  /** Padrão de match para `isActive` — usa `pathname.startsWith` quando true. */
  matchPrefix: boolean
  label: string
  icon: IconName
}

/**
 * Composição fixa da bottom tab bar (Q1 + Q5 da clarificação): apenas
 * **Grupos** e **Perfil**. A ação "Sair" NÃO compõe a barra — fica como botão
 * dentro da página de Perfil para evitar toques acidentais (FR-004 + PR-011).
 */
const TABS: readonly TabSpec[] = [
  { href: '/groups', matchPrefix: true, label: 'Grupos', icon: 'Users' },
  { href: '/profile', matchPrefix: true, label: 'Perfil', icon: 'CircleUser' },
] as const

function isActive(pathname: string | null, tab: TabSpec): boolean {
  if (!pathname) return false
  return tab.matchPrefix ? pathname.startsWith(tab.href) : pathname === tab.href
}

/**
 * Bottom tab bar persistente em todas as larguras de tela (FR-004 + Q1):
 * NÃO há variação responsiva — em desktop o conteúdo da rota fica centralizado
 * com `max-w-app`, e a barra continua ancorada na base.
 *
 * Estado ativo aplica o verde de marca (`mg.green`) ao ícone + rótulo —
 * estado funcional, dentro da regra FR-008. `aria-current="page"` é exposto
 * no <Link> ativo.
 *
 * Padding bottom respeita `env(safe-area-inset-bottom)` para não conflitar
 * com home indicator no iOS.
 */
export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-mg-border/40 bg-mg-surface',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <ul className="mx-auto flex max-w-app">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-3 text-xs font-semibold',
                  'transition-colors',
                  active ? 'text-mg-green' : 'text-mg-text-muted hover:text-mg-text',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
                )}
              >
                <Icon name={tab.icon} size={22} />
                <span>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
