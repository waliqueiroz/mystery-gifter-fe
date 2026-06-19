import { AppShell } from '@/components/ui/AppShell/AppShell'
import { UserProvider } from '@/contexts/UserContext'

/**
 * Layout das áreas autenticadas. Estado/router/logout NÃO ficam aqui mais:
 *   - Navegação entre rotas → <BottomTabBar> dentro do <AppShell>
 *   - Ação "Sair" → botão dentro da página de Perfil (Q5)
 *
 * Como nada aqui precisa de hooks de browser, este layout volta a ser um
 * Server Component (sem `"use client"`).
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <AppShell>{children}</AppShell>
    </UserProvider>
  )
}
