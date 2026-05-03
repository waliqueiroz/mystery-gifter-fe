'use client'

import { useState } from 'react'
import type { Group } from '@/types/api'
import { generateDraw } from '@/services/api/groupService'
import Button from '@/components/ui/Button/Button'

interface DrawButtonProps {
  group: Group
  onGroupUpdate: (group: Group) => void
}

const MIN_MEMBERS = 3

export function DrawButton({ group, onGroupUpdate }: DrawButtonProps) {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        type="button"
        loading={loading}
        disabled={isDisabled}
        onClick={handleDraw}
      >
        <i className="fas fa-random mr-2" aria-hidden="true" />
        Realizar sorteio
      </Button>
      {!hasEnoughMembers && isOpen && (
        <p className="mt-2 mb-0 small" style={{ color: 'var(--mg-text-muted)' }}>
          São necessários pelo menos {MIN_MEMBERS} participantes para realizar o sorteio.
        </p>
      )}
    </div>
  )
}
