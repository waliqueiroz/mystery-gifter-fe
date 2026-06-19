import { render, screen } from '@testing-library/react'

import { AppShell } from './AppShell'

jest.mock('next/navigation', () => ({
  usePathname: () => '/groups',
}))

describe('AppShell', () => {
  it('renders children inside <main>', () => {
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

  it('applies bg-mg-bg and min-h-dvh to the outer container', () => {
    const { container } = render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const outer = container.querySelector('.min-h-dvh')
    expect(outer).not.toBeNull()
    expect(outer).toHaveClass('bg-mg-bg')
  })

  it('centers content with max-w-app (app-like aesthetic on desktop)', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(screen.getByRole('main')).toHaveClass('max-w-app')
    expect(screen.getByRole('main')).toHaveClass('mx-auto')
  })

  it('renders the BottomTabBar (nav "Navegação principal")', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(
      screen.getByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
  })

  it('reserves bottom padding to prevent content from being covered by the tab bar', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const main = screen.getByRole('main')
    expect(main.getAttribute('class')).toContain('pb-[calc(theme(spacing.24)+env(safe-area-inset-bottom))]')
  })

  it('forwards className to the outer container', () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <span>x</span>
      </AppShell>,
    )
    expect(container.querySelector('.custom-shell')).not.toBeNull()
  })
})
