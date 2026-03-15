import { render, screen } from '@testing-library/react'
import HeroSection from './HeroSection'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('HeroSection', () => {
  it('renders the brand name', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: 'Mystery Gifter' })).toBeInTheDocument()
  })

  it('renders "Entrar" link pointing to /login', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: 'Entrar' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })

  it('renders "Criar conta" link pointing to /register', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: 'Criar conta' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/register')
  })

  it('renders product description', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Organize grupos de amigo secreto/i)).toBeInTheDocument()
  })

  it('renders hero wrapper with mg-hero class', () => {
    const { container } = render(<HeroSection />)
    expect(container.firstChild).toHaveClass('mg-hero')
  })

  it('renders heading with mg-hero-title class', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: 'Mystery Gifter' })).toHaveClass('mg-hero-title')
  })

  it('renders three feature cards', () => {
    render(<HeroSection />)
    expect(screen.getByText('Crie grupos')).toBeInTheDocument()
    expect(screen.getByText('Sorteie nomes')).toBeInTheDocument()
    expect(screen.getByText('Gerencie tudo')).toBeInTheDocument()
  })

  it('renders scroll indicator', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.mg-scroll-indicator')).toBeInTheDocument()
  })
})
