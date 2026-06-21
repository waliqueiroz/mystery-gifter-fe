import { render, screen } from '@testing-library/react'

import { Sidebar } from './Sidebar'

const mockPathname = jest.fn<string | null, []>(() => '/groups')

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    'aria-current': ariaCurrent,
    className,
  }: {
    href: string
    children: React.ReactNode
    'aria-current'?: string
    className?: string
  }) => (
    <a href={href} aria-current={ariaCurrent} className={className}>
      {children}
    </a>
  ),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    mockPathname.mockReset()
    mockPathname.mockReturnValue('/groups')
  })

  it('renders without crashing', () => {
    render(<Sidebar />)
    expect(
      screen.getByRole('navigation', { name: /desktop/i }),
    ).toBeInTheDocument()
  })

  it('displays the app brand "Mystery Gifter" text', () => {
    render(<Sidebar />)
    expect(screen.getByText('Mystery Gifter')).toBeInTheDocument()
  })

  it('renders exactly two navigation links: Grupos and Perfil', () => {
    render(<Sidebar />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(screen.getByRole('link', { name: /grupos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
  })

  it('correct hrefs: /groups and /profile', () => {
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /grupos/i })).toHaveAttribute('href', '/groups')
    expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute('href', '/profile')
  })

  describe('active state via pathname', () => {
    it('marks Grupos active at /groups with aria-current="page" and text-mg-green', () => {
      mockPathname.mockReturnValue('/groups')
      render(<Sidebar />)
      const link = screen.getByRole('link', { name: /grupos/i })
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveClass('text-mg-green')
    })

    it('marks Grupos active on sub-route /groups/abc', () => {
      mockPathname.mockReturnValue('/groups/abc')
      render(<Sidebar />)
      expect(screen.getByRole('link', { name: /grupos/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('marks Perfil active at /profile', () => {
      mockPathname.mockReturnValue('/profile')
      render(<Sidebar />)
      expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('inactive link does NOT have aria-current and uses text-mg-text-muted', () => {
      mockPathname.mockReturnValue('/profile')
      render(<Sidebar />)
      const grupos = screen.getByRole('link', { name: /grupos/i })
      expect(grupos.getAttribute('aria-current')).toBeNull()
      expect(grupos).toHaveClass('text-mg-text-muted')
    })

    it('when pathname is null, no link is active', () => {
      mockPathname.mockReturnValue(null)
      render(<Sidebar />)
      screen.getAllByRole('link').forEach((link) => {
        expect(link.getAttribute('aria-current')).toBeNull()
      })
    })
  })

  it('each nav link has an icon (svg)', () => {
    render(<Sidebar />)
    screen.getAllByRole('link').forEach((link) => {
      expect(link.querySelector('svg')).not.toBeNull()
    })
  })

  it('is hidden on mobile via the "hidden" CSS class', () => {
    const { container } = render(<Sidebar />)
    expect(container.querySelector('nav')).toHaveClass('hidden')
  })

  it('becomes visible on desktop via "desk:flex" CSS class', () => {
    const { container } = render(<Sidebar />)
    expect(container.querySelector('nav')?.className).toContain('desk:flex')
  })
})
