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
jest.mock('@/components/ui/Toast/useToast', () => ({
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
  describe('estados de carregamento (FR-024 — skeletons, sem spinners)', () => {
    it('NÃO exibe spinner — exibe SkeletonList no carregamento inicial após o delay', async () => {
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
  })

  it('renderiza GroupCards após o load', async () => {
    mockListGroups.mockResolvedValue(
      makeResult([makeGroup('g1'), makeGroup('g2')]),
    )
    render(<GroupList />)
    expect(await screen.findByText('Grupo g1')).toBeInTheDocument()
    expect(screen.getByText('Grupo g2')).toBeInTheDocument()
  })

  it('exibe empty state quando não há grupos', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    expect(await screen.findByText('Nenhum grupo ainda')).toBeInTheDocument()
  })

  it('exibe "Carregar mais" quando há mais páginas', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 30))
    render(<GroupList />)
    expect(
      await screen.findByRole('button', { name: /carregar mais/i }),
    ).toBeInTheDocument()
  })

  it('esconde "Carregar mais" quando todos os grupos foram carregados', async () => {
    mockListGroups.mockResolvedValue(makeResult([makeGroup('g1')], 1))
    render(<GroupList />)
    await screen.findByText('Grupo g1')
    expect(
      screen.queryByRole('button', { name: /carregar mais/i }),
    ).toBeNull()
  })

  it('anexa próxima página ao clicar em "Carregar mais"', async () => {
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

  it('botão "Novo grupo" é um link para /groups/new (FR-023 + Q2)', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await screen.findByText('Nenhum grupo ainda')
    expect(screen.getByRole('link', { name: /novo grupo/i })).toHaveAttribute(
      'href',
      '/groups/new',
    )
  })

  it('CTA do empty state também aponta para /groups/new', async () => {
    mockListGroups.mockResolvedValue(makeResult([]))
    render(<GroupList />)
    await screen.findByText('Nenhum grupo ainda')
    expect(
      screen.getByRole('link', { name: /criar grupo/i }),
    ).toHaveAttribute('href', '/groups/new')
  })

  it('chama listGroups com o userId do contexto', async () => {
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

  it('NÃO chama listGroups quando o usuário do contexto é null', async () => {
    mockUseUser.mockReturnValue(null)
    render(<GroupList />)
    await waitFor(() => expect(mockUseUser).toHaveBeenCalled())
    expect(mockListGroups).not.toHaveBeenCalled()
  })

  it('GroupCard exibe o badge "Dono" quando o usuário é o dono', async () => {
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

  describe('filtros', () => {
    it('renderiza o componente GroupFilters', async () => {
      mockListGroups.mockResolvedValue(makeResult([]))
      render(<GroupList />)
      await screen.findByText('Nenhum grupo ainda')
      expect(screen.getByLabelText(/buscar por nome/i)).toBeInTheDocument()
    })

    it('re-busca com o param "name" após o debounce', async () => {
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

    it('re-busca com novos statuses ao mudar o filtro de status', async () => {
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

    it('re-busca sem status quando todos são desmarcados', async () => {
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

  describe('estado de erro (EmptyState variant="error")', () => {
    it('exibe EmptyState de erro quando a busca inicial falha', async () => {
      mockListGroups.mockRejectedValue(new Error('Falha na conexão.'))
      render(<GroupList />)
      expect(
        await screen.findByText('Erro ao carregar grupos'),
      ).toBeInTheDocument()
      expect(screen.getByText('Falha na conexão.')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /tentar novamente/i }),
      ).toBeInTheDocument()
    })

    it('NÃO dispara toast quando a busca inicial falha', async () => {
      mockListGroups.mockRejectedValue(new Error('Erro.'))
      render(<GroupList />)
      await screen.findByText('Erro ao carregar grupos')
      expect(mockShowToast).not.toHaveBeenCalled()
    })

    it('refaz a busca ao clicar em "Tentar novamente"', async () => {
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
