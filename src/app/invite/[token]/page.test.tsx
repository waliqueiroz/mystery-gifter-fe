import { render, screen } from '@testing-library/react'
import InvitePage from './page'
import * as auth from '@/lib/auth'

jest.mock('@/components/invite/InviteJoinCard/InviteJoinCard', () => ({
  InviteJoinCard: ({ token }: { token: string }) => (
    <div data-testid="invite-join-card" data-token={token} />
  ),
}))

jest.mock('@/lib/auth', () => ({
  isAuthenticated: jest.fn(),
}))

const mockPush = jest.fn()
const mockSetItem = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: () => ({ token: 'tok-abc' }),
  useRouter: () => ({ push: mockPush }),
}))

const mockIsAuthenticated = auth.isAuthenticated as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  Object.defineProperty(window, 'sessionStorage', {
    value: { setItem: mockSetItem, getItem: jest.fn(), removeItem: jest.fn() },
    writable: true,
  })
})

describe('InvitePage', () => {
  it('renders InviteJoinCard when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    render(<InvitePage />)
    const card = screen.getByTestId('invite-join-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('data-token', 'tok-abc')
  })

  it('stores returnUrl in sessionStorage and redirects to /login when unauthenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(<InvitePage />)
    expect(mockSetItem).toHaveBeenCalledWith('returnUrl', '/invite/tok-abc')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('does not render InviteJoinCard when unauthenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(<InvitePage />)
    expect(screen.queryByTestId('invite-join-card')).not.toBeInTheDocument()
  })
})
