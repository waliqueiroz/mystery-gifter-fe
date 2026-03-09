import { render, screen, waitFor } from '@testing-library/react'
import AuthGuard from './AuthGuard'
import * as auth from '@/lib/auth'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/auth', () => ({
  isAuthenticated: jest.fn(),
}))

const mockIsAuthenticated = auth.isAuthenticated as jest.Mock

beforeEach(() => {
  mockPush.mockReset()
  mockIsAuthenticated.mockReset()
})

describe('AuthGuard', () => {
  it('renders children when token is present', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    render(
      <AuthGuard>
        <div>Conteúdo protegido</div>
      </AuthGuard>
    )
    await waitFor(() => {
      expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to /login when no token is present', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(
      <AuthGuard>
        <div>Conteúdo protegido</div>
      </AuthGuard>
    )
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
    expect(screen.queryByText('Conteúdo protegido')).not.toBeInTheDocument()
  })

  it('does not expose protected content when redirecting', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    const { container } = render(
      <AuthGuard>
        <div>Conteúdo protegido</div>
      </AuthGuard>
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'))
    // Children must never appear in DOM when unauthenticated
    expect(container.querySelector('div > div')).not.toBeInTheDocument()
  })
})
