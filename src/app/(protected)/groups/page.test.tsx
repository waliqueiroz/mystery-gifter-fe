import { render, screen } from '@testing-library/react'
import GroupsPage from './page'
import * as session from '@/lib/session'

jest.mock('@/components/auth/AuthGuard', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/groups/GroupList/GroupList', () => ({
  GroupList: ({ userId }: { userId: string }) => (
    <div data-testid="group-list" data-user-id={userId} />
  ),
}))

jest.mock('@/lib/session', () => ({
  getUser: jest.fn(),
}))

const mockGetUser = session.getUser as jest.Mock

beforeEach(() => jest.clearAllMocks())

describe('GroupsPage', () => {
  it('renders GroupList with the logged-in userId', () => {
    mockGetUser.mockReturnValue({ id: 'u-42', name: 'Test', email: 't@t.com' })
    render(<GroupsPage />)
    const list = screen.getByTestId('group-list')
    expect(list).toBeInTheDocument()
    expect(list).toHaveAttribute('data-user-id', 'u-42')
  })

  it('does not render GroupList when session has no user', () => {
    mockGetUser.mockReturnValue(null)
    render(<GroupsPage />)
    expect(screen.queryByTestId('group-list')).not.toBeInTheDocument()
  })

  it('renders page heading', () => {
    mockGetUser.mockReturnValue({ id: 'u-1', name: 'Test', email: 't@t.com' })
    render(<GroupsPage />)
    expect(screen.getByRole('heading', { name: /grupos/i })).toBeInTheDocument()
  })
})
