import type { GroupStatus } from '@/types/api'

const LABELS: Record<GroupStatus, string> = {
  OPEN: 'Aberto',
  MATCHED: 'Sorteio realizado',
  ARCHIVED: 'Arquivado',
}

const CLASS_NAMES: Record<GroupStatus, string> = {
  OPEN: 'mg-badge-open',
  MATCHED: 'mg-badge-matched',
  ARCHIVED: 'mg-badge-archived',
}

interface GroupStatusBadgeProps {
  status: GroupStatus
}

export function GroupStatusBadge({ status }: GroupStatusBadgeProps) {
  return (
    <span className={CLASS_NAMES[status]}>
      {LABELS[status]}
    </span>
  )
}
