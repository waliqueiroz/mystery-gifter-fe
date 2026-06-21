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

  it('outer container has desk:flex for responsive sidebar layout', () => {
    const { container } = render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const outer = container.querySelector('.min-h-dvh')
    expect(outer?.className).toContain('desk:flex')
  })

  it('applies max-w-app and mx-auto on mobile for app-like aesthetic', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(screen.getByRole('main')).toHaveClass('max-w-app')
    expect(screen.getByRole('main')).toHaveClass('mx-auto')
  })

  it('main has desk:flex-1 and desk:max-w-none to expand on desktop', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    const main = screen.getByRole('main')
    expect(main.className).toContain('desk:flex-1')
    expect(main.className).toContain('desk:max-w-none')
  })

  it('renders the BottomTabBar (nav "Navegação principal")', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeInTheDocument()
  })

  it('renders the Sidebar (nav "Navegação principal — desktop")', () => {
    render(
      <AppShell>
        <span>x</span>
      </AppShell>,
    )
    expect(
      screen.getByRole('navigation', { name: 'Navegação principal — desktop' }),
    ).toBeInTheDocument()
  })

  it('reserves bottom padding on mobile to prevent content from being covered by the tab bar', () => {
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
