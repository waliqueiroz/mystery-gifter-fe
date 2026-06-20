import { render, screen } from '@testing-library/react'

import { HeroSection } from './HeroSection'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('HeroSection', () => {
  it('renderiza o nome do produto como heading principal', () => {
    render(<HeroSection />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Mystery Gifter' }),
    ).toBeInTheDocument()
  })

  it('renderiza a proposta de valor', () => {
    render(<HeroSection />)
    expect(
      screen.getByText(/Organize grupos de amigo secreto/i),
    ).toBeInTheDocument()
  })

  it('renderiza CTA "Entrar" apontando para /login', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: /entrar/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  it('renderiza CTA "Criar conta" apontando para /register', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: /criar conta/i })
    expect(link).toHaveAttribute('href', '/register')
  })

  it('CTAs seguem geometria pill-lg (FR-009)', () => {
    render(<HeroSection />)
    const entrar = screen.getByRole('button', { name: /entrar/i })
    const criar = screen.getByRole('button', { name: /criar conta/i })
    expect(entrar).toHaveClass('rounded-pill-lg')
    expect(criar).toHaveClass('rounded-pill-lg')
  })

  it('CTA principal (Entrar) usa variant=primary (verde funcional, FR-008)', () => {
    render(<HeroSection />)
    expect(screen.getByRole('button', { name: /entrar/i })).toHaveClass(
      'bg-mg-green',
    )
  })

  it('CTA secundário (Criar conta) usa variant=outline', () => {
    render(<HeroSection />)
    const criar = screen.getByRole('button', { name: /criar conta/i })
    expect(criar).toHaveClass('bg-transparent')
    expect(criar).toHaveClass('border')
  })

  it('renderiza os três feature cards', () => {
    render(<HeroSection />)
    expect(screen.getByText('Crie grupos')).toBeInTheDocument()
    expect(screen.getByText('Sorteie nomes')).toBeInTheDocument()
    expect(screen.getByText('Gerencie tudo')).toBeInTheDocument()
  })

  it('feature cards usam superfície escura e raio do tema (não Bootstrap)', () => {
    render(<HeroSection />)
    const items = screen.getAllByRole('listitem')
    items.forEach((item) => {
      expect(item).toHaveClass('bg-mg-surface')
      expect(item).toHaveClass('rounded-card')
    })
  })

  it('NÃO usa classes Bootstrap/AdminLTE legadas (mg-hero, mg-hero-title, etc.)', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.mg-hero')).toBeNull()
    expect(container.querySelector('.mg-hero-title')).toBeNull()
    expect(container.querySelector('.mg-feature-card')).toBeNull()
    expect(container.querySelector('.btn-primary')).toBeNull()
    expect(container.querySelector('.btn-outline-primary')).toBeNull()
  })

  it('fundo da seção é bg-mg-bg (FR-012)', () => {
    const { container } = render(<HeroSection />)
    expect(container.firstChild).toHaveClass('bg-mg-bg')
  })
})
