import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProtectedLayout from './layout'
import * as auth from '@/lib/auth'

const mockPush = jest.fn()
const mockPathname = jest.fn(() => '/dashboard')

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}))

jest.mock('@/lib/auth', () => ({
  clearToken: jest.fn(),
  getToken: jest.fn(),
  setToken: jest.fn(),
  isAuthenticated: jest.fn(),
}))

const mockClearToken = auth.clearToken as jest.Mock

beforeEach(() => {
  mockPush.mockReset()
  mockClearToken.mockReset()
  mockPathname.mockReturnValue('/dashboard')
})

describe('ProtectedLayout', () => {
  it('renders children', () => {
    render(
      <ProtectedLayout>
        <div>conteúdo protegido</div>
      </ProtectedLayout>,
    )
    expect(screen.getByText('conteúdo protegido')).toBeInTheDocument()
  })

  it('calls clearToken and redirects to /login on logout click', async () => {
    render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))
    expect(mockClearToken).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('applies AdminLTE wrapper class', () => {
    const { container } = render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    expect(container.querySelector('.wrapper')).toBeInTheDocument()
    expect(container.querySelector('.main-header')).toBeInTheDocument()
    expect(container.querySelector('.content-wrapper')).toBeInTheDocument()
  })

  it('applies navbar-dark class to main header nav', () => {
    const { container } = render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    const nav = container.querySelector('nav.main-header')
    expect(nav).toHaveClass('navbar-dark')
    expect(nav).not.toHaveClass('navbar-white')
    expect(nav).not.toHaveClass('navbar-light')
  })

  it('renders sidebar with Dashboard and Grupos navigation links', () => {
    render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /grupos/i })).toBeInTheDocument()
  })

  it('marks Dashboard link as active when pathname is /dashboard', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    const dashLink = screen.getAllByRole('link', { name: /dashboard/i }).find(
      (el) => el.classList.contains('nav-link'),
    )
    expect(dashLink).toHaveClass('active')
  })

  it('marks Grupos link as active when pathname starts with /groups', () => {
    mockPathname.mockReturnValue('/groups')
    render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    expect(screen.getByRole('link', { name: /grupos/i })).toHaveClass('active')
  })

  it('does not mark Grupos link as active on /dashboard', () => {
    mockPathname.mockReturnValue('/dashboard')
    render(
      <ProtectedLayout>
        <div>conteúdo</div>
      </ProtectedLayout>,
    )
    expect(screen.getByRole('link', { name: /grupos/i })).not.toHaveClass('active')
  })
})
