import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'
import * as userContext from '@/contexts/UserContext'
import type { User } from '@/types/api'

jest.mock('@/contexts/UserContext', () => ({ useUser: jest.fn() }))

const mockUseUser = userContext.useUser as jest.Mock

const mockUser: User = {
  id: 'u1',
  name: 'Maria',
  surname: 'Oliveira',
  email: 'maria@example.com',
  created_at: '2025-01-15T12:00:00Z',
  updated_at: '2025-01-15T12:00:00Z',
}

describe('ProfileCard', () => {
  it('renders the user full name', () => {
    mockUseUser.mockReturnValue(mockUser)
    render(<ProfileCard />)
    expect(screen.getByText('Maria Oliveira')).toBeInTheDocument()
  })

  it('renders the user email', () => {
    mockUseUser.mockReturnValue(mockUser)
    render(<ProfileCard />)
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('renders the creation date in pt-BR long format', () => {
    mockUseUser.mockReturnValue(mockUser)
    render(<ProfileCard />)
    expect(screen.getAllByText(/15 de janeiro de 2025/i).length).toBeGreaterThan(0)
  })

  it('renders nothing when user is null', () => {
    mockUseUser.mockReturnValue(null)
    const { container } = render(<ProfileCard />)
    expect(container).toBeEmptyDOMElement()
  })
})
