import { render, screen } from '@testing-library/react'

import { AppShell } from './AppShell'

jest.mock('next/navigation', () => ({
  usePathname: () => '/groups',
}))

describe('AppShell', () => {
  it('renderiza children dentro do <main>', () => {
    render(
      <AppShell>
        <p>conteúdo da rota</p>
      </AppShell>,
    )
    expect(screen.getByText('conteúdo da rota')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('main')).toContainElement(
      screen.getByText('conteúdo da rota'),
    )
  })

  it('aplica bg-mg-bg e min-h-dvh no container externo', () => {
    const { container } = render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const outer = container.querySelector('.min-h-dvh')
    expect(outer).not.toBeNull()
    expect(outer).toHaveClass('bg-mg-bg')
  })

  it('centraliza o conteúdo com max-w-app (estética app-like em desktop)', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(screen.getByRole('main')).toHaveClass('max-w-app')
    expect(screen.getByRole('main')).toHaveClass('mx-auto')
  })

  it('renderiza a BottomTabBar (nav "Navegação principal")', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(
      screen.getByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
  })

  it('reserva padding inferior para não cobrir conteúdo com a tab bar', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const main = screen.getByRole('main')
    expect(main.getAttribute('class')).toContain('pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))]')
  })

  it('encaminha className no container externo', () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <span>x</span>
      </AppShell>,
    )
    expect(container.querySelector('.custom-shell')).not.toBeNull()
  })
})
