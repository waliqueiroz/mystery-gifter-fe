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

  it('renderiza apenas dois tabs: Grupos e Perfil', () => {
    render(<BottomTabBar />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(screen.getByRole('link', { name: /grupos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
  })

  it('NÃO renderiza tab "Sair" (vive dentro de Perfil)', () => {
    render(<BottomTabBar />)
    expect(screen.queryByRole('link', { name: /sair/i })).toBeNull()
  })

  it('expõe nav com aria-label "Navegação principal"', () => {
    render(<BottomTabBar />)
    expect(
      screen.getByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
  })

  it('aplica posicionamento fixed bottom em todas as larguras', () => {
    render(<BottomTabBar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed')
    expect(nav).toHaveClass('bottom-0')
  })

  it('aplica padding-bottom respeitando safe-area-inset-bottom (iOS)', () => {
    render(<BottomTabBar />)
    const nav = screen.getByRole('navigation')
    expect(nav.getAttribute('class')).toContain('pb-[env(safe-area-inset-bottom)]')
  })

  describe('estado ativo via pathname', () => {
    it('marca Grupos ativo em /groups com aria-current="page" e verde de marca', () => {
      mockPathname.mockReturnValue('/groups')
      render(<BottomTabBar />)
      const link = screen.getByRole('link', { name: /grupos/i })
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).toHaveClass('text-mg-green')
    })

    it('marca Grupos ativo em sub-rota (/groups/abc)', () => {
      mockPathname.mockReturnValue('/groups/abc')
      render(<BottomTabBar />)
      expect(screen.getByRole('link', { name: /grupos/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('marca Perfil ativo em /profile', () => {
      mockPathname.mockReturnValue('/profile')
      render(<BottomTabBar />)
      expect(screen.getByRole('link', { name: /perfil/i })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('tab inativo usa text-mg-text-muted, NÃO aria-current', () => {
      mockPathname.mockReturnValue('/profile')
      render(<BottomTabBar />)
      const grupos = screen.getByRole('link', { name: /grupos/i })
      expect(grupos).toHaveClass('text-mg-text-muted')
      expect(grupos.getAttribute('aria-current')).toBeNull()
    })

    it('quando pathname é null/desconhecido, nenhum tab fica ativo', () => {
      mockPathname.mockReturnValue(null)
      render(<BottomTabBar />)
      const links = screen.getAllByRole('link')
      links.forEach((link) =>
        expect(link.getAttribute('aria-current')).toBeNull(),
      )
    })
  })

  it('cada tab tem ícone (svg) acompanhando o rótulo', () => {
    render(<BottomTabBar />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.querySelector('svg')).not.toBeNull()
    })
  })

  it('hrefs corretos: /groups e /profile', () => {
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
