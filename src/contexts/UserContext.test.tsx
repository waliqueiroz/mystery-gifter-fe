import { render, screen, waitFor } from '@testing-library/react'
import { UserProvider, useUser } from './UserContext'
import * as auth from '@/lib/auth'
import * as session from '@/lib/session'
import type { User } from '@/types/api'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('@/lib/auth', () => ({
  isAuthenticated: jest.fn(),
}))

jest.mock('@/lib/session', () => ({
  getUser: jest.fn(),
}))

const mockIsAuthenticated = auth.isAuthenticated as jest.Mock
const mockGetUser = session.getUser as jest.Mock

const mockUser: User = { id: 'u1', name: 'Ana', surname: 'Lima', email: 'a@a.com', created_at: '', updated_at: '' }

function UserDisplay() {
  const user = useUser()
  return <div data-testid="user">{user?.name ?? 'null'}</div>
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('UserProvider', () => {
  it('redirects to /login when no token', async () => {
    mockIsAuthenticated.mockReturnValue(false)
    render(<UserProvider><div>conteúdo</div></UserProvider>)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'))
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument()
  })

  it('redirects to /login when token exists but user is absent from localStorage', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockGetUser.mockReturnValue(null)
    render(<UserProvider><div>conteúdo</div></UserProvider>)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'))
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument()
  })

  it('renders children when authenticated with user in localStorage', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockGetUser.mockReturnValue(mockUser)
    render(<UserProvider><div>conteúdo</div></UserProvider>)
    expect(await screen.findByText('conteúdo')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

})

describe('useUser', () => {
  it('returns the user provided by UserProvider', async () => {
    mockIsAuthenticated.mockReturnValue(true)
    mockGetUser.mockReturnValue(mockUser)
    render(<UserProvider><UserDisplay /></UserProvider>)
    expect(await screen.findByTestId('user')).toHaveTextContent('Ana')
  })

  it('returns null when used outside UserProvider', () => {
    render(<UserDisplay />)
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })
})
