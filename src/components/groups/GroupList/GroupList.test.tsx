import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as userContext from '@/contexts/UserContext'
import * as groupService from '@/services/api/groupService'
import type { GroupSearchResult, GroupSummary } from '@/types/api'

import { GroupList } from './GroupList'

jest.mock('@/services/api/groupService', () => ({ listGroups: jest.fn() }))
jest.mock('@/contexts/UserContext', () => ({ useUser: jest.fn() }))
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

const mockShowToast = jest.fn()
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockListGroups = groupService.listGroups as jest.Mock
const mockUseUser = userContext.useUser as jest.Mock

function makeGroup(
  id: string,
  extra: Partial<GroupSummary> = {},
): GroupSummary {
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

function makeResult(
  groups: GroupSummary[],
  total?: number,
): GroupSearchResult {
  return {
    result: groups,
    paging: { limit: 15, offset: 0, total: total ?? groups.length },
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue({
    id: 'u1',
    name: 'Test',
    surname: 'User',
    email: 't@t.com',
  })
})

describe('GroupList', () => {
  describe('loading states (FR-024 — skeletons, no spinners)', () => {
    it('does NOT show spinner — displays SkeletonList on initial load after the delay', async () => {
      jest.useFakeTimers()
      mockListGroups.mockReturnValue(new Promise(() => {}))
      render(<GroupList />)
      // antes do useDelayedFlag (150ms) — ainda nenhum skeleton
      expect(screen.queryByTestId('group-list-skeleton')).toBeNull()
      act(() => {
        jest.advanceTimersByTime(160)
      })
      expect(screen.getByTestId('group-list-skeleton')).toBeInTheDocument()
      // confirmar que NÃO há spinner em lugar algum
      expect(screen.queryByRole('status', { name: /carregando/i })).toBeNull()
      jest.useRealTimers()
    })

    it('does NOT show empty state before the skeleton delay elapses', () => {
      jest.useFakeTimers()
      mockListGroups.mockReturnValue(new Promise(() => {}))
      render(<GroupList />)
      // 0 ms: loading=true, showSkeleton=false, groups=[] — must render neither
      expect(screen.queryByText('Nenhum grupo ainda')).toBeNull()
      expect(screen.queryByTestId('group-list-skeleton')).toBeNull()
      jest.useRealTimers()
    })
  })

  it('renders GroupCards after load', async () => {
    mockListGroups.mockResolvedValue(
      makeResult([makeGroup('g1'), makeGroup('g2')]),
    )
    render(<GroupList />)
    expect(await screen.findByText('Grupo g1')).toBeInTheDocument()
    expect(screen.getByText('Grupo g2')).toBeInTheDocument()
  })

  it('displays empty state when there are no groups', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    expect(await screen.findByText('Nenhum grupo ainda')).toBeInTheDocument()
  })

  it('displays "Carregar mais" when there are more pages', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 30))
    render(<GroupList />)
    expect(
      await screen.findByRole('button', { name: /carregar mais/i }),
    ).toBeInTheDocument()
  })

  it('hides "Carregar mais" when all groups have been loaded', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 1))
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    expect(
      screen.queryByRole('button', { name: /carregar mais/i }),
    ).toBeNull()
  })

  it('appends next page when clicking "Carregar mais"', async () => {
    mockListGroups
      .mockResolvedValueOnce({
        result: [makeGroup('g1')],
        paging: { limit: 15, offset: 0, total: 16 },
      })
      .mockResolvedValueOnce({
        result: [makeGroup('g2')],
        paging: { limit: 15, offset: 15, total: 16 },
      })
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    await userEvent.click(
      screen.getByRole('button', { name: /carregar mais/i }),
    )
    expect(await screen.findByText('Grupo g2')).toBeInTheDocument()
    expect(screen.getByText('Grupo g1')).toBeInTheDocument()
  })

  it('"Novo grupo" button is a link to /groups/new (FR-023 + Q2)', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await screen.findByText('Nenhum grupo ainda')
    expect(screen.getByRole('link', { name: /novo grupo/i })).toHaveAttribute(
      'href',
      '/groups/new',
    )
  })

  it('empty state CTA also points to /groups/new', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await screen.findByText('Nenhum grupo ainda')
    expect(
      screen.getByRole('link', { name: /criar grupo/i }),
    ).toHaveAttribute('href', '/groups/new')
  })

  it('calls listGroups with the userId from context', async () => {
    mockUseUser.mockReturnValue({
      id: 'user-42',
      name: 'Test',
      surname: 'User',
      email: 't@t.com',
    })
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await waitFor(() =>
      expect(mockListGroups).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-42' }),
      ),
    )
  })

  it('does NOT call listGroups when the context user is null', async () => {
    mockUseUser.mockReturnValue(null)
    render(<GroupList />)
    await waitFor(() => expect(mockUseUser).toHaveBeenCalled())
    expect(mockListGroups).not.toHaveBeenCalled()
  })

  it('GroupCard displays the "Dono" badge when the user is the owner', async () => {
    mockUseUser.mockReturnValue({
      id: 'u1',
      name: 'Test',
      surname: 'User',
      email: 't@t.com',
    })
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')]))
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    expect(screen.getByText('Dono')).toBeInTheDocument()
  })

  describe('filters', () => {
    it('renders the GroupFilters component', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      expect(screen.getByLabelText(/buscar por nome/i)).toBeInTheDocument()
    })

    it('re-fetches with the "name" param after debounce', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      jest.useFakeTimers()
      fireEvent.change(screen.getByLabelText(/buscar por nome/i), {
        target: { value: 'n' },
      })
      act(() => jest.advanceTimersByTime(400))
      jest.useRealTimers()
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({ name: 'n' }),
        ),
      )
    })

    it('re-fetches with new statuses when the status filter changes', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      await userEvent.click(screen.getByRole('button', { name: 'Arquivado' }))
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({
            statuses: expect.arrayContaining(['ARCHIVED']),
          }),
        ),
      )
    })

    it('re-fetches without statuses when all are deselected', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      await userEvent.click(screen.getByRole('button', { name: 'Aberto' }))
      await userEvent.click(screen.getByRole('button', { name: 'Sorteado' }))
      await waitFor(() =>
        expect(mockListGroups).toHaveBeenLastCalledWith(
          expect.objectContaining({ statuses: [] }),
        ),
      )
    })
  })

  describe('error state (EmptyState variant="error")', () => {
    it('displays error EmptyState when the initial fetch fails', async () => {
      mockListGroups.mockRejectedValue(new Error('network error'))
      render(<GroupList />)
      expect(
        await screen.findByText('Erro ao carregar grupos'),
      ).toBeInTheDocument()
      expect(screen.getByText('Erro ao carregar os grupos.')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /tentar novamente/i }),
      ).toBeInTheDocument()
    })

    it('does NOT fire toast when the initial fetch fails', async () => {
      mockListGroups.mockRejectedValue(new Error('Erro.'))
      render(<GroupList />)
      await screen.findByText('Erro ao carregar grupos')
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('retries the fetch when clicking "Tentar novamente"', async () => {
      mockListGroups
        .mockRejectedValueOnce(new Error('Erro.'))
        .mockResolvedValueOnce(makeResult([makeGroup('g1')]))
      render(<GroupList />)
      await screen.findByText('Erro ao carregar grupos')
      await userEvent.click(
        screen.getByRole('button', { name: /tentar novamente/i }),
      )
      expect(await screen.findByText('Grupo g1')).toBeInTheDocument()
    })
  })
})
