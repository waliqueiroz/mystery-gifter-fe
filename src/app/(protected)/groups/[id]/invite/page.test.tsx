import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as userContext from '@/contexts/UserContext'
import * as groupService from '@/services/api/groupService'
import * as inviteService from '@/services/api/inviteService'
import { NotFoundError, ApiRequestError } from '@/lib/errors'
import type { Group, GroupInvite } from '@/types/api'

import InvitePage from './page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'g1' }),
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

const mockShowToast = jest.fn()
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('@/contexts/UserContext', () => ({ useUser: jest.fn() }))
jest.mock('@/services/api/groupService', () => ({ getGroup: jest.fn() }))
jest.mock('@/services/api/inviteService', () => ({
  getActiveInvite: jest.fn(),
  createInvite: jest.fn(),
}))

const mockUseUser = userContext.useUser as jest.Mock
const mockGetGroup = groupService.getGroup as jest.Mock
const mockGetActiveInvite = inviteService.getActiveInvite as jest.Mock
const mockCreateInvite = inviteService.createInvite as jest.Mock

const owner = {
  id: 'u1',
  name: 'Ana',
  surname: 'Silva',
  email: 'ana@example.com',
}
const member = {
  id: 'u2',
  name: 'Bob',
  surname: 'Sousa',
  email: 'bob@example.com',
}

function makeGroup(extra: Partial<Group> = {}): Group {
  return {
    id: 'g1',
    name: 'Família',
    description: '',
    users: [],
    owner_id: 'u1',
    matches: [],
    status: 'OPEN',
    created_at: '',
    updated_at: '',
    ...extra,
  }
}

const mockInvite: GroupInvite = {
  id: 'token-abc',
  group_id: 'g1',
  expires_at: '',
  created_at: '',
}

const ORIGIN = window.location.origin

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue(owner)
})

describe('InvitePage', () => {
  it('root container has desk:max-w-content for desktop centering', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    mockGetActiveInvite.mockResolvedValue(mockInvite)
    const { container } = render(<InvitePage />)
    await screen.findByRole('heading', { name: /convite/i })
    const root = container.querySelector('[class*="desk:max-w-content"]')
    expect(root).not.toBeNull()
  })

  it('renders "Convite" heading and back button', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    mockGetActiveInvite.mockResolvedValue(mockInvite)
    render(<InvitePage />)
    await screen.findByText('token-abc', { exact: false })
    expect(
      screen.getByRole('heading', { name: /convite/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /voltar ao grupo/i }),
    ).toBeInTheDocument()
  })

  it('shows invite link and Copy/Share buttons when an active invite exists', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    mockGetActiveInvite.mockResolvedValue(mockInvite)
    Object.assign(navigator, { share: jest.fn() })

    render(<InvitePage />)
    await screen.findByTestId('invite-panel')
    expect(
      screen.getByText(`${ORIGIN}/invite/token-abc`),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /copiar link/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /compartilhar/i }),
    ).toBeInTheDocument()
  })

  it('copies the link to clipboard when "Copiar link" is clicked', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    mockGetActiveInvite.mockResolvedValue(mockInvite)
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<InvitePage />)
    await screen.findByTestId('invite-panel')
    await userEvent.click(screen.getByRole('button', { name: /copiar link/i }))

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        `${ORIGIN}/invite/token-abc`,
      ),
    )
    expect(mockShowToast).toHaveBeenCalledWith({
      message: 'Link copiado!',
      type: 'success',
    })
  })

  it('does NOT show "no invite" section before the skeleton delay elapses', () => {
    jest.useFakeTimers()
    mockGetGroup.mockReturnValue(new Promise(() => {}))
    mockGetActiveInvite.mockReturnValue(new Promise(() => {}))
    render(<InvitePage />)
    // 0 ms: loadingGroup=true, showSkeleton=false — must not flash the "no invite" state
    expect(screen.queryByRole('button', { name: /gerar link de convite/i })).toBeNull()
    expect(screen.queryByText(/peça ao dono/i)).toBeNull()
    jest.useRealTimers()
  })

  describe('when there is no active invite (404)', () => {
    it('owner sees "Gerar link de convite" CTA when there is no active invite (NotFoundError)', async () => {
      mockGetGroup.mockResolvedValue(makeGroup())
      mockGetActiveInvite.mockRejectedValue(new NotFoundError('no active invite found for this group'))
      render(<InvitePage />)
      expect(
        await screen.findByRole('button', { name: /gerar link de convite/i }),
      ).toBeInTheDocument()
    })

    it('treats non-404 ApiRequestError as a real error, not as a missing invite', async () => {
      mockGetGroup.mockResolvedValue(makeGroup())
      mockGetActiveInvite.mockRejectedValue(new ApiRequestError('Erro de servidor.', 500, 'internal_server_error'))
      render(<InvitePage />)
      expect(
        await screen.findByText('Não foi possível carregar'),
      ).toBeInTheDocument()
    })

    it('non-owner sees guidance message with no CTA', async () => {
      mockUseUser.mockReturnValue(member)
      mockGetGroup.mockResolvedValue(makeGroup())
      mockGetActiveInvite.mockRejectedValue(new NotFoundError('no active invite found for this group'))
      render(<InvitePage />)
      expect(
        await screen.findByText(/peça ao dono/i),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /gerar link de convite/i }),
      ).toBeNull()
    })

    it('clicking "Gerar" creates an invite and shows the link', async () => {
      mockGetGroup.mockResolvedValue(makeGroup())
      mockGetActiveInvite.mockRejectedValue(new NotFoundError('no active invite found for this group'))
      mockCreateInvite.mockResolvedValue(mockInvite)
      render(<InvitePage />)
      await userEvent.click(
        await screen.findByRole('button', { name: /gerar link de convite/i }),
      )
      await waitFor(() => expect(mockCreateInvite).toHaveBeenCalledWith('g1'))
      expect(await screen.findByTestId('invite-panel')).toBeInTheDocument()
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Convite gerado!',
        type: 'success',
      })
    })
  })

  describe('when group is MATCHED or ARCHIVED', () => {
    it('MATCHED shows "Convites desabilitados" EmptyState without fetching invite', async () => {
      mockGetGroup.mockResolvedValue(makeGroup({ status: 'MATCHED' }))
      render(<InvitePage />)
      expect(
        await screen.findByText('Convites desabilitados'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/sorteio já foi realizado/i),
      ).toBeInTheDocument()
      expect(mockGetActiveInvite).not.toHaveBeenCalled()
    })

    it('ARCHIVED shows EmptyState with specific message', async () => {
      mockGetGroup.mockResolvedValue(makeGroup({ status: 'ARCHIVED' }))
      render(<InvitePage />)
      expect(
        await screen.findByText('Convites desabilitados'),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/foi arquivado/i),
      ).toBeInTheDocument()
    })
  })

  it('group load failure shows error EmptyState with retry', async () => {
    mockGetGroup.mockRejectedValue(new Error('server error'))
    render(<InvitePage />)
    expect(
      await screen.findByText('Não foi possível carregar'),
    ).toBeInTheDocument()
    expect(screen.getByText('Não foi possível carregar o grupo.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tentar novamente/i }),
    ).toBeInTheDocument()
  })

  it('"Voltar ao grupo" button calls router.push to /groups/[id]', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    mockGetActiveInvite.mockResolvedValue(mockInvite)
    render(<InvitePage />)
    await screen.findByTestId('invite-panel')
    await userEvent.click(
      screen.getByRole('button', { name: /voltar ao grupo/i }),
    )
    expect(mockPush).toHaveBeenCalledWith('/groups/g1')
  })
})
