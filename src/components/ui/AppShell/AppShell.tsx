import { BottomTabBar } from '@/components/ui/BottomTabBar/BottomTabBar'
import { SkeletonProvider } from '@/components/ui/Skeleton/SkeletonProvider'
import { cn } from '@/lib/cn'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

/**
 * Chassi único de todas as áreas autenticadas. Aplica:
 *   - `min-h-dvh bg-mg-bg` → preto profundo do DESIGN.md em altura dinâmica
 *   - Conteúdo centralizado em `max-w-app` para manter estética app-like
 *     também em desktop (FR-022 + PR-007 — em telas grandes o conteúdo NÃO
 *     se espalha como painel administrativo).
 *   - `pb-24` + `pb-[env(safe-area-inset-bottom)]` → garante que o conteúdo
 *     não fique coberto pela `<BottomTabBar>` fixa.
 *   - `<SkeletonProvider>` global → qualquer skeleton dentro da árvore
 *     herda a paleta near-black sem prop drilling.
 *   - `<BottomTabBar>` ancorada no fim — Grupos + Perfil persistentes.
 *
 * NÃO há variação responsiva da primitiva de navegação (FR-004) — mesma
 * estrutura em 320px e em desktop.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <SkeletonProvider>
      <div className={cn('min-h-dvh bg-mg-bg text-mg-text', className)}>
        <main
          className={cn(
            'mx-auto max-w-app px-4 pt-6',
            'pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))]',
          )}
        >
          {children}
        </main>
        <BottomTabBar />
      </div>
    </SkeletonProvider>
  )
}
