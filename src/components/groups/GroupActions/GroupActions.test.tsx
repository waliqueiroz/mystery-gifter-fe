import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroupActions } from './GroupActions'
import * as groupService from '@/services/api/groupService'
import type { Group } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({
  reopenGroup: jest.fn(),
  archiveGroup: jest.fn(),
}))

const mockShowToast = jest.fn()
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockReopenGroup = groupService.reopenGroup as jest.Mock
const mockArchiveGroup = groupService.archiveGroup as jest.Mock

function makeGroup(status: Group['status']): Group {
  return { id: 'g1', name: 'G', description: '', users: [], owner_id: 'u1', matches: [], status, created_at: '', updated_at: '' }
}

beforeEach(() => jest.clearAllMocks())

describe('GroupActions', () => {
  describe('OPEN group', () => {
    it('shows archive button but not reopen', () => {
      render(<GroupActions group={makeGroup('OPEN')} onGroupUpdate={() => {}} />)
      expect(screen.getByRole('button', { name: /arquivar grupo/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /reabrir grupo/i })).not.toBeInTheDocument()
    })
  })

  describe('MATCHED group', () => {
    it('shows both reopen and archive buttons', () => {
      render(<GroupActions group={makeGroup('MATCHED')} onGroupUpdate={() => {}} />)
      expect(screen.getByRole('button', { name: /reabrir grupo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /arquivar grupo/i })).toBeInTheDocument()
    })

    it('shows confirm modal when reopen is clicked', async () => {
      render(<GroupActions group={makeGroup('MATCHED')} onGroupUpdate={() => {}} />)
      await userEvent.click(screen.getByRole('button', { name: /reabrir grupo/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/resultado do sorteio atual será apagado/i)).toBeInTheDocument()
    })

    it('calls reopenGroup and fires onGroupUpdate on confirm', async () => {
      const openGroup = makeGroup('OPEN')
      mockReopenGroup.mockResolvedValue(openGroup)
      const onGroupUpdate = jest.fn()
      render(<GroupActions group={makeGroup('MATCHED')} onGroupUpdate={onGroupUpdate} />)
      await userEvent.click(screen.getByRole('button', { name: /reabrir grupo/i }))
      await userEvent.click(screen.getByRole('button', { name: /^reabrir$/i }))
      await waitFor(() => expect(mockReopenGroup).toHaveBeenCalledWith('g1'))
      expect(onGroupUpdate).toHaveBeenCalledWith(openGroup)
    })
  })

  describe('archive flow', () => {
    it('shows confirm modal when archive is clicked', async () => {
      render(<GroupActions group={makeGroup('OPEN')} onGroupUpdate={() => {}} />)
      await userEvent.click(screen.getByRole('button', { name: /arquivar grupo/i }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/ação é permanente/i)).toBeInTheDocument()
    })

    it('calls archiveGroup and fires onGroupUpdate on confirm', async () => {
      const archivedGroup = makeGroup('ARCHIVED')
      mockArchiveGroup.mockResolvedValue(archivedGroup)
      const onGroupUpdate = jest.fn()
      render(<GroupActions group={makeGroup('OPEN')} onGroupUpdate={onGroupUpdate} />)
      await userEvent.click(screen.getByRole('button', { name: /arquivar grupo/i }))
      await userEvent.click(screen.getByRole('button', { name: /^arquivar$/i }))
      await waitFor(() => expect(mockArchiveGroup).toHaveBeenCalledWith('g1'))
      expect(onGroupUpdate).toHaveBeenCalledWith(archivedGroup)
    })

    it('dismisses the modal on cancel', async () => {
      render(<GroupActions group={makeGroup('OPEN')} onGroupUpdate={() => {}} />)
      await userEvent.click(screen.getByRole('button', { name: /arquivar grupo/i }))
      await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('ARCHIVED group', () => {
    it('shows no action buttons', () => {
      render(<GroupActions group={makeGroup('ARCHIVED')} onGroupUpdate={() => {}} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('shows error toast when reopen fails', async () => {
      mockReopenGroup.mockRejectedValue(new Error('server error'))
      render(<GroupActions group={makeGroup('MATCHED')} onGroupUpdate={() => {}} />)
      await userEvent.click(screen.getByRole('button', { name: /reabrir grupo/i }))
      await userEvent.click(screen.getByRole('button', { name: /^reabrir$/i }))
      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith({ message: 'Ocorreu um erro. Tente novamente.', type: 'error' }),
      )
    })

    it('shows error toast when archive fails', async () => {
      mockArchiveGroup.mockRejectedValue(new Error('server error'))
      render(<GroupActions group={makeGroup('OPEN')} onGroupUpdate={() => {}} />)
      await userEvent.click(screen.getByRole('button', { name: /arquivar grupo/i }))
      await userEvent.click(screen.getByRole('button', { name: /^arquivar$/i }))
      await waitFor(() =>
        expect(mockShowToast).toHaveBeenCalledWith({ message: 'Ocorreu um erro. Tente novamente.', type: 'error' }),
      )
    })
  })
})
