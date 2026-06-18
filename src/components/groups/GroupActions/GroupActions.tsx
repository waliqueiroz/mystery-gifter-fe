'use client'

import { useState } from 'react'
import type { Group } from '@/types/api'
import { reopenGroup, archiveGroup } from '@/services/api/groupService'
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal'
import { useToast } from '@/components/ui/Toast/useToast'

type ModalState = 'none' | 'reopen' | 'archive'

interface GroupActionsProps {
  group: Group
  onGroupUpdate: (group: Group) => void
}

export function GroupActions({ group, onGroupUpdate }: GroupActionsProps) {
  const { showToast } = useToast()
  const [modal, setModal] = useState<ModalState>('none')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      const updated =
        modal === 'reopen' ? await reopenGroup(group.id) : await archiveGroup(group.id)
      onGroupUpdate(updated)
      setModal('none')
    } catch (err) {
      showToast({
        message: err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {group.status === 'MATCHED' && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setModal('reopen')}
            disabled={loading}
          >
            <i className="fas fa-redo mr-1" aria-hidden="true" />
            Reabrir grupo
          </button>
        )}
        {group.status !== 'ARCHIVED' && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setModal('archive')}
            disabled={loading}
          >
            <i className="fas fa-archive mr-1" aria-hidden="true" />
            Arquivar grupo
          </button>
        )}
      </div>

      <ConfirmModal
        open={modal === 'reopen'}
        onOpenChange={(o) => !o && setModal('none')}
        title="Reabrir grupo"
        body="Tem certeza que deseja reabrir o grupo? O resultado do sorteio atual será apagado e os participantes poderão entrar novamente."
        confirmLabel="Reabrir"
        onConfirm={handleConfirm}
        isLoading={loading}
      />

      <ConfirmModal
        open={modal === 'archive'}
        onOpenChange={(o) => !o && setModal('none')}
        title="Arquivar grupo"
        body="Tem certeza que deseja arquivar este grupo? Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Arquivar"
        destructive
        onConfirm={handleConfirm}
        isLoading={loading}
      />
    </>
  )
}
