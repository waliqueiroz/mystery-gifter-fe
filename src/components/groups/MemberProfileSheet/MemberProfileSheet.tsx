'use client'

import { useCallback, useEffect, useState } from 'react'

import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'
import { Icon } from '@/components/ui/Icon/Icon'
import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'
import { useDelayedFlag } from '@/hooks/useDelayedFlag'
import { getUserById } from '@/services/api/userService'
import type { User } from '@/types/api'

interface MemberProfileSheetProps {
  /** ID do membro a buscar — null fecha o sheet. */
  userId: string | null
  /** Notifica o pai que o sheet foi fechado (clique no Fechar, ESC ou backdrop). */
  onClose: () => void
}

/**
 * Visualização rápida read-only dos detalhes de um membro do grupo —
 * substitui o `MemberProfileModal` legado por um `<BottomSheet>` (FR-023 +
 * Q2 — visualização rápida usa sheet, não modal).
 *
 * O fetch dispara cada vez que `userId` muda; loading durante a fetch usa
 * skeleton (FR-024); erro de seção usa `<EmptyState variant="error">` com
 * retry (contracts §3).
 */
export function MemberProfileSheet({
  userId,
  onClose,
}: MemberProfileSheetProps) {
  const open = userId !== null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)

  const showSkeleton = useDelayedFlag(loading, 150)

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const user = await getUserById(id)
      setUserData(user)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar perfil.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      // Limpa quando o sheet fecha — evita flash do membro anterior na
      // próxima abertura
      setUserData(null)
      setError(null)
      return
    }
    fetchUser(userId)
  }, [userId, fetchUser])

  return (
    <BottomSheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
      title="Perfil do participante"
    >
      {error ? (
        <EmptyState
          variant="error"
          icon={<Icon name="CircleAlert" size={28} />}
          title="Não foi possível carregar"
          description={error}
          cta={{
            label: 'Tentar novamente',
            onClick: () => {
              if (userId) fetchUser(userId)
            },
          }}
        />
      ) : showSkeleton ? (
        <div className="flex flex-col gap-2">
          <SkeletonText width="60%" />
          <SkeletonText width="80%" />
        </div>
      ) : userData ? (
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-mg-text">
            {userData.name} {userData.surname}
          </h3>
          <p className="text-sm text-mg-text-muted">{userData.email}</p>
        </div>
      ) : null}
    </BottomSheet>
  )
}
