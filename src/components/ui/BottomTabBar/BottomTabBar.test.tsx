import { render, screen } from '@testing-library/react'

import { BottomTabBar } from './BottomTabBar'

const mockPathname = jest.fn<string | null, []>(() => '/groups')

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('BottomTabBar', () => {
  beforeEach(() => {
    mockPathname.mockReset()
    mockPathname.mockReturnValue('/groups')
  })

  it('renders only two tabs: Grupos and Perfil', () => {
    render(<BottomTabBar />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(screen.getByRole('link', { name: /grupos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
  })

  it('does NOT render "Sair" tab (lives inside Perfil)', () => {
    render(<BottomTabBar />)
    expect(screen.queryByRole('link', { name: /sair/i })).toBeNull()
  })

  it('exposes nav with aria-label "Navegação principal"', () => {
    render(<BottomTabBar />)
    expect(
      screen.getByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
  })

  it('applies fixed bottom positioning at all widths', () => {
    render(<BottomTabBar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed')
    expect(nav).toHaveClass('bottom-0')
  })

  it('applies padding-bottom respecting safe-area-inset-bottom (iOS)', () => {
    render(<BottomTabBar />)
    const nav = screen.getByRole('navigation')
    expect(nav.getAttribute('class')).toContain('pb-[env(safe-area-inset-bottom)]')
  })

  describe('active state via pathname', () => {
    it('marks Grupos active at /groups with aria-current="page" and brand green', () => {
      mockPathname.mockReturnValue('/groups')
      render(<BottomTabBar />)
      const link = screen.getByRole('link', { name: /grupos/i })
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveClass('text-mg-green')
    })

    it('marks Grupos active on sub-route (/groups/abc)', () => {
      mockPathname.mockReturnValue('/groups/abc')
      render(<BottomTabBar />)
      expect(screen.getByRole('link', { name: /grupos/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('marks Perfil active at /profile', () => {
      mockPathname.mockReturnValue('/profile')
      render(<BottomTabBar />)
      expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('inactive tab uses text-mg-text-muted, NOT aria-current', () => {
      mockPathname.mockReturnValue('/profile')
      render(<BottomTabBar />)
      const grupos = screen.getByRole('link', { name: /grupos/i })
      expect(grupos).toHaveClass('text-mg-text-muted')
      expect(grupos.getAttribute('aria-current')).toBeNull()
    })

    it('when pathname is null/unknown, no tab is active', () => {
      mockPathname.mockReturnValue(null)
      render(<BottomTabBar />)
      const links = screen.getAllByRole('link')
      links.forEach((link) =>
        expect(link.getAttribute('aria-current')).toBeNull(),
      )
    })
  })

  it('each tab has an icon (svg) accompanying the label', () => {
    render(<BottomTabBar />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.querySelector('svg')).not.toBeNull()
    })
  })

  it('correct hrefs: /groups and /profile', () => {
    render(<BottomTabBar />)
    expect(screen.getByRole('link', { name: /grupos/i })).toHaveAttribute(
      'href',
      '/groups',
    )
    expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute(
      'href',
      '/profile',
    )
  })
})
