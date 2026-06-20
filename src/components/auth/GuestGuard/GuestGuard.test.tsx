import { render, screen, waitFor } from '@testing-library/react'
import { GuestGuard } from './GuestGuard'
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

describe('GuestGuard', () => {
  it('renders children when no token is present', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(
      <GuestGuard>
        <div>Conteúdo público</div>
      </GuestGuard>
    )
    await waitFor(() => {
      expect(screen.getByText('Conteúdo público')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to /groups when token is present', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    render(
      <GuestGuard>
        <div>Conteúdo público</div>
      </GuestGuard>
    )
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/groups')
    })
    expect(screen.queryByText('Conteúdo público')).not.toBeInTheDocument()
  })

  it('does not expose public content to authenticated users', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    const { container } = render(
      <GuestGuard>
        <div>Conteúdo público</div>
      </GuestGuard>
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/groups'))
    expect(container.querySelector('div > div')).not.toBeInTheDocument()
  })
})
