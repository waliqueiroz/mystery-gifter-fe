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

jest.mock('next/navigation', () => ({
  useParams: () => ({ token: 'tok-abc' }),
  useRouter: () => ({ push: mockPush }),
}))

const mockIsAuthenticated = auth.isAuthenticated as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('InvitePage', () => {
  it('renders InviteJoinCard when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true)
    render(<InvitePage />)
    const card = screen.getByTestId('invite-join-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('data-token', 'tok-abc')
  })

  it('wraps InviteJoinCard in a max-w-content centered container', () => {
    mockIsAuthenticated.mockReturnValue(true)
    const { container } = render(<InvitePage />)
    const wrapper = container.querySelector('.max-w-content')
    expect(wrapper).not.toBeNull()
  })

  it('redirects to /login with returnUrl query param when unauthenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(<InvitePage />)
    expect(mockPush).toHaveBeenCalledWith('/login?returnUrl=%2Finvite%2Ftok-abc')
  })

  it('does not render InviteJoinCard when unauthenticated', () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(<InvitePage />)
    expect(screen.queryByTestId('invite-join-card')).not.toBeInTheDocument()
  })
})
