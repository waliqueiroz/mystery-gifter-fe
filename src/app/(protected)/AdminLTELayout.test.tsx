import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProtectedLayout from './layout'
import * as auth from '@/lib/auth'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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
})
