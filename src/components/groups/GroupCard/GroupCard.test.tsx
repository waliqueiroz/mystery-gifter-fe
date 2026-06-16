import { render, screen } from '@testing-library/react'
import { GroupCard } from './GroupCard'
import * as userContext from '@/contexts/UserContext'
import type { GroupSummary } from '@/types/api'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/contexts/UserContext', () => ({ useUser: jest.fn() }))

const mockUseUser = userContext.useUser as jest.Mock

const mockGroup: GroupSummary = {
  id: 'g1',
  name: 'Amigo Secreto 2026',
  status: 'OPEN',
  owner_id: 'u1',
  user_count: 4,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

beforeEach(() => {
  mockUseUser.mockReturnValue(null)
})

describe('GroupCard', () => {
  it('renders the group name', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByText('Amigo Secreto 2026')).toBeInTheDocument()
  })

  it('renders the member count in plural', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByText('4 participantes')).toBeInTheDocument()
  })

  it('renders "participante" in singular when count is 1', () => {
    render(<GroupCard group={{ ...mockGroup, user_count: 1 }} />)
    expect(screen.getByText('1 participante')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByText('Aberto')).toBeInTheDocument()
  })

  it('links to the group detail page', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/groups/g1')
  })

  it('renders MATCHED status badge', () => {
    render(<GroupCard group={{ ...mockGroup, status: 'MATCHED' }} />)
    expect(screen.getByText('Sorteio realizado')).toBeInTheDocument()
  })

  describe('archived visual distinction', () => {
    it('renders with opacity 0.6 when status is ARCHIVED', () => {
      const { container } = render(<GroupCard group={{ ...mockGroup, status: 'ARCHIVED' }} />)
      const card = container.querySelector('.card') as HTMLElement
      expect(card.style.opacity).toBe('0.6')
    })

    it('renders with opacity 1 when status is OPEN', () => {
      const { container } = render(<GroupCard group={mockGroup} />)
      const card = container.querySelector('.card') as HTMLElement
      expect(card.style.opacity).toBe('1')
    })

    it('renders with opacity 1 when status is MATCHED', () => {
      const { container } = render(<GroupCard group={{ ...mockGroup, status: 'MATCHED' }} />)
      const card = container.querySelector('.card') as HTMLElement
      expect(card.style.opacity).toBe('1')
    })
  })

  describe('owner badge', () => {
    it('renders "Dono" badge when logged-in user is the owner', () => {
      mockUseUser.mockReturnValue({ id: 'u1' })
      render(<GroupCard group={mockGroup} />)
      expect(screen.getByText('Dono')).toBeInTheDocument()
    })

    it('does not render "Dono" badge when logged-in user is not the owner', () => {
      mockUseUser.mockReturnValue({ id: 'u2' })
      render(<GroupCard group={mockGroup} />)
      expect(screen.queryByText('Dono')).not.toBeInTheDocument()
    })

    it('does not render "Dono" badge when user is not logged in', () => {
      mockUseUser.mockReturnValue(null)
      render(<GroupCard group={mockGroup} />)
      expect(screen.queryByText('Dono')).not.toBeInTheDocument()
    })
  })
})
