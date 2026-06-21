import { BottomTabBar } from '@/components/ui/BottomTabBar/BottomTabBar'
import { Sidebar } from '@/components/ui/Sidebar/Sidebar'
import { SkeletonProvider } from '@/components/ui/Skeleton/SkeletonProvider'
import { cn } from '@/lib/cn'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

/**
 * Chassi único de todas as áreas autenticadas. Layout adaptativo:
 *
 * Mobile (<896px):
 *   - Conteúdo centralizado em `max-w-app` com `pb-24` para não ser coberto
 *     pela `<BottomTabBar>` fixa.
 *
 * Desktop (≥896px, breakpoint `desk`):
 *   - Layout `flex-row`: `<Sidebar>` (220px, sticky) + `<main>` (flex-1).
 *   - `max-w-app` e `mx-auto` são sobrescritos por `desk:max-w-none` e
 *     `desk:mx-0` — o conteúdo usa toda a largura disponível.
 *   - `<BottomTabBar>` some via `desk:hidden` (definido no próprio componente).
 *
 * `<SkeletonProvider>` permanece global — qualquer skeleton na árvore herda
 * a paleta near-black sem prop drilling.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <SkeletonProvider>
      <div className={cn('min-h-dvh bg-mg-bg text-mg-text desk:flex', className)}>
        <Sidebar />
        <main
          className={cn(
            'mx-auto max-w-app px-4 pt-6',
            'pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))]',
            'desk:flex-1 desk:min-w-0 desk:max-w-none desk:mx-0 desk:px-8 desk:pt-8 desk:pb-8',
          )}
        >
          {children}
        </main>
        <BottomTabBar />
      </div>
    </SkeletonProvider>
  )
}
