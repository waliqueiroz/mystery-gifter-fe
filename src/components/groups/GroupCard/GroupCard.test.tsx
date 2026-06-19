import { render, screen } from '@testing-library/react'

import * as userContext from '@/contexts/UserContext'
import type { GroupSummary } from '@/types/api'

import { GroupCard } from './GroupCard'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
    'data-testid': testid,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    'data-testid'?: string
  }) => (
    <a href={href} className={className} data-testid={testid}>
      {children}
    </a>
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

  it('renders the participant count (plural)', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByText('4 participantes')).toBeInTheDocument()
  })

  it('renders "participante" in singular when count=1', () => {
    render(<GroupCard group={{ ...mockGroup, user_count: 1 }} />)
    expect(screen.getByText('1 participante')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByText('Aberto')).toBeInTheDocument()
  })

  it('renders MATCHED badge for a drawn group', () => {
    render(<GroupCard group={{ ...mockGroup, status: 'MATCHED' }} />)
    expect(screen.getByText('Sorteio realizado')).toBeInTheDocument()
  })

  it('points to the detail page via /groups/:id', () => {
    render(<GroupCard group={mockGroup} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/groups/g1')
  })

  it('applies dark card visual with rounded-card and surface background', () => {
    render(<GroupCard group={mockGroup} />)
    const card = screen.getByTestId('group-card')
    expect(card).toHaveClass('rounded-card')
    expect(card).toHaveClass('bg-mg-surface')
  })

  describe('archived state', () => {
    it('applies opacity-60 when status=ARCHIVED', () => {
      render(<GroupCard group={{ ...mockGroup, status: 'ARCHIVED' }} />)
      expect(screen.getByTestId('group-card')).toHaveClass('opacity-60')
    })

    it('does NOT apply opacity-60 when OPEN', () => {
      render(<GroupCard group={mockGroup} />)
      expect(screen.getByTestId('group-card')).not.toHaveClass('opacity-60')
    })

    it('does NOT apply opacity-60 when MATCHED', () => {
      render(<GroupCard group={{ ...mockGroup, status: 'MATCHED' }} />)
      expect(screen.getByTestId('group-card')).not.toHaveClass('opacity-60')
    })
  })

  describe('"Dono" badge', () => {
    it('renders when the logged-in user is the owner', () => {
      mockUseUser.mockReturnValue({ id: 'u1' })
      render(<GroupCard group={mockGroup} />)
      const badge = screen.getByText('Dono')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute(
        'aria-label',
        'Você é o dono deste grupo',
      )
      // Verde funcional aplicado ao badge (FR-008 — sinaliza propriedade)
      expect(badge).toHaveClass('text-mg-green')
    })

    it('does NOT render when another user is logged in', () => {
      mockUseUser.mockReturnValue({ id: 'u2' })
      render(<GroupCard group={mockGroup} />)
      expect(screen.queryByText('Dono')).toBeNull()
    })

    it('does NOT render when nobody is logged in', () => {
      mockUseUser.mockReturnValue(null)
      render(<GroupCard group={mockGroup} />)
      expect(screen.queryByText('Dono')).toBeNull()
    })
  })
})
