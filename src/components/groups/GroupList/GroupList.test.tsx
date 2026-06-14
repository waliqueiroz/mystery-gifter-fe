import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroupList } from './GroupList'
import * as groupService from '@/services/api/groupService'
import * as session from '@/lib/session'
import type { GroupSearchResult, GroupSummary } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({ listGroups: jest.fn() }))
jest.mock('@/lib/session', () => ({ getUser: jest.fn() }))
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))
const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockListGroups = groupService.listGroups as jest.Mock
const mockGetUser = session.getUser as jest.Mock

function makeGroup(id: string): GroupSummary {
  return { id, name: `Grupo ${id}`, status: 'OPEN', owner_id: 'u1', user_count: 2, created_at: '', updated_at: '' }
}

function makeResult(groups: GroupSummary[], total?: number): GroupSearchResult {
  return { result: groups, paging: { limit: 15, offset: 0, total: total ?? groups.length } }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetUser.mockReturnValue({ id: 'u1', name: 'Test', surname: 'User', email: 't@t.com' })
})

describe('GroupList', () => {
  it('shows loading spinner initially', () => {
    mockListGroups.mockReturnValue(new Promise(() => {}))
    render(<GroupList />)
    expect(screen.getByRole('status', { name: /carregando grupos/i })).toBeInTheDocument()
  })

  it('renders group cards after loading', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1'), makeGroup('g2')]))
    render(<GroupList />)
    expect(await screen.findByText('Grupo g1')).toBeInTheDocument()
    expect(screen.getByText('Grupo g2')).toBeInTheDocument()
  })

  it('shows empty state when no groups', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    expect(await screen.findByText('Nenhum grupo ainda')).toBeInTheDocument()
  })

  it('shows "Carregar mais" button when there are more pages', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 30))
    render(<GroupList />)
    expect(await screen.findByRole('button', { name: /carregar mais/i })).toBeInTheDocument()
  })

  it('hides "Carregar mais" when all groups are loaded', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 1))
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument()
  })

  it('appends next page when "Carregar mais" is clicked', async () => {
    mockListGroups
      .mockResolvedValueOnce({ result: [makeGroup('g1')], paging: { limit: 15, offset: 0, total: 16 } })
      .mockResolvedValueOnce({ result: [makeGroup('g2')], paging: { limit: 15, offset: 15, total: 16 } })
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    await userEvent.click(screen.getByRole('button', { name: /carregar mais/i }))
    expect(await screen.findByText('Grupo g2')).toBeInTheDocument()
    expect(screen.getByText('Grupo g1')).toBeInTheDocument()
  })

  it('opens CreateGroupModal when "Novo grupo" is clicked', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await screen.findByText('Nenhum grupo ainda')
    await userEvent.click(screen.getByRole('button', { name: /novo grupo/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls listGroups with the userId from session', async () => {
    mockGetUser.mockReturnValue({ id: 'user-42', name: 'Test', surname: 'User', email: 't@t.com' })
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await waitFor(() =>
      expect(mockListGroups).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-42' })),
    )
  })

  it('does not call listGroups when there is no session user', async () => {
    mockGetUser.mockReturnValue(null)
    render(<GroupList />)
    await waitFor(() => expect(mockGetUser).toHaveBeenCalled())
    expect(mockListGroups).not.toHaveBeenCalled()
  })
})
