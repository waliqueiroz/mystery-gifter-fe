import { cn } from '@/lib/cn'
import type { GroupStatus } from '@/types/api'

const LABELS: Record<GroupStatus, string> = {
  OPEN: 'Aberto',
  MATCHED: 'Sorteio realizado',
  ARCHIVED: 'Arquivado',
}

/**
 * Cores semânticas dos badges. O verde é aplicado a OPEN (sinaliza grupo
 * ativo aceitando entradas — uso funcional, FR-008). MATCHED é neutro
 * (apenas estado), ARCHIVED é muted (passivo).
 */
const VARIANT: Record<GroupStatus, string> = {
  OPEN: 'bg-mg-green/10 text-mg-green',
  MATCHED: 'bg-mg-surface-2 text-mg-text',
  ARCHIVED: 'bg-mg-surface-2 text-mg-text-muted',
}

interface GroupStatusBadgeProps {
  status: GroupStatus
}

export function GroupStatusBadge({ status }: GroupStatusBadgeProps) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-pill px-3 py-1 text-[10px] font-bold uppercase tracking-btn',
        VARIANT[status],
      )}
    >
      {LABELS[status]}
    </span>
  )
}
