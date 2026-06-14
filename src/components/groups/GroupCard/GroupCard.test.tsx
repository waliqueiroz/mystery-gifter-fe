import { render, screen } from '@testing-library/react'
import { GroupCard } from './GroupCard'
import type { GroupSummary } from '@/types/api'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockGroup: GroupSummary = {
  id: 'g1',
  name: 'Amigo Secreto 2026',
  status: 'OPEN',
  owner_id: 'u1',
  user_count: 4,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

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
})
