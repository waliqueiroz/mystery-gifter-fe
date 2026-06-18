'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal'
import { Icon } from '@/components/ui/Icon/Icon'
import { useToast } from '@/components/ui/Toast/useToast'
import { archiveGroup, reopenGroup } from '@/services/api/groupService'
import type { Group } from '@/types/api'

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
        modal === 'reopen'
          ? await reopenGroup(group.id)
          : await archiveGroup(group.id)
      onGroupUpdate(updated)
      setModal('none')
    } catch (err) {
      showToast({
        message:
          err instanceof Error
            ? err.message
            : 'Ocorreu um erro. Tente novamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {group.status === 'MATCHED' && (
          <Button
            type="button"
            variant="outline"
            shape="pill"
            size="sm"
            onClick={() => setModal('reopen')}
            disabled={loading}
            iconLeft={<Icon name="RotateCcw" size={14} />}
          >
            Reabrir grupo
          </Button>
        )}
        {group.status !== 'ARCHIVED' && (
          <Button
            type="button"
            variant="outline"
            shape="pill"
            size="sm"
            onClick={() => setModal('archive')}
            disabled={loading}
            iconLeft={<Icon name="Archive" size={14} />}
            className="text-mg-text-negative border-mg-text-negative hover:border-mg-text-negative"
          >
            Arquivar grupo
          </Button>
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
