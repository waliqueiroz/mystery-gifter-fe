'use client'

import { BottomSheet } from '@/components/ui/BottomSheet/BottomSheet'
import type { User } from '@/types/api'

interface MemberProfileSheetProps {
  /** Dados do membro a exibir — null fecha o sheet. */
  user: User | null
  /** Notifica o pai que o sheet foi fechado (clique no Fechar, ESC ou backdrop). */
  onClose: () => void
}

export function MemberProfileSheet({ user, onClose }: MemberProfileSheetProps) {
  const open = user !== null

  return (
    <BottomSheet
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
      title="Perfil do participante"
    >
      {user && (
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-mg-text">
            {user.name} {user.surname}
          </h3>
          <p className="text-sm text-mg-text-muted">{user.email}</p>
        </div>
      )}
    </BottomSheet>
  )
}
