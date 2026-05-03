'use client'

import { useState } from 'react'
import type { Group } from '@/types/api'
import { reopenGroup, archiveGroup } from '@/services/api/groupService'
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal'

type ModalState = 'none' | 'reopen' | 'archive'

interface GroupActionsProps {
  group: Group
  onGroupUpdate: (group: Group) => void
}

export function GroupActions({ group, onGroupUpdate }: GroupActionsProps) {
  const [modal, setModal] = useState<ModalState>('none')
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      const updated =
        modal === 'reopen' ? await reopenGroup(group.id) : await archiveGroup(group.id)
      onGroupUpdate(updated)
      setModal('none')
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
        isOpen={modal === 'reopen'}
        message="Tem certeza que deseja reabrir o grupo? O resultado do sorteio atual será apagado e os participantes poderão entrar novamente."
        confirmLabel="Reabrir"
        onConfirm={handleConfirm}
        onCancel={() => setModal('none')}
      />

      <ConfirmModal
        isOpen={modal === 'archive'}
        message="Tem certeza que deseja arquivar este grupo? Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Arquivar"
        onConfirm={handleConfirm}
        onCancel={() => setModal('none')}
      />
    </>
  )
}
