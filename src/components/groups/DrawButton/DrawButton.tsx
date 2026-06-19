'use client'

import { useState } from 'react'

import Button from '@/components/ui/Button/Button'
import { Icon } from '@/components/ui/Icon/Icon'
import { useToast } from '@/hooks/useToast'
import { generateDraw } from '@/services/api/groupService'
import type { Group } from '@/types/api'

interface DrawButtonProps {
  group: Group
  onGroupUpdate: (group: Group) => void
}

const MIN_MEMBERS = 3

export function DrawButton({ group, onGroupUpdate }: DrawButtonProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const hasEnoughMembers = group.users.length >= MIN_MEMBERS
  const isOpen = group.status === 'OPEN'
  const isDisabled = !hasEnoughMembers || !isOpen

  async function handleDraw() {
    if (isDisabled) return
    setLoading(true)
    try {
      const updated = await generateDraw(group.id)
      onGroupUpdate(updated)
    } catch (err) {
      showToast({
        message:
          err instanceof Error ? err.message : 'Erro ao realizar sorteio.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        shape="pill-lg"
        size="lg"
        loading={loading}
        disabled={isDisabled}
        onClick={handleDraw}
        iconLeft={<Icon name="Shuffle" size={18} />}
      >
        Realizar sorteio
      </Button>
      {!hasEnoughMembers && isOpen && (
        <p className="text-xs text-mg-text-muted">
          São necessários pelo menos {MIN_MEMBERS} participantes para
          realizar o sorteio.
        </p>
      )}
    </div>
  )
}
