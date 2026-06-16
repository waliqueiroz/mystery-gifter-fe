import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroupList } from './GroupList'
import * as groupService from '@/services/api/groupService'
import * as userContext from '@/contexts/UserContext'
import type { GroupSearchResult, GroupSummary } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({ listGroups: jest.fn() }))
jest.mock('@/contexts/UserContext', () => ({ useUser: jest.fn() }))
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
const mockUseUser = userContext.useUser as jest.Mock

function makeGroup(id: string, extra: Partial<GroupSummary> = {}): GroupSummary {
  return {
    id,
    name: `Grupo ${id}`,
    status: 'OPEN',
    owner_id: 'u1',
    user_count: 2,
    created_at: '',
    updated_at: '',
    ...extra,
  }
}

function makeResult(groups: GroupSummary[], total?: number): GroupSearchResult {
  return { result: groups, paging: { limit: 15, offset: 0, total: total ?? groups.length } }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue({ id: 'u1', name: 'Test', surname: 'User', email: 't@t.com' })
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

  it('calls listGroups with the userId from context', async () => {
    mockUseUser.mockReturnValue({ id: 'user-42', name: 'Test', surname: 'User', email: 't@t.com' })
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await waitFor(() =>
      expect(mockListGroups).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-42' })),
    )
  })

  it('does not call listGroups when context user is null', async () => {
    mockUseUser.mockReturnValue(null)
    render(<GroupList />)
    await waitFor(() => expect(mockUseUser).toHaveBeenCalled())
    expect(mockListGroups).not.toHaveBeenCalled()
  })

  it('GroupCard shows owner badge when context user is the group owner', async () => {
    mockUseUser.mockReturnValue({ id: 'u1', name: 'Test', surname: 'User', email: 't@t.com' })
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')]))
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    expect(screen.getByText('Dono')).toBeInTheDocument()
  })

  describe('filter state', () => {
    it('renders GroupFilters component', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      expect(screen.getByRole('textbox', { name: /buscar por nome/i })).toBeInTheDocument()
    })

    it('re-fetches with name param after debounce when search changes', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      jest.useFakeTimers()
      fireEvent.change(
        screen.getByRole('textbox', { name: /buscar por nome/i }),
        { target: { value: 'n' } },
      )
      act(() => jest.advanceTimersByTime(400))
      jest.useRealTimers()
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({ name: 'n' }),
        ),
      )
    })

    it('shows filter spinner instead of empty state while re-fetching', async () => {
      mockListGroups
        .mockResolvedValueOnce(makeResult([]))
        .mockReturnValueOnce(new Promise(() => {}))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      await userEvent.click(screen.getByRole('checkbox', { name: 'Arquivado' }))
      expect(screen.getByRole('status', { name: /filtrando grupos/i })).toBeInTheDocument()
      expect(screen.queryByText('Nenhum grupo ainda')).not.toBeInTheDocument()
    })

    it('re-fetches with new statuses when status filter changes', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      await userEvent.click(screen.getByRole('checkbox', { name: 'Arquivado' }))
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({ statuses: expect.arrayContaining(['ARCHIVED']) }),
        ),
      )
    })

    it('re-fetches without status params when all statuses are deselected', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      await userEvent.click(screen.getByRole('checkbox', { name: 'Aberto' }))
      await userEvent.click(screen.getByRole('checkbox', { name: 'Sorteado' }))
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({ statuses: [] }),
        ),
      )
    })
  })

  describe('error state', () => {
    it('shows inline error message when initial fetch fails', async () => {
      mockListGroups.mockRejectedValue(new Error('Falha na conexão.'))
      render(<GroupList />)
      expect(await screen.findByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Falha na conexão.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
    })

    it('does not call showToast on initial fetch failure', async () => {
      mockListGroups.mockRejectedValue(new Error('Erro.'))
      render(<GroupList />)
      await screen.findByRole('alert')
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('retries fetch when "Tentar novamente" is clicked', async () => {
      mockListGroups
        .mockRejectedValueOnce(new Error('Erro.'))
        .mockResolvedValueOnce(makeResult([makeGroup('g1')]))
      render(<GroupList />)
      await screen.findByRole('alert')
      await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
      expect(await screen.findByText('Grupo g1')).toBeInTheDocument()
    })
  })
})
